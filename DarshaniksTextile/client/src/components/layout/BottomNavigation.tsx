import { useLocation } from "wouter";
import { Home, ShoppingBag, Palette, User, Search } from "lucide-react";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/catalog", icon: Search, label: "Catalog" },
    { path: "/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/samples", icon: Palette, label: "Samples" },
    { path: "/account", icon: User, label: "Account" },
  ];
  
  return (
    <nav className="bg-white border-t border-neutral-200 py-2 fixed bottom-0 w-full z-10">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              className="flex flex-col items-center"
              onClick={() => navigate(item.path)}
            >
              <item.icon
                className={`h-6 w-6 ${isActive ? "text-primary" : "text-neutral-700"}`}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-primary font-medium" : "text-neutral-700"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
