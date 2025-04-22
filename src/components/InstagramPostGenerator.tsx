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

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal Clean",
    bgColor: "bg-white",
    textColor: "text-gray-900",
    accentColor: "bg-brand-600",
    fontStyle: "font-sans",
  },
  {
    id: "gradient-purple",
    name: "Purple Gradient",
    bgColor: "bg-gradient-to-br from-purple-100 to-purple-300",
    textColor: "text-gray-900",
    accentColor: "bg-purple-700",
    fontStyle: "font-serif",
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    bgColor: "bg-gray-900",
    textColor: "text-white",
    accentColor: "bg-brand-500",
    fontStyle: "font-mono",
  },
  {
    id: "premium-gold",
    name: "Premium Gold",
    bgColor: "bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200",
    textColor: "text-gray-900",
    accentColor: "bg-amber-600",
    fontStyle: "font-serif",
    className: "shadow-[inset_0_0_50px_rgba(251,191,36,0.3)]",
  },
  {
    id: "luxury-marble",
    name: "Luxury Marble",
    bgColor: "bg-gradient-to-br from-gray-50 to-gray-200",
    textColor: "text-gray-900",
    accentColor: "bg-gray-800",
    fontStyle: "font-serif",
    className: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTIwIDIwTDAgNDBoNDBMMjAgMjB6IiBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuMDUpIi8+PC9zdmc+')]",
  },
  {
    id: "startup-vibe",
    name: "Startup Vibe",
    bgColor: "bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500",
    textColor: "text-white",
    accentColor: "bg-white",
    fontStyle: "font-sans",
    className: "shadow-lg",
  },
  {
    id: "trustworthy-blue",
    name: "Trustworthy Blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-900",
    accentColor: "bg-blue-600",
    fontStyle: "font-sans",
    className: "border-2 border-blue-200",
  },
  {
    id: "modern-mesh",
    name: "Modern Mesh",
    bgColor: "bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500",
    textColor: "text-white",
    accentColor: "bg-white",
    fontStyle: "font-sans",
    className: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBMMCAwaDYwTDMwIDMweiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] bg-opacity-90",
  },
  {
    id: "eco-friendly",
    name: "Eco Friendly",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
    textColor: "text-emerald-900",
    accentColor: "bg-emerald-600",
    fontStyle: "font-sans",
    className: "border-l-4 border-emerald-500",
  },
  {
    id: "social-impact",
    name: "Social Impact",
    bgColor: "bg-gradient-to-r from-orange-100 to-rose-100",
    textColor: "text-gray-900",
    accentColor: "bg-rose-500",
    fontStyle: "font-sans",
    className: "shadow-[0_4px_20px_rgba(251,113,133,0.2)]",
  },
  {
    id: "tech-minimal",
    name: "Tech Minimal",
    bgColor: "bg-slate-900",
    textColor: "text-slate-50",
    accentColor: "bg-cyan-400",
    fontStyle: "font-mono",
    className: "border border-slate-700",
  },
  {
    id: "creative-dots",
    name: "Creative Dots",
    bgColor: "bg-white",
    textColor: "text-gray-900",
    accentColor: "bg-violet-500",
    fontStyle: "font-sans",
    className: "bg-[radial-gradient(circle,_#e5e7eb_1px,_transparent_1px)] bg-[size:20px_20px]",
  },
  {
    id: "elegant-dark",
    name: "Elegant Dark",
    bgColor: "bg-gradient-to-br from-gray-900 to-slate-900",
    textColor: "text-gray-100",
    accentColor: "bg-amber-400",
    fontStyle: "font-serif",
    className: "shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]",
  },
  {
    id: "client-success",
    name: "Client Success",
    bgColor: "bg-gradient-to-r from-green-400 to-emerald-500",
    textColor: "text-white",
    accentColor: "bg-white",
    fontStyle: "font-sans",
    className: "shadow-[0_10px_30px_rgba(16,185,129,0.3)]",
  },
  {
    id: "testimonial-pro",
    name: "Testimonial Pro",
    bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
    textColor: "text-gray-900",
    accentColor: "bg-brand-600",
    fontStyle: "font-sans",
    className: "border-t-4 border-brand-500 shadow-sm",
  }
];

const generateHashtags = (testimonial: Testimonial): string => {
  const hashtags = [
    "#testimonial",
    "#customerfeedback",
    "#customerexperience",
    "#review",
  ];
  
  if (testimonial.company) {
    hashtags.push("#business", "#partnership");
  }
  
  if (testimonial.rating && testimonial.rating >= 4) {
    hashtags.push("#fivestars", "#recommended");
  }
  
  return hashtags.slice(0, 8).join(" ");
};

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
  
  const handleTemplateChange = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    setSelectedTemplate(template);
  };
  
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    toast({
      title: "Caption copied!",
      description: "Instagram caption copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownloadImage = async () => {
    if (!postRef.current) return;
    
    setIsDownloading(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      const canvas = await html2canvas(postRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: null,
        useCORS: true
      });
      
      const image = canvas.toDataURL("image/png");
      
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
                <Label htmlFor="template" className="text-base font-medium">Template Style</Label>
                <Select 
                  value={selectedTemplate.id} 
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="grid grid-cols-1 gap-1 p-1">
                      {TEMPLATES.map(template => (
                        <SelectItem 
                          key={template.id} 
                          value={template.id}
                          className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                        >
                          <div className={`w-4 h-4 rounded ${template.accentColor}`} />
                          <span>{template.name}</span>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              
              <Card className="overflow-hidden border-2 border-gray-200">
                <div 
                  ref={postRef}
                  className={`aspect-square ${selectedTemplate.bgColor} ${selectedTemplate.className || ''} relative p-6 flex items-center justify-center transition-all duration-300`}
                >
                  <div className={`max-w-xs mx-auto text-center ${selectedTemplate.fontStyle}`}>
                    <div className={`text-lg md:text-xl font-medium ${selectedTemplate.textColor} mb-4 transition-colors duration-300`}>
                      "{testimonial.text.length > 120 
                        ? testimonial.text.substring(0, 120) + "..." 
                        : testimonial.text}"
                    </div>
                    <div className="flex items-center justify-center">
                      <div className={`h-0.5 w-12 ${selectedTemplate.accentColor} my-3 transition-colors duration-300`}></div>
                    </div>
                    <div className={`text-sm md:text-base font-medium ${selectedTemplate.textColor} transition-colors duration-300`}>
                      {testimonial.name}
                    </div>
                    {(testimonial.position || testimonial.company) && (
                      <div className={`text-xs md:text-sm ${selectedTemplate.textColor} opacity-80 transition-colors duration-300`}>
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
