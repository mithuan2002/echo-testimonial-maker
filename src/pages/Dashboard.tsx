
import { useState, useEffect } from "react";
import { getTestimonials, updateTestimonialStatus, deleteTestimonial, generateShareableLink } from "@/lib/api";
import { Testimonial } from "@/types";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Link, Copy, ClipboardCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareableLink, setShareableLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeAudioTestimonial, setActiveAudioTestimonial] = useState<string | null>(null);
  const [activeVideoTestimonial, setActiveVideoTestimonial] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Failed to load testimonials",
        description: "There was an error loading the testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStatusChange = async (id: string, approved: boolean) => {
    try {
      const updatedTestimonial = await updateTestimonialStatus(id, approved);
      
      if (updatedTestimonial) {
        setTestimonials(prev => 
          prev.map(t => t.id === id ? { ...t, approved } : t)
        );
        
        toast({
          title: `Testimonial ${approved ? 'approved' : 'unapproved'}`,
          description: `The testimonial has been ${approved ? 'approved' : 'unapproved'}.`,
        });
      }
    } catch (error) {
      console.error("Error updating testimonial status:", error);
      toast({
        title: "Update failed",
        description: "Failed to update testimonial status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      const success = await deleteTestimonial(id);
      
      if (success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        
        toast({
          title: "Testimonial deleted",
          description: "The testimonial has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleGenerateLink = () => {
    const link = generateShareableLink();
    setShareableLink(link);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopySuccess(true);
    
    toast({
      title: "Link copied!",
      description: "The testimonial form link has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const pendingTestimonials = testimonials.filter(t => !t.approved);
  const approvedTestimonials = testimonials.filter(t => t.approved);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-800">Testimonial Dashboard</h1>
            <p className="text-gray-600">Manage and share your customer testimonials</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={handleGenerateLink}
                className="bg-brand-600 hover:bg-brand-700 flex items-center gap-2"
              >
                <Link size={16} />
                Get Shareable Form Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share testimonial form</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    value={shareableLink}
                    readOnly
                    className="font-mono"
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={handleCopyLink}
                  className="px-3 flex gap-2 items-center"
                >
                  {copySuccess ? (
                    <>
                      <ClipboardCheck size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Share this link with your customers to collect testimonials.
              </p>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Testimonials</CardTitle>
              <CardDescription>All collected feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-700">{testimonials.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pending Approval</CardTitle>
              <CardDescription>Testimonials awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{pendingTestimonials.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Published</CardTitle>
              <CardDescription>Approved testimonials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedTestimonials.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Testimonials List */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="pending" className="text-base">
              Pending
              {pendingTestimonials.length > 0 && (
                <Badge className="ml-2 bg-amber-500">{pendingTestimonials.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-base">
              Approved
              {approvedTestimonials.length > 0 && (
                <Badge className="ml-2 bg-green-600">{approvedTestimonials.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 text-brand-600 animate-spin" />
            </div>
          ) : (
            <>
              <TabsContent value="pending">
                {pendingTestimonials.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <div className="text-gray-500">No pending testimonials to review</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingTestimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-white border rounded-xl overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Pending Review
                            </Badge>
                            <div className="flex items-center gap-3">
                              <Button 
                                onClick={() => handleStatusChange(testimonial.id, true)}
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                              >
                                <CheckCircle size={16} className="mr-1" />
                                Approve
                              </Button>
                              <Button 
                                onClick={() => handleDelete(testimonial.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <XCircle size={16} className="mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          <TestimonialCard 
                            testimonial={testimonial}
                            onPlay={() => testimonial.mediaType === 'audio' 
                              ? setActiveAudioTestimonial(testimonial.id)
                              : setActiveVideoTestimonial(testimonial.id)
                            }
                          />
                        </div>
                        <div className="px-6 py-3 bg-gray-50 border-t">
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span>Submitted: {testimonial.createdAt.toLocaleDateString()}</span>
                            <span>Email: {testimonial.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="approved">
                {approvedTestimonials.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <div className="text-gray-500">No approved testimonials yet</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {approvedTestimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-white border rounded-xl overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Approved
                            </Badge>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center mr-2">
                                <Label htmlFor={`published-${testimonial.id}`} className="mr-2 text-sm">
                                  Published
                                </Label>
                                <Switch
                                  id={`published-${testimonial.id}`}
                                  checked={testimonial.approved}
                                  onCheckedChange={(checked) => handleStatusChange(testimonial.id, checked)}
                                />
                              </div>
                              <Button 
                                onClick={() => handleDelete(testimonial.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <XCircle size={16} className="mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          <TestimonialCard 
                            testimonial={testimonial}
                            onPlay={() => testimonial.mediaType === 'audio' 
                              ? setActiveAudioTestimonial(testimonial.id)
                              : setActiveVideoTestimonial(testimonial.id)
                            }
                          />
                        </div>
                        <div className="px-6 py-3 bg-gray-50 border-t">
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span>Approved: {testimonial.createdAt.toLocaleDateString()}</span>
                            <span>Email: {testimonial.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      
      {/* Audio Playback Dialog */}
      <Dialog 
        open={!!activeAudioTestimonial} 
        onOpenChange={(open) => !open && setActiveAudioTestimonial(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Audio Testimonial</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <audio controls className="w-full">
              <source src="" type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Video Playback Dialog */}
      <Dialog 
        open={!!activeVideoTestimonial} 
        onOpenChange={(open) => !open && setActiveVideoTestimonial(null)}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Video Testimonial</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <video 
              controls 
              className="w-full rounded-md"
            >
              <source src="" type="video/webm" />
              Your browser does not support the video element.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
