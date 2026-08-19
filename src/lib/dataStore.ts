import { 
  Booking, 
  BookingFormData, 
  BookingStatus, 
  BusinessHour, 
  Review, 
  ReviewFormData, 
  ReviewStatus, 
  ScheduleException, 
  Service, 
  ServiceCategory, 
  ServiceFormData, 
  SiteSettings, 
  SpecialClosedDate 
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { DEFAULT_SITE_SETTINGS } from './constants';
import { addMinutesToTime, getTodayDateString, addDays } from '../utils/dates';

// Keys for local storage persistence
const STORAGE_KEYS = {
  SERVICES: 'ams_studio_services_v2',
  CATEGORIES: 'ams_studio_categories_v2',
  BOOKINGS: 'ams_studio_bookings_v2',
  REVIEWS: 'ams_studio_reviews_v2',
  BUSINESS_HOURS: 'ams_studio_hours_v2',
  SCHEDULE_EXCEPTIONS: 'ams_studio_exceptions_v2',
  SETTINGS: 'ams_studio_settings_v2',
};

export interface DayScheduleConfig {
  id?: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  lunch_start?: string;
  lunch_end?: string;
  is_closed: boolean;
}

// Initial Seed Data
const DEFAULT_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-cejas',
    name: 'Diseño de Cejas',
    slug: 'diseno-de-cejas',
    description: 'Técnicas avanzadas de visagismo, depilación con hilo y micropigmentación.',
    image_url: null,
    active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-pestanas',
    name: 'Pestañas',
    slug: 'pestanas',
    description: 'Lifting natural, tinte y nutrición intensiva de keratina.',
    image_url: null,
    active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cat-maquillaje',
    name: 'Maquillaje Profesional',
    slug: 'maquillaje-profesional',
    description: 'Maquillaje social, de gala y novias con técnicas de alta duración.',
    image_url: null,
    active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'Diseño & Depilación con Hilo',
    slug: 'diseno-depilacion-hilo',
    short_description: 'Mapeo facial con visagismo y depilación precisa con hilo antibacteriano.',
    description: 'Servicio personalizado de diseño de cejas que estudia las proporciones de tu rostro mediante visagismo. Incluye depilación suave con hilo hindú y perfilado impecable.',
    price: 45000,
    price_type: 'fixed',
    duration_minutes: 45,
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-cejas',
    active: true,
    featured: true,
    display_order: 1,
    preparation_notes: 'Ven con el rostro limpio y sin maquillaje en la zona de cejas.',
    aftercare_notes: 'Evitar exposición solar directa y no frotar la zona durante las primeras 12 horas.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-2',
    name: 'Laminado de Cejas & Tinte de Henna',
    slug: 'laminado-cejas-henna',
    short_description: 'Fijación, alineación y nutrición de vellos con tinte orgánico sombreado.',
    description: 'Tratamiento de nutrición y peinado semipermanente para lograr cejas pobladas, definidas y con efecto lifting. Incluye pigmento orgánico de alta duración.',
    price: 85000,
    price_type: 'fixed',
    duration_minutes: 60,
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-cejas',
    active: true,
    featured: true,
    display_order: 2,
    preparation_notes: 'Suspender uso de ácidos exfoliantes o retinol 3 días antes del tratamiento.',
    aftercare_notes: 'No mojar las cejas durante las primeras 24 horas. Aplicar sérum hidratante.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-3',
    name: 'Lifting de Pestañas + Keratina',
    slug: 'lifting-pestanas-keratina',
    short_description: 'Curvatura natural y baño de color negro intenso para alargar tus pestañas.',
    description: 'Realce natural de tus pestañas desde la raíz con tratamiento intensivo de keratina y botox de nutrición. Brinda una mirada abierta y fresca.',
    price: 75000,
    price_type: 'fixed',
    duration_minutes: 60,
    image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-pestanas',
    active: true,
    featured: true,
    display_order: 3,
    preparation_notes: 'Asistir sin rímel ni lentes de contacto puestos.',
    aftercare_notes: 'No mojar los ojos ni aplicar vapor en 24 horas.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-4',
    name: 'Maquillaje Social de Alta Gama',
    slug: 'maquillaje-social-alta-gama',
    short_description: 'Técnicas blindadas, preparación de piel premium y pestañas postizas incluidas.',
    description: 'Maquillaje profesional adaptado a tu estilo y al tipo de evento. Utilizamos productos de alta gama con técnica de piel blindada a prueba de agua y sudor.',
    price: 160000,
    price_type: 'from',
    duration_minutes: 90,
    image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-maquillaje',
    active: true,
    featured: true,
    display_order: 4,
    preparation_notes: 'Rostro hidratado y limpio. Si tienes referencias de estilo, tráelas.',
    aftercare_notes: 'Retirar con limpiador bifásico y crema desmaquillante suave.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const todayStr = getTodayDateString();

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'bk-seed-101',
    customer_name: 'Isabella Gómez',
    customer_phone: '+57 312 456 7890',
    customer_email: 'isabella@ejemplo.com',
    service_id: 'svc-1',
    appointment_date: todayStr,
    start_time: '09:00:00',
    end_time: '09:45:00',
    notes: 'Piel sensible, primera vez en diseño de cejas',
    status: 'confirmed',
    whatsapp_confirmed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bk-seed-102',
    customer_name: 'Mariana Duarte',
    customer_phone: '+57 300 987 6543',
    customer_email: 'mariana.d@ejemplo.com',
    service_id: 'svc-2',
    appointment_date: todayStr,
    start_time: '11:00:00',
    end_time: '12:00:00',
    notes: 'Lifting de pestañas para viaje de graduación',
    status: 'pending',
    whatsapp_confirmed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bk-seed-103',
    customer_name: 'Daniela Salazar',
    customer_phone: '+57 315 222 3344',
    customer_email: 'daniela.s@ejemplo.com',
    service_id: 'svc-4',
    appointment_date: addDays(todayStr, 1),
    start_time: '14:00:00',
    end_time: '15:30:00',
    notes: 'Maquillaje para evento social de noche',
    status: 'confirmed',
    whatsapp_confirmed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-seed-1',
    customer_name: 'Valentina Morales',
    rating: 5,
    comment: '¡El mejor diseño de cejas que me han hecho! La atención de Ana es impecable, súper detallista y el resultado superó todas mis expectativas.',
    service_id: 'svc-1',
    appointment_date: addDays(todayStr, -5),
    status: 'approved',
    featured: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rev-seed-2',
    customer_name: 'Camila Rengifo',
    rating: 5,
    comment: 'El maquillaje para el matrimonio de mi hermana duró toda la noche intacto. La piel quedó luminosa y nada pesada. ¡100% recomendada!',
    service_id: 'svc-4',
    appointment_date: addDays(todayStr, -10),
    status: 'approved',
    featured: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'rev-seed-3',
    customer_name: 'Sofía Mendoza',
    rating: 5,
    comment: 'Amé mi lifting de pestañas. Súper natural pero con un cambio increíble en la mirada. El estudio es hermoso y muy acogedor.',
    service_id: 'svc-3',
    appointment_date: addDays(todayStr, -14),
    status: 'approved',
    featured: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

const DEFAULT_SCHEDULE: DayScheduleConfig[] = [
  { day_of_week: 1, open_time: '08:00', close_time: '18:00', lunch_start: '13:00', lunch_end: '14:00', is_closed: false },
  { day_of_week: 2, open_time: '08:00', close_time: '18:00', lunch_start: '13:00', lunch_end: '14:00', is_closed: false },
  { day_of_week: 3, open_time: '08:00', close_time: '18:00', lunch_start: '13:00', lunch_end: '14:00', is_closed: false },
  { day_of_week: 4, open_time: '08:00', close_time: '18:00', lunch_start: '13:00', lunch_end: '14:00', is_closed: false },
  { day_of_week: 5, open_time: '08:00', close_time: '18:00', lunch_start: '13:00', lunch_end: '14:00', is_closed: false },
  { day_of_week: 6, open_time: '09:00', close_time: '17:00', lunch_start: '13:00', lunch_end: '14:00', is_closed: false },
  { day_of_week: 0, open_time: '09:00', close_time: '13:00', lunch_start: '', lunch_end: '', is_closed: true },
];

type StoreListener = () => void;

class ReactiveDataStore {
  private services: Service[] = [];
  private categories: ServiceCategory[] = [];
  private bookings: Booking[] = [];
  private reviews: Review[] = [];
  private businessHours: DayScheduleConfig[] = [];
  private scheduleExceptions: SpecialClosedDate[] = [];
  private settings: SiteSettings = DEFAULT_SITE_SETTINGS;

  private listeners: Set<StoreListener> = new Set();
  private isInitialized = false;
  private isSyncingWithSupabase = false;

  constructor() {
    this.loadFromLocalStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (Object.values(STORAGE_KEYS).includes(e.key || '')) {
          this.loadFromLocalStorage();
          this.notifyListeners();
        }
      });
    }
  }

  private loadFromLocalStorage() {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      this.categories = storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES;

      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      this.services = storedServices ? JSON.parse(storedServices) : DEFAULT_SERVICES;

      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      this.bookings = storedBookings ? JSON.parse(storedBookings) : DEFAULT_BOOKINGS;

      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      this.reviews = storedReviews ? JSON.parse(storedReviews) : DEFAULT_REVIEWS;

      const storedHours = localStorage.getItem(STORAGE_KEYS.BUSINESS_HOURS);
      this.businessHours = storedHours ? JSON.parse(storedHours) : DEFAULT_SCHEDULE;

      const storedExceptions = localStorage.getItem(STORAGE_KEYS.SCHEDULE_EXCEPTIONS);
      this.scheduleExceptions = storedExceptions ? JSON.parse(storedExceptions) : [];

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(storedSettings) } : DEFAULT_SITE_SETTINGS;
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
      this.categories = DEFAULT_CATEGORIES;
      this.services = DEFAULT_SERVICES;
      this.bookings = DEFAULT_BOOKINGS;
      this.reviews = DEFAULT_REVIEWS;
      this.businessHours = DEFAULT_SCHEDULE;
      this.scheduleExceptions = [];
      this.settings = DEFAULT_SITE_SETTINGS;
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(this.services));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(this.reviews));
      localStorage.setItem(STORAGE_KEYS.BUSINESS_HOURS, JSON.stringify(this.businessHours));
      localStorage.setItem(STORAGE_KEYS.SCHEDULE_EXCEPTIONS, JSON.stringify(this.scheduleExceptions));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
    }
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    if (!this.isInitialized) {
      this.init();
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.saveToLocalStorage();
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in store listener:', err);
      }
    });
  }

  public async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (isSupabaseConfigured) {
      await this.fetchFromSupabase();
      this.setupSupabaseRealtime();
    }
  }

  // ==========================================
  // SUPABASE INTEGRATION & REALTIME SYNC
  // ==========================================
  public async fetchFromSupabase() {
    if (!isSupabaseConfigured || this.isSyncingWithSupabase) return;
    this.isSyncingWithSupabase = true;

    try {
      // 1. Settings
      try {
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();

        if (settingsData) {
          this.settings = { ...DEFAULT_SITE_SETTINGS, ...settingsData };
        }
      } catch (e) {
        console.warn('Supabase: error fetching site_settings', e);
      }

      // 2. Categories
      try {
        const { data: catData } = await supabase
          .from('service_categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (catData && catData.length > 0) {
          this.categories = catData;
        }
      } catch (e) {
        console.warn('Supabase: error fetching service_categories', e);
      }

      // 3. Services
      try {
        const { data: srvData } = await supabase
          .from('services')
          .select('*, category:service_categories(*)')
          .order('display_order', { ascending: true });

        if (srvData && srvData.length > 0) {
          this.services = srvData;
        }
      } catch (e) {
        console.warn('Supabase: error fetching services', e);
      }

      // 4. Bookings
      try {
        const { data: bkData } = await supabase
          .from('bookings')
          .select('*, service:services(*)')
          .order('appointment_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (bkData) {
          this.bookings = bkData;
        }
      } catch (e) {
        console.warn('Supabase: error fetching bookings', e);
      }

      // 5. Reviews
      try {
        const { data: revData } = await supabase
          .from('reviews')
          .select('*, service:services(*)')
          .order('created_at', { ascending: false });

        if (revData) {
          this.reviews = revData;
        }
      } catch (e) {
        console.warn('Supabase: error fetching reviews', e);
      }

      // 6. Business Hours
      try {
        const { data: hoursData } = await supabase
          .from('business_hours')
          .select('*')
          .order('day_of_week', { ascending: true });

        if (hoursData && hoursData.length > 0) {
          // Convert to DayScheduleConfig
          this.businessHours = hoursData.map((h: any) => ({
            id: h.id,
            day_of_week: h.day_of_week,
            open_time: h.start_time?.substring(0, 5) || h.open_time || '08:00',
            close_time: h.end_time?.substring(0, 5) || h.close_time || '18:00',
            lunch_start: h.lunch_start || '13:00',
            lunch_end: h.lunch_end || '14:00',
            is_closed: h.is_closed !== undefined ? h.is_closed : !h.active,
          }));
        }
      } catch (e) {
        console.warn('Supabase: error fetching business_hours', e);
      }

      // 7. Schedule Exceptions
      try {
        const { data: excData } = await supabase
          .from('schedule_exceptions')
          .select('*')
          .order('date', { ascending: true });

        if (excData) {
          this.scheduleExceptions = excData.map((ex: any) => ({
            id: ex.id,
            closed_date: ex.date,
            reason: ex.reason || 'Cerrado',
            created_at: ex.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase: error fetching schedule_exceptions', e);
      }

      this.notifyListeners();
    } catch (err) {
      console.warn('Error fetching all data from Supabase:', err);
    } finally {
      this.isSyncingWithSupabase = false;
    }
  }

  private setupSupabaseRealtime() {
    if (!isSupabaseConfigured) return;

    try {
      const channel = supabase
        .channel('db-realtime-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          () => {
            this.fetchFromSupabase();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Failed to setup realtime listener:', e);
    }
  }

  // ==========================================
  // SERVICES GETTERS & MUTATIONS
  // ==========================================
  public getServices(includeInactive = false): Service[] {
    const list = this.services.map((svc) => {
      const cat = this.categories.find((c) => c.id === svc.category_id);
      return {
        ...svc,
        is_active: svc.active,
        category: cat || svc.category || null,
      };
    });
    return includeInactive ? list : list.filter((s) => s.active);
  }

  public getCategories(includeInactive = false): ServiceCategory[] {
    return includeInactive ? this.categories : this.categories.filter((c) => c.active);
  }

  public async createService(formData: ServiceFormData | Partial<Service>): Promise<{ success: boolean; data?: Service; error?: string }> {
    const slug = formData.name
      ? String(formData.name)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : `servicio-${Date.now()}`;

    const newId = `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const isAct = (formData as any).is_active ?? (formData as any).active ?? true;

    const newService: Service = {
      id: newId,
      name: formData.name || 'Nuevo Servicio',
      slug,
      short_description: formData.short_description || null,
      description: formData.description || null,
      price: formData.price || 0,
      price_type: formData.price_type || 'fixed',
      duration_minutes: formData.duration_minutes || 60,
      image_url: formData.image_url || null,
      category_id: formData.category_id || (this.categories[0]?.id ?? null),
      active: isAct,
      featured: formData.featured || false,
      display_order: this.services.length + 1,
      preparation_notes: formData.preparation_notes || null,
      aftercare_notes: formData.aftercare_notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.services = [...this.services, newService];
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('services')
          .insert({
            name: newService.name,
            slug: newService.slug,
            short_description: newService.short_description,
            description: newService.description,
            price: newService.price,
            price_type: newService.price_type,
            duration_minutes: newService.duration_minutes,
            image_url: newService.image_url,
            category_id: newService.category_id,
            active: newService.active,
            featured: newService.featured,
            display_order: newService.display_order,
            preparation_notes: newService.preparation_notes,
            aftercare_notes: newService.aftercare_notes,
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase createService error:', error.message);
        } else if (data) {
          this.services = this.services.map((s) => (s.id === newId ? data : s));
          this.notifyListeners();
        }
      } catch (err: any) {
        console.warn('Supabase createService exception:', err);
      }
    }

    return { success: true, data: newService };
  }

  public async updateService(id: string, updates: Partial<Service> | ServiceFormData): Promise<{ success: boolean; data?: Service; error?: string }> {
    const isAct = (updates as any).is_active !== undefined ? (updates as any).is_active : (updates as any).active;

    this.services = this.services.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          ...updates,
          active: isAct !== undefined ? isAct : s.active,
          updated_at: new Date().toISOString(),
        };
      }
      return s;
    });

    const updated = this.services.find((s) => s.id === id);
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const payload: any = { ...updates, updated_at: new Date().toISOString() };
        if (isAct !== undefined) payload.active = isAct;
        delete payload.is_active;
        delete payload.category;

        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', id);

        if (error) console.warn('Supabase updateService error:', error.message);
      } catch (err) {
        console.warn('Supabase updateService exception:', err);
      }
    }

    return { success: true, data: updated };
  }

  public async toggleServiceActive(id: string, active: boolean): Promise<{ success: boolean; error?: string }> {
    return this.updateService(id, { active } as any);
  }

  public async deleteService(id: string): Promise<{ success: boolean; error?: string }> {
    this.services = this.services.filter((s) => s.id !== id);
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) console.warn('Supabase deleteService error:', error.message);
      } catch (err) {
        console.warn('Supabase deleteService exception:', err);
      }
    }

    return { success: true };
  }

  // ==========================================
  // BOOKINGS GETTERS & MUTATIONS
  // ==========================================
  public getBookings(filterDate?: string, filterStatus?: BookingStatus | 'all'): Booking[] {
    let list = this.bookings.map((b) => {
      const svc = this.services.find((s) => s.id === b.service_id);
      return {
        ...b,
        service: svc || b.service || undefined,
      };
    });

    if (filterDate) {
      list = list.filter((b) => b.appointment_date === filterDate);
    }
    if (filterStatus && filterStatus !== 'all') {
      list = list.filter((b) => b.status === filterStatus);
    }

    return list.sort((a, b) => {
      const dateCmp = a.appointment_date.localeCompare(b.appointment_date);
      if (dateCmp !== 0) return dateCmp;
      return a.start_time.localeCompare(b.start_time);
    });
  }

  public async createBooking(
    formData: BookingFormData,
    durationMinutes: number
  ): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    const cleanStartTime = formData.start_time.includes(':00') 
      ? formData.start_time 
      : `${formData.start_time}:00`;
    const endTime = addMinutesToTime(formData.start_time, durationMinutes);

    // Collision prevention check
    const existingActive = this.bookings.filter(
      (b) => b.appointment_date === formData.appointment_date && b.status !== 'cancelled'
    );

    const hasConflict = existingActive.some((b) => {
      return b.start_time < endTime && b.end_time > cleanStartTime;
    });

    if (hasConflict) {
      return {
        success: false,
        error: 'El horario seleccionado ya no está disponible. Por favor elige otro horario.',
      };
    }

    const newId = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const matchedService = this.services.find((s) => s.id === formData.service_id);

    const newBooking: Booking = {
      id: newId,
      customer_name: formData.customer_name.trim(),
      customer_phone: formData.customer_phone.trim(),
      customer_email: formData.customer_email ? formData.customer_email.trim() : null,
      service_id: formData.service_id,
      appointment_date: formData.appointment_date,
      start_time: cleanStartTime,
      end_time: endTime,
      notes: formData.notes ? formData.notes.trim() : null,
      status: 'pending',
      whatsapp_confirmed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      service: matchedService,
    };

    this.bookings = [newBooking, ...this.bookings];
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            customer_name: newBooking.customer_name,
            customer_phone: newBooking.customer_phone,
            customer_email: newBooking.customer_email,
            service_id: newBooking.service_id,
            appointment_date: newBooking.appointment_date,
            start_time: newBooking.start_time,
            end_time: newBooking.end_time,
            notes: newBooking.notes,
            status: 'pending',
            whatsapp_confirmed: false,
          })
          .select('*, service:services(*)')
          .single();

        if (error) {
          console.warn('Supabase createBooking error:', error.message);
        } else if (data) {
          this.bookings = this.bookings.map((b) => (b.id === newId ? data : b));
          this.notifyListeners();
          return { success: true, bookingId: data.id };
        }
      } catch (err) {
        console.warn('Supabase createBooking exception:', err);
      }
    }

    return { success: true, bookingId: newId };
  }

  public async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    whatsappConfirmed?: boolean
  ): Promise<{ success: boolean; error?: string }> {
    this.bookings = this.bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: newStatus,
          whatsapp_confirmed: whatsappConfirmed !== undefined ? whatsappConfirmed : b.whatsapp_confirmed,
          updated_at: new Date().toISOString(),
        };
      }
      return b;
    });

    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
        if (whatsappConfirmed !== undefined) updates.whatsapp_confirmed = whatsappConfirmed;

        const { error } = await supabase
          .from('bookings')
          .update(updates)
          .eq('id', bookingId);

        if (error) console.warn('Supabase updateBookingStatus error:', error.message);
      } catch (err) {
        console.warn('Supabase updateBookingStatus exception:', err);
      }
    }

    return { success: true };
  }

  public async deleteBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
    this.bookings = this.bookings.filter((b) => b.id !== bookingId);
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
        if (error) console.warn('Supabase deleteBooking error:', error.message);
      } catch (err) {
        console.warn('Supabase deleteBooking exception:', err);
      }
    }

    return { success: true };
  }

  // ==========================================
  // REVIEWS GETTERS & MUTATIONS
  // ==========================================
  public getReviews(filterParam: ReviewStatus | 'all' | boolean = 'approved'): Review[] {
    const normalized: ReviewStatus | 'all' =
      typeof filterParam === 'boolean' ? (filterParam ? 'approved' : 'all') : filterParam;

    const list = this.reviews.map((r) => {
      const svc = this.services.find((s) => s.id === r.service_id);
      return {
        ...r,
        service: svc || r.service || null,
        is_approved: r.status === 'approved',
      };
    });

    if (normalized === 'all') return list;
    return list.filter((r) => r.status === normalized);
  }

  public async submitReview(formData: ReviewFormData): Promise<{ success: boolean; data?: Review; error?: string }> {
    const newId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const matchedService = this.services.find((s) => s.id === formData.service_id);

    const newReview: Review = {
      id: newId,
      customer_name: formData.customer_name.trim(),
      rating: formData.rating,
      comment: formData.comment.trim(),
      service_id: formData.service_id || null,
      appointment_date: formData.appointment_date || null,
      status: 'pending',
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      service: matchedService || null,
    };

    this.reviews = [newReview, ...this.reviews];
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert({
            customer_name: newReview.customer_name,
            rating: newReview.rating,
            comment: newReview.comment,
            service_id: newReview.service_id,
            appointment_date: newReview.appointment_date,
            status: 'pending',
            featured: false,
          })
          .select('*, service:services(*)')
          .single();

        if (error) {
          console.warn('Supabase submitReview error:', error.message);
        } else if (data) {
          this.reviews = this.reviews.map((r) => (r.id === newId ? data : r));
          this.notifyListeners();
        }
      } catch (err) {
        console.warn('Supabase submitReview exception:', err);
      }
    }

    return { success: true, data: newReview };
  }

  public async updateReviewStatus(
    reviewId: string,
    status: ReviewStatus,
    featured?: boolean
  ): Promise<{ success: boolean; error?: string }> {
    this.reviews = this.reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          status,
          featured: featured !== undefined ? featured : r.featured,
          updated_at: new Date().toISOString(),
        };
      }
      return r;
    });

    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const updates: any = { status, updated_at: new Date().toISOString() };
        if (featured !== undefined) updates.featured = featured;

        const { error } = await supabase
          .from('reviews')
          .update(updates)
          .eq('id', reviewId);

        if (error) console.warn('Supabase updateReviewStatus error:', error.message);
      } catch (err) {
        console.warn('Supabase updateReviewStatus exception:', err);
      }
    }

    return { success: true };
  }

  public async approveReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
    return this.updateReviewStatus(reviewId, 'approved');
  }

  public async rejectReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
    return this.updateReviewStatus(reviewId, 'rejected');
  }

  public async deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
    this.reviews = this.reviews.filter((r) => r.id !== reviewId);
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
        if (error) console.warn('Supabase deleteReview error:', error.message);
      } catch (err) {
        console.warn('Supabase deleteReview exception:', err);
      }
    }

    return { success: true };
  }

  // ==========================================
  // BUSINESS HOURS & EXCEPTIONS
  // ==========================================
  public getBusinessHours(): DayScheduleConfig[] {
    return this.businessHours;
  }

  public getSpecialClosedDates(): SpecialClosedDate[] {
    return this.scheduleExceptions;
  }

  public async saveBusinessHours(hoursList: DayScheduleConfig[]): Promise<{ success: boolean; error?: string }> {
    this.businessHours = hoursList;
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        // Upsert into Supabase business_hours
        const payload = hoursList.map((h) => ({
          day_of_week: h.day_of_week,
          start_time: h.open_time.includes(':00') ? h.open_time : `${h.open_time}:00`,
          end_time: h.close_time.includes(':00') ? h.close_time : `${h.close_time}:00`,
          active: !h.is_closed,
          updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase
          .from('business_hours')
          .upsert(payload, { onConflict: 'day_of_week' });

        if (error) console.warn('Supabase saveBusinessHours error:', error.message);
      } catch (err) {
        console.warn('Supabase saveBusinessHours exception:', err);
      }
    }

    return { success: true };
  }

  public async addSpecialClosedDate(closedDate: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    const newId = `closed-${Date.now()}`;
    const newEntry: SpecialClosedDate = {
      id: newId,
      closed_date: closedDate,
      reason: reason || 'Cerrado por motivos personales / festivo',
      created_at: new Date().toISOString(),
    };

    this.scheduleExceptions = [...this.scheduleExceptions, newEntry];
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('schedule_exceptions')
          .insert({
            date: closedDate,
            type: 'closed',
            reason: newEntry.reason,
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase addSpecialClosedDate error:', error.message);
        } else if (data) {
          this.scheduleExceptions = this.scheduleExceptions.map((e) =>
            e.id === newId ? { ...e, id: data.id } : e
          );
          this.notifyListeners();
        }
      } catch (err) {
        console.warn('Supabase addSpecialClosedDate exception:', err);
      }
    }

    return { success: true };
  }

  public async removeSpecialClosedDate(id: string): Promise<{ success: boolean; error?: string }> {
    const item = this.scheduleExceptions.find((e) => e.id === id);
    this.scheduleExceptions = this.scheduleExceptions.filter((e) => e.id !== id);
    this.notifyListeners();

    if (isSupabaseConfigured && item) {
      try {
        const { error } = await supabase
          .from('schedule_exceptions')
          .delete()
          .or(`id.eq.${id},date.eq.${item.closed_date}`);

        if (error) console.warn('Supabase removeSpecialClosedDate error:', error.message);
      } catch (err) {
        console.warn('Supabase removeSpecialClosedDate exception:', err);
      }
    }

    return { success: true };
  }

  // ==========================================
  // SETTINGS GETTERS & MUTATIONS
  // ==========================================
  public getSettings(): SiteSettings {
    return this.settings;
  }

  public async updateSettings(newSettings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> {
    this.settings = {
      ...this.settings,
      ...newSettings,
      updated_at: new Date().toISOString(),
    };
    this.notifyListeners();

    if (isSupabaseConfigured) {
      try {
        const payload = {
          ...newSettings,
          id: 'default',
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('site_settings')
          .upsert(payload);

        if (error) console.warn('Supabase updateSettings error:', error.message);
      } catch (err) {
        console.warn('Supabase updateSettings exception:', err);
      }
    }

    return { success: true };
  }
}

export const dataStore = new ReactiveDataStore();
