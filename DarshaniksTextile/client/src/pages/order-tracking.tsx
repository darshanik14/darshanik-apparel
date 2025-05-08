import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { HeadphonesIcon, FileText, CheckCircle, Settings, Package, Truck, AlertCircle } from "lucide-react";
import { Order } from "@shared/schema";

export default function OrderTracking() {
  const params = useParams();
  const orderId = params.id;
  const [, navigate] = useLocation();
  
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: [`/api/orders/${orderId}`],
  });
  
  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-neutral-500 mb-4">The order you are looking for could not be found.</p>
        <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
      </div>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "payment_received":
      case "production_started":
        return <CheckCircle className="text-white text-sm" />;
      case "in_production":
        return <Settings className="text-white text-sm" />;
      case "shipping":
        return <Truck className="text-white text-sm" />;
      case "delivered":
        return <Package className="text-white text-sm" />;
      default:
        return <CheckCircle className="text-white text-sm" />;
    }
  };
  
  const getStatusClass = (status: string, currentStatus: string) => {
    // Check if this status is in the timeline
    const hasReachedStatus = order.statusTimeline && Object.keys(order.statusTimeline).includes(status);
    
    // Current active status
    if (status === currentStatus) {
      return "bg-primary";
    }
    
    // Completed status
    if (hasReachedStatus) {
      return "bg-green-500";
    }
    
    // Future status
    return "bg-neutral-300";
  };
  
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <div>
      <div className="bg-primary p-4 text-white">
        <h1 className="text-xl font-bold mb-1">{order.orderNumber}</h1>
        <p className="text-sm opacity-80">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Order Status</h2>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              order.status === 'in_production' ? 'bg-green-500 bg-opacity-10 text-green-500' :
              order.status === 'awaiting_approval' ? 'bg-amber-500 bg-opacity-10 text-amber-500' :
              order.status === 'confirmed' ? 'bg-blue-500 bg-opacity-10 text-blue-500' :
              order.status === 'shipped' ? 'bg-purple-500 bg-opacity-10 text-purple-500' :
              order.status === 'delivered' ? 'bg-green-700 bg-opacity-10 text-green-700' :
              'bg-neutral-500 bg-opacity-10 text-neutral-500'
            }`}>
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
          
          {/* Timeline */}
          <div className="relative pl-8 pb-2">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-200"></div>
            
            {order.statusTimeline && Object.entries(order.statusTimeline).map(([status, timestamp], index) => (
              <div key={status} className="mb-4 relative">
                <div className={`absolute left-[-29px] top-0 h-6 w-6 rounded-full ${getStatusClass(status, order.status)} flex items-center justify-center`}>
                  {getStatusIcon(status)}
                </div>
                <h3 className="font-medium text-sm">{getStatusLabel(status)}</h3>
                <p className="text-xs text-neutral-500">{formatDateTime(timestamp)}</p>
                {status === 'production_started' && (
                  <p className="mt-1 text-xs bg-neutral-100 p-2 rounded-lg">
                    Fabric cutting in progress. On schedule for delivery date.
                  </p>
                )}
                {status === 'in_production' && (
                  <div className="mt-1 bg-neutral-100 p-2 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Production Progress</span>
                      <span className="text-xs font-medium">{order.progressPercentage}%</span>
                    </div>
                    <Progress value={order.progressPercentage} className="h-2" />
                  </div>
                )}
              </div>
            ))}
            
            {!order.statusTimeline?.shipping && (
              <div className="mb-4 relative opacity-50">
                <div className="absolute left-[-29px] top-0 h-6 w-6 rounded-full bg-neutral-300 flex items-center justify-center">
                  <Truck className="text-white text-sm" />
                </div>
                <h3 className="font-medium text-sm">Shipping</h3>
                <p className="text-xs text-neutral-500">
                  Estimated: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                </p>
              </div>
            )}
            
            {!order.statusTimeline?.delivered && (
              <div className="relative opacity-50">
                <div className="absolute left-[-29px] top-0 h-6 w-6 rounded-full bg-neutral-300 flex items-center justify-center">
                  <Package className="text-white text-sm" />
                </div>
                <h3 className="font-medium text-sm">Delivered</h3>
                <p className="text-xs text-neutral-500">
                  Estimated: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-3">Order Details</h2>
          
          <div className="flex mb-4">
            <div className="h-20 w-20 rounded-md overflow-hidden mr-3">
              <img 
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" 
                alt="T-shirt Order" 
                className="h-full w-full object-cover" 
              />
            </div>
            <div>
              <h3 className="font-medium">Product ID: {order.productId}</h3>
              <p className="text-xs text-neutral-700 mb-1">
                {order.quantity} {order.unit}
              </p>
              {order.sizeBreakdown && (
                <p className="text-xs">
                  Sizes: {Object.entries(order.sizeBreakdown as Record<string, number>)
                    .map(([size, qty]) => `${size}: ${qty}`)
                    .join(', ')}
                </p>
              )}
              {order.colors && (
                <p className="text-xs">
                  Colors: {Object.entries(order.colors as Record<string, number>)
                    .map(([color, qty]) => `${color} (${qty})`)
                    .join(', ')}
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t border-neutral-200 pt-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.customizationFee && order.customizationFee > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-sm">Custom Printing</span>
                <span className="text-sm">{formatCurrency(order.customizationFee)}</span>
              </div>
            )}
            {order.shippingFee && order.shippingFee > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">{formatCurrency(order.shippingFee)}</span>
              </div>
            )}
            {order.tax && order.tax > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-sm">Tax</span>
                <span className="text-sm">{formatCurrency(order.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-neutral-200">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-3">Shipping Information</h2>
          <p className="text-sm mb-1">{order.contactName}</p>
          <p className="text-sm mb-1">{order.shippingAddress}</p>
          <p className="text-sm">Contact: {order.contactPhone}</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1 flex items-center justify-center">
            <HeadphonesIcon className="mr-1 h-4 w-4" />
            Contact Support
          </Button>
          <Button className="flex-1 flex items-center justify-center">
            <FileText className="mr-1 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
