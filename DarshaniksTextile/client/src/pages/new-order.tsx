import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { insertOrderSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Product, Category } from "@shared/schema";

const orderSchema = insertOrderSchema.extend({
  productId: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
  sizeS: z.coerce.number().min(0),
  sizeM: z.coerce.number().min(0),
  sizeL: z.coerce.number().min(0),
  sizeXL: z.coerce.number().min(0),
  sizeXXL: z.coerce.number().min(0),
  colorBlack: z.coerce.number().min(0),
  colorWhite: z.coerce.number().min(0),
  colorBlue: z.coerce.number().min(0),
  colorRed: z.coerce.number().min(0),
  deliveryDate: z.string().min(1),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const steps = ["Details", "Customization", "Review", "Payment"];

export default function NewOrder() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(1); // Default to T-Shirts
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: selectedCategory !== null,
  });
  
  const filteredProducts = products?.filter(
    product => product.categoryId === selectedCategory
  );
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      productId: 0,
      quantity: 500,
      sizeS: 100,
      sizeM: 150,
      sizeL: 150,
      sizeXL: 75,
      sizeXXL: 25,
      colorBlack: 250,
      colorWhite: 250,
      colorBlue: 0,
      colorRed: 0,
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingAddress: "",
      contactName: "",
      contactPhone: "",
      totalAmount: 2860,
      subtotal: 2000,
      customizationFee: 500,
      shippingFee: 100,
      tax: 260,
    }
  });
  
  const values = watch();
  
  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      // Transform form data to match the schema
      const orderData = {
        ...data,
        sizeBreakdown: {
          S: data.sizeS,
          M: data.sizeM,
          L: data.sizeL,
          XL: data.sizeXL,
          XXL: data.sizeXXL,
        },
        colors: {
          Black: data.colorBlack,
          White: data.colorWhite,
          Blue: data.colorBlue,
          Red: data.colorRed,
        },
        customization: {
          printType: "Custom Logo",
          printLocation: "Front",
        },
        unit: "pieces",
        status: "pending",
      };
      
      // Remove unnecessary fields
      const dataToSend = Object.fromEntries(
        Object.entries(orderData).filter(([key]) => 
          !['sizeS', 'sizeM', 'sizeL', 'sizeXL', 'sizeXXL', 'colorBlack', 'colorWhite', 'colorBlue', 'colorRed'].includes(key)
        )
      );
      
      const response = await apiRequest("POST", "/api/orders", dataToSend);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      navigate("/orders");
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
      console.error("Error placing order:", error);
    },
  });
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };
  
  const onSubmit = (data: OrderFormValues) => {
    createOrderMutation.mutate(data);
  };
  
  const handleSelectProduct = (id: number) => {
    setSelectedProductId(id);
    setValue("productId", id);
  };
  
  const calculateTotal = () => {
    const quantity = values.quantity;
    const subtotal = quantity * 4; // $4 per piece
    const customizationFee = 500;
    const shippingFee = 100;
    const tax = Math.round((subtotal + customizationFee + shippingFee) * 0.1);
    const total = subtotal + customizationFee + shippingFee + tax;
    
    setValue("subtotal", subtotal);
    setValue("customizationFee", customizationFee);
    setValue("shippingFee", shippingFee);
    setValue("tax", tax);
    setValue("totalAmount", total);
  };
  
  const totalItems = 
    (values.sizeS || 0) + 
    (values.sizeM || 0) + 
    (values.sizeL || 0) + 
    (values.sizeXL || 0) + 
    (values.sizeXXL || 0);
  
  const getProductImage = (id: number) => {
    return `https://images.unsplash.com/photo-${id === 1 ? "1521572163474-6864f9cf17ab" : "1581655353564-df123a1eb820"}?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80`;
  };
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">New Order</h1>
      
      {/* Order Progress */}
      <div className="mb-6">
        <div className="flex mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              <div 
                className={`rounded-full h-8 w-8 flex items-center justify-center mx-auto mb-1 ${
                  index === currentStep 
                    ? "bg-primary text-white" 
                    : index < currentStep 
                      ? "bg-green-500 text-white" 
                      : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
              <span className={`text-xs ${index === currentStep ? "font-medium" : ""}`}>{step}</span>
            </div>
          ))}
        </div>
        <div className="flex h-1 mb-5">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`flex-1 ${index <= currentStep ? "bg-primary" : "bg-neutral-200"}`}
            ></div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Product Selection */}
        {currentStep === 0 && (
          <>
            <Card className="mb-4">
              <CardContent className="pt-4">
                <h2 className="font-semibold mb-3">Select Product</h2>
                <div className="mb-4">
                  <Label htmlFor="category">Product Category</Label>
                  <Select
                    defaultValue={selectedCategory?.toString()}
                    onValueChange={(value) => setSelectedCategory(parseInt(value))}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCategories ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : (
                        categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {isLoadingProducts ? (
                    <>
                      <Skeleton className="h-40 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </>
                  ) : filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 2).map((product) => (
                      <div 
                        key={product.id}
                        className={`border rounded-lg p-2 relative ${
                          selectedProductId === product.id ? "border-primary" : "border-neutral-200"
                        }`}
                        onClick={() => handleSelectProduct(product.id)}
                      >
                        <div className="absolute top-2 right-2">
                          <RadioGroup defaultValue={selectedProductId?.toString()}>
                            <RadioGroupItem 
                              value={product.id.toString()} 
                              id={`product-${product.id}`}
                              checked={selectedProductId === product.id}
                              className="h-4 w-4"
                            />
                          </RadioGroup>
                        </div>
                        <div className="h-24 mb-2 rounded-md overflow-hidden">
                          <img 
                            src={getProductImage(product.id)}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-xs text-neutral-500">From ${product.priceMin.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center py-4 text-neutral-500">No products found in this category</p>
                  )}
                </div>
                
                <Button variant="link" className="text-primary text-sm font-medium p-0 h-auto">
                  See more options
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardContent className="pt-4">
                <h2 className="font-semibold mb-3">Order Details</h2>
                
                <div className="mb-4">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-r-none w-10"
                      onClick={() => {
                        const current = parseInt(values.quantity.toString()) || 0;
                        if (current > 100) {
                          setValue("quantity", current - 100);
                          calculateTotal();
                        }
                      }}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="text"
                      className="rounded-none text-center border-x-0"
                      {...register("quantity")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none w-10"
                      onClick={() => {
                        const current = parseInt(values.quantity.toString()) || 0;
                        setValue("quantity", current + 100);
                        calculateTotal();
                      }}
                    >
                      +
                    </Button>
                    <Select defaultValue="pieces">
                      <SelectTrigger className="ml-2 flex-1">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="dozens">Dozens</SelectItem>
                        <SelectItem value="meters">Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label className="block text-sm mb-1">Size Breakdown</Label>
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    <div className="text-center">
                      <div className="border border-neutral-200 rounded py-1 font-medium text-sm">S</div>
                      <Input
                        type="text"
                        className="mt-1 py-1 text-center text-sm"
                        {...register("sizeS")}
                      />
                    </div>
                    <div className="text-center">
                      <div className="border border-neutral-200 rounded py-1 font-medium text-sm">M</div>
                      <Input
                        type="text"
                        className="mt-1 py-1 text-center text-sm"
                        {...register("sizeM")}
                      />
                    </div>
                    <div className="text-center">
                      <div className="border border-neutral-200 rounded py-1 font-medium text-sm">L</div>
                      <Input
                        type="text"
                        className="mt-1 py-1 text-center text-sm"
                        {...register("sizeL")}
                      />
                    </div>
                    <div className="text-center">
                      <div className="border border-neutral-200 rounded py-1 font-medium text-sm">XL</div>
                      <Input
                        type="text"
                        className="mt-1 py-1 text-center text-sm"
                        {...register("sizeXL")}
                      />
                    </div>
                    <div className="text-center">
                      <div className="border border-neutral-200 rounded py-1 font-medium text-sm">XXL</div>
                      <Input
                        type="text"
                        className="mt-1 py-1 text-center text-sm"
                        {...register("sizeXXL")}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500">Total: {totalItems} pieces</div>
                </div>
                
                <div className="mb-4">
                  <Label className="block text-sm mb-1">Colors</Label>
                  <div className="flex flex-wrap gap-2">
                    <div 
                      className={`h-8 w-8 rounded-full bg-black ${values.colorBlack > 0 ? 'border-2 border-primary' : 'border border-neutral-200'}`}
                      onClick={() => setValue("colorBlack", values.colorBlack > 0 ? 0 : 250)}
                    ></div>
                    <div 
                      className={`h-8 w-8 rounded-full bg-white ${values.colorWhite > 0 ? 'border-2 border-primary' : 'border border-neutral-200'}`}
                      onClick={() => setValue("colorWhite", values.colorWhite > 0 ? 0 : 250)}
                    ></div>
                    <div 
                      className={`h-8 w-8 rounded-full bg-blue-500 ${values.colorBlue > 0 ? 'border-2 border-primary' : 'border border-neutral-200'}`}
                      onClick={() => setValue("colorBlue", values.colorBlue > 0 ? 0 : 250)}
                    ></div>
                    <div 
                      className={`h-8 w-8 rounded-full bg-red-500 ${values.colorRed > 0 ? 'border-2 border-primary' : 'border border-neutral-200'}`}
                      onClick={() => setValue("colorRed", values.colorRed > 0 ? 0 : 250)}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    {...register("deliveryDate")}
                  />
                  {errors.deliveryDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.deliveryDate.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Next button */}
        <Button 
          type={currentStep === steps.length - 1 ? "submit" : "button"}
          className="w-full"
          onClick={currentStep < steps.length - 1 ? handleNext : undefined}
          disabled={createOrderMutation.isPending}
        >
          {currentStep === steps.length - 1 
            ? createOrderMutation.isPending ? "Placing Order..." : "Place Order" 
            : `Next: ${steps[currentStep + 1]}`}
        </Button>
      </form>
    </div>
  );
}
