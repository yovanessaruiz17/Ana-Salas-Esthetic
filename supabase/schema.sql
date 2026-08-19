-- ==============================================================================
-- SCHEMA SUPABASE: ANA MARÍA SALAS - BEAUTY STUDIO & BOOKINGS PWA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admins)
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
  address TEXT DEFAULT 'TODO_CONFIGURE - Dirección de atención',
  city TEXT DEFAULT 'TODO_CONFIGURE - Ciudad',
  state TEXT DEFAULT 'TODO_CONFIGURE - Departamento / Estado',
  country TEXT DEFAULT 'Colombia',
  google_maps_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT 'https://instagram.com/',
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_type TEXT NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'from', 'consultation')),
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  image_url TEXT,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  preparation_notes TEXT,
  aftercare_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BUSINESS HOURS (Weekly availability blocks)
CREATE TABLE IF NOT EXISTS public.business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday... 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_time_interval CHECK (start_time < end_time)
);

-- 6. SCHEDULE EXCEPTIONS (Holidays, vacations, blocked days, custom hours)
CREATE TABLE IF NOT EXISTS public.schedule_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('closed', 'blocked', 'special_hours')),
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_exception_times CHECK (
    (type = 'closed') OR 
    (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
  )
);

-- 7. BOOKINGS (Appointments)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  whatsapp_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_booking_time CHECK (start_time < end_time)
);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  appointment_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  image_url TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active, display_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.service_categories(active, display_order);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status, featured);
CREATE INDEX IF NOT EXISTS idx_business_hours_day ON public.business_hours(day_of_week, active);
CREATE INDEX IF NOT EXISTS idx_exceptions_date ON public.schedule_exceptions(date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR (auth.jwt() ->> 'role' = 'service_role')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Admins can view and manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin() OR auth.uid() = id);

-- 2. Site Settings Policies
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 3. Service Categories Policies
CREATE POLICY "Public can view active categories"
  ON public.service_categories FOR SELECT
  TO anon, authenticated
  USING (active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage categories"
  ON public.service_categories FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 4. Services Policies
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 5. Business Hours Policies
CREATE POLICY "Public can view business hours"
  ON public.business_hours FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage business hours"
  ON public.business_hours FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 6. Schedule Exceptions Policies
CREATE POLICY "Public can view schedule exceptions"
  ON public.schedule_exceptions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage schedule exceptions"
  ON public.schedule_exceptions FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 7. Bookings Policies
CREATE POLICY "Public can create a booking"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    customer_name IS NOT NULL AND
    customer_phone IS NOT NULL AND
    appointment_date >= CURRENT_DATE AND
    status = 'pending'
  );

CREATE POLICY "Public can view their own booking confirmation"
  ON public.bookings FOR SELECT
  TO anon, authenticated
  USING (true); -- Public view for confirmation page by ID

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 8. Reviews Policies
CREATE POLICY "Public can view approved reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR public.is_admin());

CREATE POLICY "Public can submit pending reviews"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending' AND
    rating BETWEEN 1 AND 5 AND
    customer_name IS NOT NULL AND
    comment IS NOT NULL
  );

CREATE POLICY "Admins can manage all reviews"
  ON public.reviews FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 9. FAQs Policies
CREATE POLICY "Public can view active faqs"
  ON public.faqs FOR SELECT
  TO anon, authenticated
  USING (active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage faqs"
  ON public.faqs FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 10. Gallery Policies
CREATE POLICY "Public can view gallery"
  ON public.gallery FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage gallery"
  ON public.gallery FOR ALL
  TO authenticated
  USING (public.is_admin());

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
  CREATE TRIGGER trigger_update_faqs BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
