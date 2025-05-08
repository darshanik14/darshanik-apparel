import { useState } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Bell, User, LogOut, Package, Settings, FileText, Palette } from "lucide-react";
import logoSvg from "../../assets/logo.svg";

export default function AppHeader() {
  const [location, navigate] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="bg-white border-b border-neutral-200 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-3">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Darshanik Apparels</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/")}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/catalog")}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Product Catalog
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/orders")}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    My Orders
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/samples")}
                  >
                    <Palette className="mr-2 h-5 w-5" />
                    Sample Requests
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/design-upload")}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Design Upload
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/account")}
                  >
                    <User className="mr-2 h-5 w-5" />
                    My Account
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-4 w-[calc(100%-2rem)]">
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div>
            <img 
              src={logoSvg} 
              alt="Darshanik Apparels Logo" 
              className="h-12 w-auto" 
            />
          </div>
        </div>
        <div className="flex items-center">
          <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative mr-3">
                <Bell className="h-6 w-6 text-neutral-700" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="bg-primary bg-opacity-10 rounded-full p-2 mr-3">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">Your order #DAS-2023-5649 is now in production</p>
                      <p className="text-xs text-neutral-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-green-500 bg-opacity-10 rounded-full p-2 mr-3">
                      <Palette className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm">Sample request approved</p>
                      <p className="text-xs text-neutral-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80" 
              alt="User" 
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
