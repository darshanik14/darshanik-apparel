import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CloudUpload, FileText, X } from "lucide-react";
import { insertDesignSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

const designUploadSchema = insertDesignSchema.extend({
  name: z.string().min(1, "Design name is required"),
  type: z.string().min(1, "Design type is required"),
  orderId: z.number().optional(),
  notes: z.string().optional(),
});

type DesignFormValues = z.infer<typeof designUploadSchema>;

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  progress: number;
  complete: boolean;
}

export default function DesignUpload() {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<DesignFormValues>({
    resolver: zodResolver(designUploadSchema),
    defaultValues: {
      name: "",
      type: "",
      notes: "",
    },
  });
  
  const createDesignMutation = useMutation({
    mutationFn: async (data: DesignFormValues) => {
      // Simulate file URLs that would come from a file upload server
      const fileUrls = uploadedFiles.map(file => `/uploads/designs/${file.id}_${file.name.replace(/\s+/g, '_')}`);
      
      const designData = {
        ...data,
        fileUrls,
      };
      
      const response = await apiRequest("POST", "/api/designs", designData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/designs'] });
      toast({
        title: "Design Uploaded",
        description: "Your design has been uploaded successfully.",
      });
      setUploadedFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload design. Please try again.",
        variant: "destructive",
      });
      console.error("Error uploading design:", error);
    },
  });
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Create new file objects with simulated upload progress
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      type: file.type,
      progress: 0,
      complete: false,
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    
    // Simulate upload progress for each file
    newFiles.forEach((file, index) => {
      const simulateUpload = () => {
        setUploadedFiles(prev => {
          const updated = [...prev];
          const fileIndex = updated.findIndex(f => f.id === file.id);
          
          if (fileIndex !== -1) {
            if (updated[fileIndex].progress < 100) {
              updated[fileIndex].progress += Math.floor(Math.random() * 20) + 5;
              
              if (updated[fileIndex].progress >= 100) {
                updated[fileIndex].progress = 100;
                updated[fileIndex].complete = true;
              } else {
                setTimeout(simulateUpload, 500);
              }
            }
          }
          
          return updated;
        });
      };
      
      // Start the simulated upload after a small delay for each file
      setTimeout(simulateUpload, 300 * index);
    });
    
    // Reset the file input
    event.target.value = '';
  };
  
  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };
  
  const onSubmit = (data: DesignFormValues) => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files",
        description: "Please upload at least one design file.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all uploads are complete
    const allComplete = uploadedFiles.every(file => file.complete);
    
    if (!allComplete) {
      toast({
        title: "Upload in Progress",
        description: "Please wait for all files to finish uploading.",
        variant: "destructive",
      });
      return;
    }
    
    createDesignMutation.mutate(data);
  };
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Upload Design</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-4">
          <CardContent className="pt-4">
            <h2 className="font-semibold mb-3">Design Information</h2>
            
            <div className="mb-3">
              <Label htmlFor="name">Design Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Summer 2023 Logo"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div className="mb-3">
              <Label htmlFor="type">Design Type</Label>
              <Select onValueChange={(value) => register("type").onChange({ target: { value } })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select design type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Logo">Logo</SelectItem>
                  <SelectItem value="Full Print">Full Print</SelectItem>
                  <SelectItem value="Pattern">Pattern</SelectItem>
                  <SelectItem value="Embroidery">Embroidery</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
              )}
            </div>
            
            <div className="mb-3">
              <Label htmlFor="orderId">Associated Order (Optional)</Label>
              <Select onValueChange={(value) => register("orderId").onChange({ target: { value: value === 'none' ? undefined : value } })}>
                <SelectTrigger id="orderId">
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No associated order</SelectItem>
                  <SelectItem value="1">Order #DAS-2023-5649</SelectItem>
                  <SelectItem value="2">Order #DAS-2023-5632</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="pt-4">
            <h2 className="font-semibold mb-3">Upload Files</h2>
            
            <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4 text-center mb-3">
              <CloudUpload className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm mb-1">Drag and drop files here or</p>
              <Button 
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Browse Files
              </Button>
              <Input 
                id="file-upload" 
                type="file" 
                multiple 
                className="hidden"
                onChange={handleFileUpload}
                accept=".ai,.psd,.pdf,.eps,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Accepted formats: AI, PSD, PDF, EPS, JPG, PNG (Max 20MB)
              </p>
            </div>
            
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center bg-neutral-100 p-2 rounded-lg mb-2">
                <FileText className="text-neutral-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  {file.complete ? (
                    <p className="text-xs text-primary">Complete</p>
                  ) : (
                    <div className="flex items-center">
                      <Progress value={file.progress} className="flex-1 h-1" />
                      <span className="text-xs ml-2">{file.progress}%</span>
                    </div>
                  )}
                </div>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4 text-neutral-500" />
                </Button>
              </div>
            ))}
            
            {errors.fileUrls && (
              <div className="flex items-center text-red-500 text-xs mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                <p>Please upload at least one file</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="pt-4">
            <h2 className="font-semibold mb-3">Design Notes</h2>
            <Textarea 
              id="notes" 
              placeholder="Describe any special requirements or placement instructions for your design"
              rows={4}
              {...register("notes")}
            />
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full mb-3"
          disabled={createDesignMutation.isPending}
        >
          {createDesignMutation.isPending ? "Submitting..." : "Submit Design"}
        </Button>
      </form>
    </div>
  );
}
