import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import CartSidebar from "@/components/CartSidebar";

// Import images
import heroImage from "@/assets/hero-handloom.jpg";
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

// Mock product data
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
    reviews: 124
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
    reviews: 89
  },
  {
    id: "3",
    name: "Pure Cotton Handwoven Kurta for Men - Natural Beige",
    price: 2800,
    image: shirtImage,
    category: "Men's Shirts",
    isHandmade: true,
    rating: 4.7,
    reviews: 56
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
    reviews: 73
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
    reviews: 156
  },
  {
    id: "6",
    name: "Handloom Cotton Palazzo Dress Set",
    price: 2800,
    image: dressImage2,
    category: "Dresses",
    isHandmade: true,
    rating: 4.4,
    reviews: 67
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
    reviews: 89
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
    reviews: 112
  },
  {
    id: "9",
    name: "Block Print Cotton Kurti - Summer Collection",
    price: 1800,
    image: kurtiImage,
    category: "Kurtis",
    isHandmade: true,
    rating: 4.5,
    reviews: 95
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
    reviews: 67
  }
];

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isHandmade: boolean;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  isHandmade: boolean;
  rating: number;
}

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50000],
    isHandmade: false,
    rating: 0
  });

  // Filter products based on search, category, and filters
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter from navbar
      if (selectedCategory !== "All Products" && product.category !== selectedCategory) {
        return false;
      }
      
      // Category filter from sidebar
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Handmade filter
      if (filters.isHandmade && !product.isHandmade) {
        return false;
      }
      
      // Rating filter
      if (product.rating < filters.rating) {
        return false;
      }
      
      return true;
    });
  }, [searchQuery, selectedCategory, filters]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      isHandmade: false,
      rating: 0
    });
    setSelectedCategory("All Products");
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-subtle-gradient pt-[var(--header-height)]">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={heroImage}
          alt="Beautiful handloom products showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold">
              Handloom Heritage
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto px-4">
              Discover authentic Indian handloom products crafted with traditional techniques
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Shop Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Product Area */}
          <div className="flex-1">
            {/* Filter Toggle for Mobile */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Results Count for Desktop */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-semibold">
                Our Collection
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(product.id)}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No products found matching your criteria.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;