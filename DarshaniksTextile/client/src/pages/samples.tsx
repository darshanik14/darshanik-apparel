import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { insertSampleSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Product, Sample } from "@shared/schema";
import { getProductImage } from "@/lib/images";

const sampleRequestSchema = insertSampleSchema.extend({
  productIds: z.array(z.number()).min(1, "Select at least one sample"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(1, "Phone number is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
});

type SampleFormValues = z.infer<typeof sampleRequestSchema>;

export default function Samples() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const { data: userSamples, isLoading: isLoadingSamples } = useQuery<Sample[]>({
    queryKey: ['/api/samples'],
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm<SampleFormValues>({
    resolver: zodResolver(sampleRequestSchema),
    defaultValues: {
      productIds: [],
      contactName: "",
      contactPhone: "",
      shippingAddress: "",
      specialInstructions: "",
    },
  });
  
  const createSampleMutation = useMutation({
    mutationFn: async (data: SampleFormValues) => {
      // For each selected product, create a sample request
      const requests = data.productIds.map(productId => {
        return apiRequest("POST", "/api/samples", {
          productId,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          shippingAddress: data.shippingAddress,
          specialInstructions: data.specialInstructions,
          sampleFee: 25,
          shippingFee: 15,
          tax: 4,
          totalFee: 44
        });
      });
      
      return Promise.all(requests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/samples'] });
      toast({
        title: "Sample Request Submitted",
        description: "Your request for samples has been submitted successfully.",
      });
      setSelectedProducts([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit sample request. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting sample request:", error);
    },
  });
  
  const handleAddSample = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };
  
  const handleRemoveSample = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };
  
  const onSubmit = (data: SampleFormValues) => {
    data.productIds = selectedProducts.map(p => p.id);
    createSampleMutation.mutate(data);
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500 bg-opacity-10 text-green-500";
      case "pending":
        return "bg-amber-500 bg-opacity-10 text-amber-500";
      case "shipped":
        return "bg-blue-500 bg-opacity-10 text-blue-500";
      case "delivered":
        return "bg-green-700 bg-opacity-10 text-green-700";
      case "rejected":
        return "bg-red-500 bg-opacity-10 text-red-500";
      default:
        return "bg-neutral-500 bg-opacity-10 text-neutral-500";
    }
  };
  
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sample Requests</h1>
      
      <Tabs defaultValue="new">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="new">New Request</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-4">
              <CardContent className="pt-4">
                <h2 className="font-semibold mb-3">Selected Sample Items</h2>
                
                {selectedProducts.length > 0 ? (
                  selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center border-b border-neutral-200 py-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
                        <img 
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-xs text-neutral-700">{product.description}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleRemoveSample(product.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-center py-4">No samples selected yet</p>
                )}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-3 border-dashed border-primary text-primary"
                  onClick={() => {
                    // Toggle a modal or navigate to product selection
                    navigate("/catalog");
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add More Samples
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardContent className="pt-4">
                <h2 className="font-semibold mb-3">Shipping Information</h2>
                
                <div className="mb-3">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input 
                    id="contactName" 
                    placeholder="Full Name"
                    {...register("contactName")}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>
                  )}
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input 
                    id="contactPhone" 
                    placeholder="+1 (XXX) XXX-XXXX"
                    {...register("contactPhone")}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>
                  )}
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="shippingAddress">Address</Label>
                  <Textarea 
                    id="shippingAddress" 
                    placeholder="Full shipping address"
                    rows={3}
                    {...register("shippingAddress")}
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea 
                    id="specialInstructions" 
                    placeholder="Any special requirements"
                    rows={2}
                    {...register("specialInstructions")}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardContent className="pt-4">
                <h2 className="font-semibold mb-3">Sample Fee</h2>
                <div className="flex justify-between mb-2">
                  <span>Sample Cost</span>
                  <span>${selectedProducts.length * 25}.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>$4.00</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>${(selectedProducts.length * 25) + 15 + 4}.00</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Sample fees are refundable on your first bulk order over $1,000.
                </p>
              </CardContent>
            </Card>
            
            <Button 
              type="submit" 
              className="w-full mb-3"
              disabled={createSampleMutation.isPending || selectedProducts.length === 0}
            >
              {createSampleMutation.isPending ? "Submitting..." : "Submit Sample Request"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="history">
          {isLoadingSamples ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : userSamples && userSamples.length > 0 ? (
            <div className="space-y-3">
              {userSamples.map((sample) => (
                <Card key={sample.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Sample Request #{sample.id}</h3>
                        <p className="text-xs text-neutral-700">Product ID: {sample.productId}</p>
                        <p className="text-xs text-neutral-500">Requested on {formatDate(sample.createdAt)}</p>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(sample.status)}`}>
                        <div className={`h-2 w-2 rounded-full mr-1 ${
                          sample.status === 'approved' ? 'bg-green-500' :
                          sample.status === 'pending' ? 'bg-amber-500' :
                          sample.status === 'shipped' ? 'bg-blue-500' :
                          sample.status === 'delivered' ? 'bg-green-700' :
                          sample.status === 'rejected' ? 'bg-red-500' :
                          'bg-neutral-500'
                        }`}></div>
                        <span>{getStatusLabel(sample.status)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">${sample.totalFee?.toFixed(2)}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Navigate to sample details or open modal
                          toast({
                            title: "Sample Details",
                            description: `Viewing details for sample request #${sample.id}`,
                          });
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-neutral-100 p-3 mb-2">
                  <Plus className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Sample Requests</h3>
                <p className="text-neutral-500 mb-4">You haven't requested any samples yet</p>
                <Button onClick={() => document.querySelector('button[value="new"]')?.click()}>
                  Request Samples
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
