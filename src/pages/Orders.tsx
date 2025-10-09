import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Calendar } from "lucide-react";

interface Order {
  id: string;
  date: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  shipping: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "shipped":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-subtle-gradient">
        <header className="bg-card/95 backdrop-blur-sm border-b fixed top-0 left-0 right-0 z-50 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-serif font-bold bg-hero-gradient bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Handloom Heritage
              </button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Shopping
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 mt-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6 pb-6">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button onClick={() => navigate("/")}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subtle-gradient">
      <header className="bg-card/95 backdrop-blur-sm border-b fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-serif font-bold bg-hero-gradient bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Handloom Heritage
            </button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Shopping
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-xl font-bold">₹{order.total.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Shipping Information */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium text-foreground">{order.shipping.fullName}</p>
                    <p>{order.shipping.address}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}
                    </p>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute top-2 left-0 right-0 h-0.5 bg-muted" />
                        <div 
                          className="absolute top-2 left-0 h-0.5 bg-primary transition-all duration-500"
                          style={{ 
                            width: order.status === "Processing" ? "0%" : 
                                   order.status === "Shipped" ? "50%" : "100%" 
                          }}
                        />
                        <div className="relative flex justify-between">
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered"
                                ? "bg-primary border-primary" 
                                : "bg-background border-muted"
                            }`} />
                            <span className="text-xs mt-2 text-muted-foreground">Processing</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              order.status === "Shipped" || order.status === "Delivered"
                                ? "bg-primary border-primary" 
                                : "bg-background border-muted"
                            }`} />
                            <span className="text-xs mt-2 text-muted-foreground">Shipped</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              order.status === "Delivered"
                                ? "bg-primary border-primary" 
                                : "bg-background border-muted"
                            }`} />
                            <span className="text-xs mt-2 text-muted-foreground">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
