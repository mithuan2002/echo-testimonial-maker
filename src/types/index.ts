
export interface Testimonial {
  id: string;
  name: string;
  email: string;
  company?: string;
  position?: string;
  text: string;
  rating?: number;
  mediaType?: 'audio' | 'video' | 'none';
  mediaUrl?: string;
  approved: boolean;
  createdAt: Date;
}

export interface FormData {
  name: string;
  email: string;
  company: string;
  position: string;
  text: string;
  rating: number;
  mediaType: 'audio' | 'video' | 'none';
  mediaBlob?: Blob;
}
