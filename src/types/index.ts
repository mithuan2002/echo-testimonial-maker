export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  position?: string;
  text: string;
  rating: number;
  media_url?: string;
  media_type?: 'audio' | 'video' | 'none';
  created_at: string;
}

export interface FormData {
  name: string;
  email: string;
  company?: string;
  position?: string;
  text: string;
  rating: number;
  mediaType: 'audio' | 'video' | 'none';
  mediaBlob?: Blob;
}