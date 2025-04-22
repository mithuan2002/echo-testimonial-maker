
import React, { useState, useRef } from "react";
import { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Instagram, Image, LayoutGrid, Copy, CheckCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InstagramPostGeneratorProps {
  testimonial: Testimonial;
}

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    bgColor: "bg-white",
    textColor: "text-gray-900",
    accentColor: "bg-brand-600",
  },
  {
    id: "gradient",
    name: "Gradient",
    bgColor: "bg-gradient-to-br from-brand-100 to-brand-300",
    textColor: "text-gray-900",
    accentColor: "bg-brand-700",
  },
  {
    id: "dark",
    name: "Dark",
    bgColor: "bg-gray-900",
    textColor: "text-white",
    accentColor: "bg-brand-500",
  },
];

// Hashtag suggestions based on testimonial content
const generateHashtags = (testimonial: Testimonial): string => {
  const hashtags = [
    "#testimonial",
    "#customerfeedback",
    "#customerexperience",
    "#review",
  ];
  
  // Add industry-specific hashtags
  if (testimonial.company) {
    hashtags.push("#business", "#partnership");
  }
  
  // Add rating hashtags if available
  if (testimonial.rating && testimonial.rating >= 4) {
    hashtags.push("#fivestars", "#recommended");
  }
  
  return hashtags.slice(0, 8).join(" ");
};

// Generate caption from testimonial
const generateCaption = (testimonial: Testimonial): string => {
  const quote = testimonial.text.length > 100 
    ? testimonial.text.substring(0, 100) + "..." 
    : testimonial.text;
    
  return `"${quote}" - ${testimonial.name}${testimonial.position ? `, ${testimonial.position}` : ''}${testimonial.company ? ` at ${testimonial.company}` : ''}\n\n🌟 Real feedback from our valued clients! We're committed to delivering excellence every step of the way.\n\n${generateHashtags(testimonial)}`;
};

const InstagramPostGenerator: React.FC<InstagramPostGeneratorProps> = ({ testimonial }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [caption, setCaption] = useState(generateCaption(testimonial));
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const postRef = useRef<HTMLDivElement>(null);
  
  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    setSelectedTemplate(template);
  };
  
  // Handle copy to clipboard
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    toast({
      title: "Caption copied!",
      description: "Instagram caption copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Generate a downloadable image of the post preview
  const handleDownloadImage = async () => {
    if (!postRef.current) return;
    
    setIsDownloading(true);
    try {
      // Import html2canvas dynamically to reduce initial bundle size
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      // Create canvas from the post element
      const canvas = await html2canvas(postRef.current, {
        scale: 2, // Higher resolution
        logging: false,
        backgroundColor: null,
        useCORS: true
      });
      
      // Convert canvas to data URL
      const image = canvas.toDataURL("image/png");
      
      // Create a link element to download the image
      const link = document.createElement('a');
      link.href = image;
      link.download = `testimonial-${testimonial.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Post downloaded!",
        description: "Instagram post image has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Instagram size={16} />
          Create Instagram Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Instagram Post Generator
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="preview" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Image size={16} />
              Preview
            </TabsTrigger>
            <TabsTrigger value="caption" className="flex items-center gap-2">
              <LayoutGrid size={16} />
              Caption
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="template">Select Template</Label>
                <Select 
                  value={selectedTemplate.id} 
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Card className="overflow-hidden border-2 border-gray-200">
                <div 
                  ref={postRef}
                  className={`aspect-square ${selectedTemplate.bgColor} relative p-6 flex items-center justify-center`}
                >
                  <div className="max-w-xs mx-auto text-center">
                    <div className={`text-lg md:text-xl font-medium ${selectedTemplate.textColor} mb-4`}>
                      "{testimonial.text.length > 120 
                        ? testimonial.text.substring(0, 120) + "..." 
                        : testimonial.text}"
                    </div>
                    <div className="flex items-center justify-center">
                      <div className={`h-0.5 w-12 ${selectedTemplate.accentColor} my-3`}></div>
                    </div>
                    <div className={`text-sm md:text-base font-medium ${selectedTemplate.textColor}`}>
                      {testimonial.name}
                    </div>
                    {(testimonial.position || testimonial.company) && (
                      <div className={`text-xs md:text-sm ${selectedTemplate.textColor} opacity-80`}>
                        {testimonial.position}
                        {testimonial.position && testimonial.company && " at "}
                        {testimonial.company}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              
              <Button 
                onClick={handleDownloadImage} 
                className="w-full mt-2"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Download Instagram Post
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="caption" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="instagram-caption" className="text-base font-medium">
                  Instagram Caption
                </Label>
                <div className="mt-1.5 relative">
                  <Textarea
                    id="instagram-caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="min-h-[200px] font-medium"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={handleCopyCaption}
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="hashtag-suggestion" className="text-base font-medium">
                  Suggested Hashtags
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generateHashtags(testimonial).split(" ").map((hashtag, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
                    >
                      {hashtag}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Label htmlFor="seo-tips" className="text-base font-medium">
                  SEO Optimization Tips
                </Label>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>Include your brand name in the first sentence</li>
                  <li>Add a call to action at the end of your caption</li>
                  <li>Keep most important keywords at the beginning</li>
                  <li>Use line breaks to make your caption more readable</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InstagramPostGenerator;
