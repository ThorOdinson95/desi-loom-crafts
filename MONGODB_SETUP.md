# MongoDB Local Integration Guide

This guide explains how to integrate your Handloom Heritage app with a local MongoDB database.

## Architecture

```
React Frontend (Lovable) → Backend API (Node.js/Express) → MongoDB (Local)
```

## Prerequisites

- Node.js installed (v16+)
- MongoDB installed locally OR Docker

## Step 1: Install MongoDB

### Option A: Download MongoDB
1. Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download and install MongoDB Community Edition
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

### Option B: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Step 2: Create Backend Server

Create a new directory outside your Lovable project:

```bash
mkdir handloom-backend
cd handloom-backend
npm init -y
npm install express mongoose cors dotenv bcryptjs
```

Create `server.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/handloom-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String,
  stock: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: { type: String, default: 'pending' },
  shippingAddress: Object,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// API Routes

// User Authentication
app.post('/api/users/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    
    // Don't send password back
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product APIs
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order APIs
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Stats
app.get('/api/stats/orders', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('MongoDB connected to handloom-shop database');
});
```

## Step 3: Seed Initial Product Data (Optional)

Create `seed.js` in your backend folder:

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/handloom-shop');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String,
  stock: Number
});

const Product = mongoose.model('Product', ProductSchema);

const products = [
  {
    name: 'Traditional Handloom Saree',
    price: 2999,
    category: 'Women',
    image: '/src/assets/saree-1.jpg',
    description: 'Beautiful handwoven saree with traditional patterns',
    stock: 15
  },
  {
    name: 'Cotton Kurta',
    price: 899,
    category: 'Men',
    image: '/src/assets/kurta-1.jpg',
    description: 'Comfortable handloom cotton kurta',
    stock: 25
  },
  // Add more products...
];

async function seed() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Database seeded!');
  process.exit();
}

seed();
```

Run: `node seed.js`

## Step 4: Run Both Applications

### Terminal 1 - Backend:
```bash
cd handloom-backend
node server.js
```
Backend will run on http://localhost:3001

### Terminal 2 - Frontend (Lovable):
The Lovable app already has the API integration configured in `src/lib/api.ts`.
Just run your Lovable preview as normal.

## MongoDB Collections Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String,
  stock: Number
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: String,
  shippingAddress: Object,
  createdAt: Date
}
```

## Testing with MongoDB Compass

1. Download MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. View your `handloom-shop` database
4. Browse collections: users, products, orders

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/signup | Create new user |
| POST | /api/users/login | Login user |
| GET | /api/products | Get all products |
| POST | /api/products | Create product |
| POST | /api/orders | Create order |
| GET | /api/orders/:userId | Get user orders |
| GET | /api/orders | Get all orders |
| GET | /api/stats/orders | Get order statistics |

## Security Notes

⚠️ This is a development setup. For production:
- Use environment variables for MongoDB connection
- Implement JWT tokens instead of simple auth
- Add rate limiting
- Use HTTPS
- Add input validation (express-validator)
- Implement proper error handling
- Add authentication middleware

## Troubleshooting

**CORS errors?**
- Make sure backend has `cors()` middleware enabled

**Connection refused?**
- Check MongoDB is running: `mongosh` should connect
- Verify port 3001 is not in use

**Can't see data?**
- Check browser console for API errors
- Verify backend logs for MongoDB connection
- Use MongoDB Compass to verify data exists
