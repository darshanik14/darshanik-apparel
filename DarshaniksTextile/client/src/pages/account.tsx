import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { FileText, PenSquare, User, Building, Phone, Mail, MapPin, Shield, Bell, CreditCard, Eye, EyeOff } from "lucide-react";
import { User as UserType } from "@shared/schema";

export default function Account() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ['/api/users/current'],
  });
  
  const handleSaveGeneralInfo = () => {
    toast({
      title: "Account Updated",
      description: "Your account information has been updated successfully.",
    });
  };
  
  const handleSavePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Account</h1>
      </div>
      
      <Card className="mb-4">
        <CardHeader className="pb-0">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80" alt="User" />
              <AvatarFallback>
                {user?.businessName ? getInitials(user.businessName) : 'DA'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user?.businessName || "Your Business"}</CardTitle>
              <p className="text-sm text-neutral-500">
                {user?.kycVerified ? (
                  <span className="flex items-center text-green-600">
                    <Shield className="h-3 w-3 mr-1" /> Verified Account
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600">
                    <Shield className="h-3 w-3 mr-1" /> Verification Pending
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="info">Account Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardContent className="pt-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveGeneralInfo(); }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <div className="flex">
                      <Building className="text-neutral-500 mr-2 h-5 w-5 mt-2" />
                      <Input
                        id="businessName"
                        defaultValue={user?.businessName}
                        placeholder="Your business name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex">
                      <User className="text-neutral-500 mr-2 h-5 w-5 mt-2" />
                      <Input
                        id="username"
                        defaultValue={user?.username}
                        placeholder="Username"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex">
                      <Mail className="text-neutral-500 mr-2 h-5 w-5 mt-2" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <Phone className="text-neutral-500 mr-2 h-5 w-5 mt-2" />
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue={user?.phone}
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <div className="flex">
                      <MapPin className="text-neutral-500 mr-2 h-5 w-5 mt-2" />
                      <Input
                        id="address"
                        defaultValue={user?.address}
                        placeholder="Your business address"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardContent className="pt-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </div>
              </form>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Enhance your account security</p>
                    <p className="text-xs text-neutral-500">
                      Use an authenticator app to get 2FA codes when signing in
                    </p>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-neutral-500" />
                    <Label htmlFor="order-updates" className="text-sm">
                      Order Updates
                    </Label>
                  </div>
                  <Switch id="order-updates" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-neutral-500" />
                    <Label htmlFor="new-products" className="text-sm">
                      New Product Announcements
                    </Label>
                  </div>
                  <Switch id="new-products" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PenSquare className="h-4 w-4 text-neutral-500" />
                    <Label htmlFor="design-feedback" className="text-sm">
                      Design Feedback
                    </Label>
                  </div>
                  <Switch id="design-feedback" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-neutral-500" />
                    <Label htmlFor="payment-reminders" className="text-sm">
                      Payment Reminders
                    </Label>
                  </div>
                  <Switch id="payment-reminders" defaultChecked />
                </div>
                
                <Separator className="my-2" />
                
                <h3 className="font-medium">Email Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-neutral-500" />
                    <Label htmlFor="marketing-emails" className="text-sm">
                      Marketing Emails
                    </Label>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
                
                <Button type="button" className="w-full mt-2" onClick={() => toast({ title: "Preferences Saved", description: "Your notification preferences have been updated." })}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
