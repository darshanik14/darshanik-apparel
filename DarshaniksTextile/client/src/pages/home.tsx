import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Palette, Package, HeadphonesIcon, Archive, FileText, CreditCard } from "lucide-react";
import { Activity, Order, Product } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users/current'],
  });
  
  const { data: activeOrders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });
  
  const { data: featuredFabrics, isLoading: isLoadingFabrics } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const { data: recentActivities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });
  
  const filteredFabrics = featuredFabrics?.filter(
    product => product.categoryId === 3
  ).slice(0, 3);
  
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "order":
        navigate("/new-order");
        break;
      case "samples":
        navigate("/samples");
        break;
      case "track":
        navigate("/orders");
        break;
      case "support":
        toast({
          title: "Support",
          description: "Our support team will contact you soon.",
        });
        break;
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "in_production":
        return "bg-green-500 bg-opacity-10 text-green-500";
      case "awaiting_approval":
        return "bg-amber-500 bg-opacity-10 text-amber-500";
      case "confirmed":
        return "bg-blue-500 bg-opacity-10 text-blue-500";
      case "shipped":
        return "bg-purple-500 bg-opacity-10 text-purple-500";
      case "delivered":
        return "bg-green-700 bg-opacity-10 text-green-700";
      default:
        return "bg-neutral-500 bg-opacity-10 text-neutral-500";
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_production":
        return "In Production";
      case "awaiting_approval":
        return "Awaiting Approval";
      case "confirmed":
        return "Confirmed";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sample_request":
        return <Archive className="text-primary text-base" />;
      case "payment":
        return <CreditCard className="text-green-500 text-base" />;
      case "design_review":
        return <FileText className="text-amber-500 text-base" />;
      case "order_created":
        return <ShoppingBag className="text-blue-500 text-base" />;
      case "order_status_change":
        return <Package className="text-purple-500 text-base" />;
      default:
        return <Archive className="text-primary text-base" />;
    }
  };
  
  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "sample_request":
        return "bg-primary bg-opacity-10";
      case "payment":
        return "bg-green-500 bg-opacity-10";
      case "design_review":
        return "bg-amber-500 bg-opacity-10";
      case "order_created":
        return "bg-blue-500 bg-opacity-10";
      case "order_status_change":
        return "bg-purple-500 bg-opacity-10";
      default:
        return "bg-primary bg-opacity-10";
    }
  };
  
  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-primary text-white px-4 py-6">
        <h1 className="text-xl font-bold">
          {isLoadingUser ? (
            <Skeleton className="h-6 w-48 bg-primary-light" />
          ) : (
            user?.businessName || "Welcome"
          )}
        </h1>
        <p className="text-sm opacity-80">
          {isLoadingOrders ? (
            <Skeleton className="h-4 w-64 mt-1 bg-primary-light" />
          ) : (
            `Welcome back! You have ${activeOrders?.length || 0} orders in progress.`
          )}
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Quick Actions</h2>
          <span className="text-primary text-sm">See All</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center" onClick={() => handleQuickAction("order")}>
            <div className="h-12 w-12 rounded-full bg-primary-light bg-opacity-10 flex items-center justify-center mb-1">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs">Place Order</span>
          </div>
          <div className="flex flex-col items-center" onClick={() => handleQuickAction("samples")}>
            <div className="h-12 w-12 rounded-full bg-primary-light bg-opacity-10 flex items-center justify-center mb-1">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs">Samples</span>
          </div>
          <div className="flex flex-col items-center" onClick={() => handleQuickAction("track")}>
            <div className="h-12 w-12 rounded-full bg-primary-light bg-opacity-10 flex items-center justify-center mb-1">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs">Track</span>
          </div>
          <div className="flex flex-col items-center" onClick={() => handleQuickAction("support")}>
            <div className="h-12 w-12 rounded-full bg-primary-light bg-opacity-10 flex items-center justify-center mb-1">
              <HeadphonesIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs">Support</span>
          </div>
        </div>
      </div>
      
      {/* Active Orders */}
      <div className="bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Active Orders</h2>
          <span className="text-primary text-sm cursor-pointer" onClick={() => navigate("/orders")}>
            View All
          </span>
        </div>
        
        {isLoadingOrders ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : activeOrders && activeOrders.length > 0 ? (
          activeOrders.slice(0, 2).map((order) => (
            <div 
              key={order.id} 
              className="border border-neutral-200 rounded-lg p-3 mb-3"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{order.orderNumber}</h3>
                  <p className="text-xs text-neutral-700">
                    {order.quantity} {order.unit} • Product ID: {order.productId}
                  </p>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                  <div className={`h-2 w-2 rounded-full mr-1 ${order.status === 'in_production' ? 'bg-green-500' : order.status === 'awaiting_approval' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                  <span>{getStatusLabel(order.status)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Delivery: {order.deliveryDate ? formatDate(order.deliveryDate) : 'TBD'}</span>
                <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                  {order.status === 'in_production' || order.status === 'shipped' ? 'Track' : 'Details'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-neutral-500">No active orders</p>
              <Button variant="outline" className="mt-2" onClick={() => navigate("/new-order")}>
                Place New Order
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Featured Fabrics */}
      <div className="bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Featured Fabrics</h2>
          <span className="text-primary text-sm cursor-pointer" onClick={() => navigate("/catalog")}>
            See All
          </span>
        </div>
        
        {isLoadingFabrics ? (
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <Skeleton className="min-w-[140px] h-[140px]" />
            <Skeleton className="min-w-[140px] h-[140px]" />
            <Skeleton className="min-w-[140px] h-[140px]" />
          </div>
        ) : (
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {filteredFabrics?.map((fabric) => (
              <div key={fabric.id} className="min-w-[140px] max-w-[140px]">
                <div className="rounded-lg overflow-hidden h-[100px] mb-2">
                  <img 
                    src={`https://images.unsplash.com/photo-${fabric.id === 4 ? "1620799140408-edc6dcb6d633" : fabric.id === 5 ? "1587142631018-b2d8dcce3bc3" : "1596462502278-27bfdc403348"}?ixlib=rb-1.2.1&auto=format&fit=crop&w=280&q=80`}
                    alt={fabric.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h3 className="font-medium text-sm">{fabric.name}</h3>
                <p className="text-xs text-neutral-700">{fabric.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Recent Activities */}
      <div className="bg-white p-4">
        <h2 className="font-semibold mb-3">Recent Activities</h2>
        
        {isLoadingActivities ? (
          <div className="space-y-4">
            <div className="flex items-start">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-start">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ) : recentActivities && recentActivities.length > 0 ? (
          recentActivities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-start mb-4">
              <div className={`${getActivityBgColor(activity.type)} rounded-full p-2 mr-3`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.title}</p>
                <p className="text-xs text-neutral-500">
                  {formatDate(activity.createdAt)} • {new Date(activity.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 text-center py-4">No recent activities</p>
        )}
      </div>
    </div>
  );
}
