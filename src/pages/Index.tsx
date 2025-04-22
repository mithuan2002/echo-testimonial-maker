
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TestimonialCard from "@/components/TestimonialCard";
import { getTestimonials } from "@/lib/api";
import { useEffect, useState } from "react";
import { Testimonial } from "@/types";
import { Mic, Video, MessageSquare, Link2 } from "lucide-react";

const Index = () => {
  const [featuredTestimonials, setFeaturedTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials(true);
        setFeaturedTestimonials(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-brand-50 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-800 mb-6">
              Capture Authentic Customer Testimonials
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Easily collect video, audio, and text testimonials from your customers with a simple shareable link.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700">
                <Link to="/dashboard">Go To Dashboard</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/testimonial/demo">Try Demo Form</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Video Testimonials</h3>
              <p className="text-gray-600">
                Capture authentic video testimonials directly in the browser. No uploads needed!
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Audio Testimonials</h3>
              <p className="text-gray-600">
                Let customers record high-quality audio testimonials with one click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <Link2 className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Shareable Links</h3>
              <p className="text-gray-600">
                Generate custom links to share with customers for easy testimonial collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-800 mb-4">
              See Echo in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are some testimonials collected using our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm h-64 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : featuredTestimonials.length > 0 ? (
              featuredTestimonials.map(testimonial => (
                <TestimonialCard 
                  key={testimonial.id} 
                  testimonial={testimonial}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No testimonials to display yet.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-brand-600 hover:bg-brand-700">
              <Link to="/dashboard">View All Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-800 mb-4">
              How Echo Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Collecting testimonials has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Generate a Link</h3>
              <p className="text-gray-600">
                Create a custom testimonial form link from your dashboard.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Share with Customers</h3>
              <p className="text-gray-600">
                Send the link to your customers via email, social media, or your website.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-brand-600">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Collect & Showcase</h3>
              <p className="text-gray-600">
                Approve testimonials and showcase them on your website or marketing materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-brand-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Collect Amazing Testimonials?
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Start gathering authentic customer feedback today.
          </p>
          <Button asChild size="lg" className="bg-white text-brand-600 hover:bg-brand-50">
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-brand-800">Echo Testimonials</h2>
              <p className="text-gray-600">Collect authentic testimonials with ease</p>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-brand-600">Home</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-brand-600">Dashboard</Link>
              <Link to="/testimonial/demo" className="text-gray-600 hover:text-brand-600">Demo</Link>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Echo Testimonials. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
