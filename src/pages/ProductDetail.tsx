import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

// Import images
import sareeImage from "@/assets/saree-1.jpg";
import sareeImage2 from "@/assets/saree-2.jpg";
import dressImage from "@/assets/dress-1.jpg";
import dressImage2 from "@/assets/dress-2.jpg";
import shirtImage from "@/assets/shirt-1.jpg";
import bagImage from "@/assets/bag-1.jpg";
import bagImage2 from "@/assets/bag-2.jpg";
import kurtaImage from "@/assets/kurta-1.jpg";
import kurtiImage from "@/assets/kurti-1.jpg";
import dupattaImage from "@/assets/dupatta-1.jpg";

// Mock product data (same as Index.tsx)
const mockProducts = [
  {
    id: "1",
    name: "Traditional Kanchipuram Silk Saree with Golden Zari Work",
    price: 12500,
    originalPrice: 15000,
    image: sareeImage,
    category: "Sarees",
    isHandmade: true,
    rating: 4.8,
    reviews: 124,
    description: "Exquisite Kanchipuram silk saree handwoven with traditional golden zari work. This masterpiece showcases the rich heritage of South Indian craftsmanship with intricate patterns that have been passed down through generations.",
    features: ["100% Pure Silk", "Handwoven Zari Work", "Traditional Design", "Dry Clean Only"],
    inStock: true,
    stockCount: 15
  },
  {
    id: "2", 
    name: "Handloom Cotton Block Print Dress - Indigo Collection",
    price: 3200,
    originalPrice: 4000,
    image: dressImage,
    category: "Dresses",
    isHandmade: true,
    rating: 4.6,
    reviews: 89,
    description: "Beautiful handloom cotton dress featuring traditional block print in stunning indigo color. Made from premium cotton with eco-friendly natural dyes.",
    features: ["Organic Cotton", "Natural Dyes", "Block Print Design", "Machine Washable"],
    inStock: true,
    stockCount: 8
  },
  {
    id: "3",
    name: "Pure Cotton Handwoven Kurta for Men - Natural Beige",
    price: 2800,
    image: shirtImage,
    category: "Men's Shirts",
    isHandmade: true,
    rating: 4.7,
    reviews: 56,
    description: "Comfortable and elegant handwoven cotton kurta in natural beige. Perfect for casual and semi-formal occasions with its breathable fabric and classic design.",
    features: ["100% Cotton", "Handwoven Fabric", "Comfortable Fit", "Machine Washable"],
    inStock: true,
    stockCount: 12
  },
  {
    id: "4",
    name: "Handcrafted Jute Tote Bag with Traditional Motifs",
    price: 1200,
    originalPrice: 1500,
    image: bagImage,
    category: "Bags",
    isHandmade: true,
    rating: 4.5,
    reviews: 73,
    description: "Eco-friendly jute tote bag with beautiful traditional motifs. Spacious and durable, perfect for daily use while supporting sustainable fashion.",
    features: ["Eco-friendly Jute", "Traditional Motifs", "Spacious Design", "Durable Construction"],
    inStock: true,
    stockCount: 25
  },
  {
    id: "5",
    name: "Banarasi Silk Saree - Wedding Collection",
    price: 18000,
    originalPrice: 22000,
    image: sareeImage2,
    category: "Sarees",
    isHandmade: true,
    rating: 4.9,
    reviews: 156,
    description: "Luxurious Banarasi silk saree from our exclusive wedding collection. Features intricate gold and silver zari work that makes it perfect for special occasions.",
    features: ["Pure Banarasi Silk", "Gold & Silver Zari", "Wedding Collection", "Gift Wrapped"],
    inStock: true,
    stockCount: 5
  },
  {
    id: "6",
    name: "Handloom Cotton Palazzo Dress Set",
    price: 2800,
    image: dressImage2,
    category: "Dresses",
    isHandmade: true,
    rating: 4.4,
    reviews: 67,
    description: "Comfortable handloom cotton palazzo dress set perfect for summer. The flowing silhouette and breathable fabric make it ideal for warm weather.",
    features: ["Handloom Cotton", "Palazzo Style", "Summer Wear", "Comfortable Fit"],
    inStock: true,
    stockCount: 10
  },
  {
    id: "7",
    name: "Traditional White Cotton Kurta - Festival Edition",
    price: 3500,
    originalPrice: 4200,
    image: kurtaImage,
    category: "Men's Kurtas",
    isHandmade: true,
    rating: 4.6,
    reviews: 89,
    description: "Classic white cotton kurta from our festival edition. Features subtle embroidery and premium cotton fabric, perfect for celebrations and formal occasions.",
    features: ["Premium Cotton", "Subtle Embroidery", "Festival Edition", "Classic Design"],
    inStock: true,
    stockCount: 7
  },
  {
    id: "8",
    name: "Handwoven Silk Dupatta with Zari Border",
    price: 2200,
    originalPrice: 2800,
    image: dupattaImage,
    category: "Dupattas",
    isHandmade: true,
    rating: 4.7,
    reviews: 112,
    description: "Elegant handwoven silk dupatta with traditional zari border work. Perfect accessory to complement ethnic wear with its rich texture and beautiful design.",
    features: ["Pure Silk", "Zari Border", "Handwoven", "Versatile Styling"],
    inStock: true,
    stockCount: 18
  },
  {
    id: "9",
    name: "Block Print Cotton Kurti - Summer Collection",
    price: 1800,
    image: kurtiImage,
    category: "Kurtis",
    isHandmade: true,
    rating: 4.5,
    reviews: 95,
    description: "Refreshing block print cotton kurti from our summer collection. Features vibrant colors and comfortable cotton fabric perfect for everyday wear.",
    features: ["Block Print Design", "Summer Collection", "Cotton Fabric", "Vibrant Colors"],
    inStock: true,
    stockCount: 20
  },
  {
    id: "10",
    name: "Handcrafted Leather Crossbody Bag",
    price: 2500,
    originalPrice: 3200,
    image: bagImage2,
    category: "Bags",
    isHandmade: true,
    rating: 4.8,
    reviews: 67,
    description: "Stylish handcrafted leather crossbody bag with traditional craftsmanship. Features multiple compartments and adjustable strap for convenience.",
    features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap", "Handcrafted"],
    inStock: true,
    stockCount: 14
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-subtle-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${product.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-subtle-gradient pt-[var(--header-height)]">
      <Header
        cartCount={0}
        onCartClick={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-card shadow-card-handloom">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      In Stock ({product.stockCount} items left)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart & Favorite */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className="px-6"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹2000</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7 day return policy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Authentic</p>
                  <p className="text-xs text-muted-foreground">100% handmade products</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;