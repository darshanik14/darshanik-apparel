import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppShell from "@/components/layout/AppShell";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import OrderTracking from "@/pages/order-tracking";
import NewOrder from "@/pages/new-order";
import Samples from "@/pages/samples";
import DesignUpload from "@/pages/design-upload";
import Account from "@/pages/account";
import { useEffect, useState } from "react";
import { apiRequest } from "./lib/queryClient";
import Orders from "@/pages/orders";

function Router() {
  const [location] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for this demo
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRequest('GET', '/api/auth/check');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Check if this is the bottom navigation path
  const isNavBarPath = [
    "/", 
    "/catalog",
    "/orders",
    "/samples",
    "/account"
  ].includes(location);
  
  return (
    <AppShell showNavBar={isNavBarPath}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/orders" component={Orders} />
        <Route path="/orders/:id" component={OrderTracking} />
        <Route path="/new-order" component={NewOrder} />
        <Route path="/samples" component={Samples} />
        <Route path="/design-upload" component={DesignUpload} />
        <Route path="/account" component={Account} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
