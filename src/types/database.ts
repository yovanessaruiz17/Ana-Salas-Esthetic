export type PriceType = 'fixed' | 'from' | 'consultation';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ExceptionType = 'closed' | 'blocked' | 'special_hours';
export type UserRole = 'admin' | 'client' | 'staff';

export interface SiteSettings {
  id: string;
  business_name: string;
  professional_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  google_maps_url: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  timezone: string;
  hero_image_url: string;
  professional_image_url: string;
  logo_url: string;
  favicon_url: string;
  about_history: string;
  about_experience: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  price_type: PriceType;
  duration_minutes: number;
  image_url: string | null;
  category_id: string | null;
  active: boolean;
  featured: boolean;
  display_order: number;
  preparation_notes: string | null;
  aftercare_notes: string | null;
  created_at: string;
  updated_at: string;
  category?: ServiceCategory | null;
}

export interface BusinessHour {
  id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleException {
  id: string;
  date: string; // YYYY-MM-DD
  type: ExceptionType;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  notes: string | null;
  status: BookingStatus;
  whatsapp_confirmed: boolean;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  service_id: string | null;
  appointment_date: string | null;
  status: ReviewStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
  service?: Service | null;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  service_id: string | null;
  featured: boolean;
  display_order: number;
  created_at: string;
}

export interface TimeSlot {
  time: string; // HH:MM
  formattedTime: string; // 12h format: e.g. "09:00 AM"
  available: boolean;
  reason?: string;
}
