export * from './database';

export type BusinessSettings = import('./database').SiteSettings;
export type BusinessHours = import('./database').BusinessHour;
export type SpecialClosedDate = {
  id: string;
  closed_date: string;
  reason: string | null;
  created_at?: string;
};

export interface ServiceFormData {
  name: string;
  short_description: string;
  description: string;
  duration_minutes: number;
  price: number;
  price_type: 'fixed' | 'from' | 'consultation';
  category_id: string;
  image_url: string;
  preparation_notes: string;
  aftercare_notes: string;
  featured: boolean;
  is_active: boolean;
}

export interface BookingFormData {
  service_id: string;
  appointment_date: string;
  start_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string;
}

export interface ReviewFormData {
  customer_name: string;
  rating: number;
  comment: string;
  service_id?: string;
  appointment_date?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}
