import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Plus, ArrowRight } from "lucide-react";
import { Order } from "@shared/schema";

export default function Orders() {
  const [, navigate] = useLocation();
  
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });
  
  const activeOrders = orders?.filter(order => 
    ['pending', 'confirmed', 'in_production', 'awaiting_approval'].includes(order.status)
  );
  
  const completedOrders = orders?.filter(order => 
    ['shipped', 'delivered'].includes(order.status)
  );
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "in_production":
        return "bg-green-500 bg-opacity-10 text-green-500";
      case "awaiting_approval":
        return "bg-amber-500 bg-opacity-10 text-amber-500";
      case "confirmed":
        return "bg-blue-500 bg-opacity-10 text-blue-500";
      case "pending":
        return "bg-neutral-500 bg-opacity-10 text-neutral-500";
      case "shipped":
        return "bg-purple-500 bg-opacity-10 text-purple-500";
      case "delivered":
        return "bg-green-700 bg-opacity-10 text-green-700";
      default:
        return "bg-neutral-500 bg-opacity-10 text-neutral-500";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_production":
        return "In Production";
      case "awaiting_approval":
        return "Awaiting Approval";
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
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
  
  const OrderItem = ({ order }: { order: Order }) => (
    <div 
      key={order.id} 
      className="bg-white rounded-lg p-4 mb-3 border border-neutral-200"
      onClick={() => navigate(`/orders/${order.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{order.orderNumber}</h3>
          <p className="text-xs text-neutral-700 mb-1">
            {order.quantity} {order.unit} • Product ID: {order.productId}
          </p>
          <p className="text-xs text-neutral-500">
            Ordered: {formatDate(order.createdAt)}
          </p>
        </div>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
          <div className={`h-2 w-2 rounded-full mr-1 ${
            order.status === 'in_production' ? 'bg-green-500' : 
            order.status === 'awaiting_approval' ? 'bg-amber-500' : 
            order.status === 'confirmed' ? 'bg-blue-500' :
            order.status === 'shipped' ? 'bg-purple-500' :
            order.status === 'delivered' ? 'bg-green-700' :
            'bg-neutral-500'
          }`}></div>
          <span>{getStatusLabel(order.status)}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="text-sm font-medium">
          ${order.totalAmount.toFixed(2)}
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          Details <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button size="sm" onClick={() => navigate("/new-order")}>
          <Plus className="h-4 w-4 mr-1" /> New Order
        </Button>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : activeOrders && activeOrders.length > 0 ? (
            activeOrders.map(order => <OrderItem key={order.id} order={order} />)
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Package className="h-12 w-12 text-neutral-300 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Active Orders</h3>
                <p className="text-neutral-500 mb-4">Place your first order to get started</p>
                <Button onClick={() => navigate("/new-order")}>
                  Place New Order
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : completedOrders && completedOrders.length > 0 ? (
            completedOrders.map(order => <OrderItem key={order.id} order={order} />)
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Package className="h-12 w-12 text-neutral-300 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Completed Orders</h3>
                <p className="text-neutral-500">Your completed orders will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
