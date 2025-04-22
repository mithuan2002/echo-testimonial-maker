
import { Testimonial, FormData } from "@/types";

// Mock database for demonstration
let testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    company: "TechCorp",
    position: "Product Manager",
    text: "Echo Testimonials has transformed how we collect feedback from customers. The seamless video recording feature made it so easy to capture authentic testimonials!",
    rating: 5,
    mediaType: "video",
    mediaUrl: "",
    approved: true,
    createdAt: new Date("2023-10-15")
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    company: "DesignHub",
    position: "Creative Director",
    text: "The simplicity of sharing a testimonial form link with our clients has increased our testimonial collection by 300%. A game-changer for our marketing materials.",
    rating: 4,
    mediaType: "audio",
    mediaUrl: "",
    approved: true,
    createdAt: new Date("2023-11-22")
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma@example.com",
    company: "StartupX",
    position: "CEO",
    text: "As a startup founder, I needed an easy way to showcase customer feedback. Echo Testimonials provided exactly what I needed with minimal setup.",
    rating: 5,
    mediaType: "none",
    approved: true,
    createdAt: new Date("2023-12-05")
  }
];

// Get all testimonials (with optional filtering)
export const getTestimonials = async (approvedOnly = false): Promise<Testimonial[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (approvedOnly) {
    return testimonials.filter(t => t.approved);
  }
  return [...testimonials];
};

// Get single testimonial by ID
export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const testimonial = testimonials.find(t => t.id === id);
  return testimonial || null;
};

// Submit a new testimonial
export const submitTestimonial = async (formData: FormData): Promise<Testimonial> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, you would upload the media to storage here
  // and get back a URL to store in the database
  let mediaUrl = "";
  
  const newTestimonial: Testimonial = {
    id: Date.now().toString(),
    name: formData.name,
    email: formData.email,
    company: formData.company,
    position: formData.position,
    text: formData.text,
    rating: formData.rating,
    mediaType: formData.mediaType,
    mediaUrl: mediaUrl,
    approved: false, // New testimonials need approval
    createdAt: new Date()
  };
  
  testimonials.unshift(newTestimonial);
  return newTestimonial;
};

// Update testimonial approval status
export const updateTestimonialStatus = async (id: string, approved: boolean): Promise<Testimonial | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = testimonials.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  testimonials[index] = {
    ...testimonials[index],
    approved
  };
  
  return testimonials[index];
};

// Delete a testimonial
export const deleteTestimonial = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const initialLength = testimonials.length;
  testimonials = testimonials.filter(t => t.id !== id);
  
  return testimonials.length < initialLength;
};

// Generate a shareable link for a testimonial form
export const generateShareableLink = (): string => {
  // In a real app, you might generate a unique ID and create a database entry
  const formId = Math.random().toString(36).substring(2, 10);
  return `${window.location.origin}/testimonial/${formId}`;
};
