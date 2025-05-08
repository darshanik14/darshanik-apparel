import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FilterIcon } from "lucide-react";
import { Category, Product } from "@shared/schema";

export default function Catalog() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const getCategoryImage = (id: number) => {
    const imageMap: Record<number, string> = {
      1: "photo-1556740738-b6a63e27c4df",
      2: "photo-1581655353564-df123a1eb820",
      3: "photo-1536992266094-82847e1fd431",
      4: "photo-1542042457485-47193333a3e5"
    };
    
    return `https://images.unsplash.com/${imageMap[id] || "photo-1556740738-b6a63e27c4df"}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`;
  };
  
  const getProductImage = (id: number) => {
    const imageMap: Record<number, string> = {
      1: "photo-1618354691373-d851c5c3a990",
      2: "photo-1624378439575-d8705ad7ae80",
      3: "photo-1614676471928-2ebd94e2e2d4"
    };
    
    return `https://images.unsplash.com/${imageMap[id] || "photo-1618354691373-d851c5c3a990"}?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80`;
  };
  
  const popularProducts = products?.slice(0, 3);
  
  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white p-4 sticky top-0 z-10 border-b border-neutral-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search fabrics, products..."
            className="w-full border-neutral-200 pl-10 pr-4 py-2 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button size="sm" className="flex items-center gap-1 rounded-full">
            <FilterIcon className="h-3.5 w-3.5" />
            Filters
          </Button>
          
          <Button
            variant={activeFilters.includes("Cotton") ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-8"
            onClick={() => toggleFilter("Cotton")}
          >
            Cotton
          </Button>
          
          <Button
            variant={activeFilters.includes("Sustainable") ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-8"
            onClick={() => toggleFilter("Sustainable")}
          >
            Sustainable
          </Button>
          
          <Button
            variant={activeFilters.includes("T-Shirts") ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-8"
            onClick={() => toggleFilter("T-Shirts")}
          >
            T-Shirts
          </Button>
          
          <Button
            variant={activeFilters.includes("Prints") ? "default" : "outline"}
            size="sm"
            className="rounded-full text-xs h-8"
            onClick={() => toggleFilter("Prints")}
          >
            Prints
          </Button>
        </div>
      </div>
      
      {/* Categories */}
      <div className="p-4">
        <h2 className="font-semibold mb-3">Categories</h2>
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories?.map((category) => (
              <div 
                key={category.id} 
                className="relative rounded-lg overflow-hidden h-24 cursor-pointer"
                onClick={() => navigate(`/catalog/category/${category.id}`)}
              >
                <img 
                  src={getCategoryImage(category.id)} 
                  alt={category.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white font-medium">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Popular Products */}
      <div className="p-4">
        <h2 className="font-semibold mb-3">Most Popular Products</h2>
        {isLoadingProducts ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {popularProducts?.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg p-3 flex cursor-pointer"
                onClick={() => navigate(`/catalog/product/${product.id}`)}
              >
                <div className="h-20 w-20 rounded-md overflow-hidden mr-3">
                  <img 
                    src={getProductImage(product.id)} 
                    alt={product.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-xs text-neutral-700 mb-1">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      ${product.priceMin.toFixed(2)} - ${product.priceMax.toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      MOQ: {product.moq} {product.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
