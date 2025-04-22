import { Testimonial, FormData } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Map Supabase response to our Testimonial type
const mapToTestimonial = (data: any): Testimonial => ({
  id: data.id,
  name: data.name,
  email: data.email,
  company: data.company,
  position: data.position,
  text: data.text,
  rating: data.rating,
  mediaType: data.media_type,
  mediaUrl: data.media_url,
  approved: data.approved,
  createdAt: new Date(data.created_at)
});

// Get all testimonials (with optional filtering)
export const getTestimonials = async (approvedOnly = false): Promise<Testimonial[]> => {
  let query = supabase.from('testimonials').select('*');

  if (approvedOnly) {
    query = query.eq('approved', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }

  return data ? data.map(mapToTestimonial) : [];
};

// Get single testimonial by ID
export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching testimonial:", error);
    throw error;
  }

  return data ? mapToTestimonial(data) : null;
};

// Submit a new testimonial
export const submitTestimonial = async (formData: FormData): Promise<void> => {
  try {
    // First upload media if exists
    let mediaUrl = null;
    if (formData.mediaBlob && formData.mediaType !== 'none') {
      const fileExt = formData.mediaType === 'audio' ? 'mp3' : 'mp4';
      const fileName = `${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(`public/${fileName}`, formData.mediaBlob, {
          upsert: true
        });

      if (uploadError) throw uploadError;
      mediaUrl = uploadData?.path;
    }

    // Then submit testimonial data
    const testimonialData = {
      name: formData.name,
      email: formData.email,
      company: formData.company || '',
      position: formData.position || '',
      text: formData.text,
      rating: formData.rating,
      media_type: formData.mediaType,
      media_url: mediaUrl,
      approved: false,
      created_at: new Date().toISOString(),
      user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous'
    };

    const { error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select('*');

    if (error) {
      console.error('Submission error:', error);
      throw new Error(error.message);
    }

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Error submitting testimonial:', error);
    throw error;
  }
};

// Update testimonial approval status
export const updateTestimonialStatus = async (id: string, approved: boolean): Promise<Testimonial | null> => {
  const { data, error } = await supabase
    .from('testimonials')
    .update({ approved })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating testimonial status:", error);
    throw error;
  }

  return data ? mapToTestimonial(data) : null;
};

// Delete a testimonial
export const deleteTestimonial = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }

  return true;
};

// Generate a shareable link for a testimonial form
export const generateShareableLink = (): string => {
  const formId = Math.random().toString(36).substring(2, 10);
  return `${window.location.origin}/testimonial/${formId}`;
};