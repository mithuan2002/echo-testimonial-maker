
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormData } from "@/types";
import { submitTestimonial } from "@/lib/api";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioRecorder from "@/components/AudioRecorder";
import VideoRecorder from "@/components/VideoRecorder";
import { Mic, Video, MessageSquare, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  position: z.string().optional(),
  text: z.string().min(10, { message: "Testimonial must be at least 10 characters" }),
  rating: z.number().min(1).max(5),
  mediaType: z.enum(["audio", "video", "none"]),
});

const TestimonialForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      position: "",
      text: "",
      rating: 5,
      mediaType: "none",
    },
  });
  
  const mediaType = form.watch("mediaType");
  
  const handleAudioRecorded = (blob: Blob) => {
    setMediaBlob(blob);
  };
  
  const handleVideoRecorded = (blob: Blob) => {
    setMediaBlob(blob);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const formData: FormData = {
        name: values.name,
        email: values.email,
        company: values.company || "",
        position: values.position || "",
        text: values.text,
        rating: values.rating,
        mediaType: values.mediaType,
        mediaBlob: mediaType !== "none" ? mediaBlob : undefined
      };
      
      await submitTestimonial(formData);
      
      toast({
        title: "Testimonial submitted!",
        description: "Thank you for sharing your experience.",
      });
      
      setSubmissionComplete(true);
      
    } catch (error: any) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your testimonial. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  if (submissionComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-brand-600">Thank You!</CardTitle>
            <CardDescription>
              Your testimonial has been successfully submitted.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pt-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-12 w-12 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-center text-gray-600">
              We appreciate you taking the time to share your experience with us.
              Your feedback is invaluable!
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-brand-600 hover:bg-brand-700" onClick={() => navigate("/")}>
              Return Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-700 mb-2">Share Your Experience</h1>
          <p className="text-gray-600">We value your feedback! Please share your experience with us.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Testimonial</CardTitle>
            <CardDescription>
              Fill out the form below to share your experience. You can include text, audio, or video.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormDescription>
                          We'll never share your email with anyone.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company name (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Your job title (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Testimonial*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your experience with us..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating*</FormLabel>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className={`text-2xl ${
                              field.value >= rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => form.setValue("rating", rating)}
                          >
                            <Star className={field.value >= rating ? "fill-yellow-400" : "fill-gray-200"} />
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Media Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="none" id="none" />
                            <FormLabel htmlFor="none" className="font-normal cursor-pointer flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Text Only
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="audio" id="audio" />
                            <FormLabel htmlFor="audio" className="font-normal cursor-pointer flex items-center gap-2">
                              <Mic className="h-5 w-5" />
                              Include Audio Recording
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="video" id="video" />
                            <FormLabel htmlFor="video" className="font-normal cursor-pointer flex items-center gap-2">
                              <Video className="h-5 w-5" />
                              Include Video Recording
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {mediaType !== "none" && (
                  <Tabs defaultValue="record" className="w-full">
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="record">Record {mediaType === "audio" ? "Audio" : "Video"}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="record" className="mt-4">
                      {mediaType === "audio" ? (
                        <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                      ) : (
                        <VideoRecorder onVideoRecorded={handleVideoRecorded} />
                      )}
                    </TabsContent>
                  </Tabs>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-brand-600 hover:bg-brand-700"
                  disabled={isSubmitting || (mediaType !== "none" && !mediaBlob)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Testimonial"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialForm;
