-- ==============================================================================
-- SCHEMA SUPABASE: ANA MARÍA SALAS - BEAUTY STUDIO & BOOKINGS PWA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admins & Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'client', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SITE SETTINGS (Dynamic Business, SEO & Contact Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  business_name TEXT NOT NULL DEFAULT 'Ana María Salas Studio',
  professional_name TEXT NOT NULL DEFAULT 'Ana María Salas',
  tagline TEXT NOT NULL DEFAULT 'Cejista & Maquillista Profesional',
  description TEXT DEFAULT 'Estudio boutique especializado en realzar tu belleza natural con técnicas de alta precisión en cejas, pestañas y maquillaje para eventos.',
  phone TEXT DEFAULT '+57 300 000 0000',
  whatsapp TEXT DEFAULT '573000000000',
  email TEXT DEFAULT 'contacto@anamariasalas.com',
  address TEXT DEFAULT 'Calle 123 #45-67, Edificio Boutique',
  city TEXT DEFAULT 'Bogotá',
  state TEXT DEFAULT 'Cundinamarca',
  country TEXT DEFAULT 'Colombia',
  google_maps_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT 'https://instagram.com/anamariasalas_studio',
  facebook_url TEXT DEFAULT '',
  tiktok_url TEXT DEFAULT '',
  timezone TEXT NOT NULL DEFAULT 'America/Bogota',
  hero_image_url TEXT DEFAULT '',
  professional_image_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  about_history TEXT DEFAULT 'Apasionada por el arte de la belleza y la armonización facial, brindando un servicio exclusivo, personalizado y con los más altos estándares de bioseguridad.',
  about_experience TEXT DEFAULT 'Años de dedicación perfeccionando técnicas modernas en visagismo de cejas, micropigmentación, laminado y maquillaje profesional para novias y eventos especiales.',
  meta_title TEXT DEFAULT 'Ana María Salas | Cejista & Maquillista | Reservas Online',
  meta_description TEXT DEFAULT 'Reserva tu cita con Ana María Salas. Especialista en cejas perfectas, pestañas y maquillaje profesional de alta gama.',
  meta_keywords TEXT DEFAULT 'cejas, micropigmentacion, laminado de cejas, maquillaje profesional, novias, pestañas, citas de belleza',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS public.service_categories (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_type TEXT NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'from', 'consultation')),
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  image_url TEXT,
  category_id TEXT REFERENCES public.service_categories(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  preparation_notes TEXT,
  aftercare_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BUSINESS HOURS (Weekly schedule)
CREATE TABLE IF NOT EXISTS public.business_hours (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  day_of_week INTEGER NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday... 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SCHEDULE EXCEPTIONS (Closed dates & holidays)
CREATE TABLE IF NOT EXISTS public.schedule_exceptions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  date DATE NOT NULL,
  type TEXT NOT NULL DEFAULT 'closed' CHECK (type IN ('closed', 'blocked', 'special_hours')),
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BOOKINGS (Appointments)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  whatsapp_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
  appointment_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR SPEED
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active, display_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.service_categories(active, display_order);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status, featured);
CREATE INDEX IF NOT EXISTS idx_business_hours_day ON public.business_hours(day_of_week, active);
CREATE INDEX IF NOT EXISTS idx_exceptions_date ON public.schedule_exceptions(date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users manage profiles" ON public.profiles FOR ALL TO authenticated USING (true);

-- 2. Site Settings
CREATE POLICY "Public site_settings select" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Manage site_settings" ON public.site_settings FOR ALL TO anon, authenticated USING (true);

-- 3. Categories
CREATE POLICY "Public categories select" ON public.service_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Manage categories" ON public.service_categories FOR ALL TO anon, authenticated USING (true);

-- 4. Services
CREATE POLICY "Public services select" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Manage services" ON public.services FOR ALL TO anon, authenticated USING (true);

-- 5. Business Hours
CREATE POLICY "Public business_hours select" ON public.business_hours FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Manage business_hours" ON public.business_hours FOR ALL TO anon, authenticated USING (true);

-- 6. Schedule Exceptions
CREATE POLICY "Public exceptions select" ON public.schedule_exceptions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Manage exceptions" ON public.schedule_exceptions FOR ALL TO anon, authenticated USING (true);

-- 7. Bookings
CREATE POLICY "Public bookings select" ON public.bookings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public bookings insert" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Manage bookings" ON public.bookings FOR ALL TO anon, authenticated USING (true);

-- 8. Reviews
CREATE POLICY "Public reviews select" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public reviews insert" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Manage reviews" ON public.reviews FOR ALL TO anon, authenticated USING (true);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  CREATE TRIGGER trigger_update_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trigger_update_categories BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trigger_update_services BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trigger_update_business_hours BEFORE UPDATE ON public.business_hours FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trigger_update_exceptions BEFORE UPDATE ON public.schedule_exceptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trigger_update_bookings BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  CREATE TRIGGER trigger_update_reviews BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
