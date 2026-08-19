-- ==============================================================================
-- SEED DATA (DEMO ONLY) FOR ANA MARÍA SALAS STUDIO
-- ==============================================================================

-- 1. Default Site Settings
INSERT INTO public.site_settings (
  id,
  business_name,
  professional_name,
  tagline,
  description,
  phone,
  whatsapp,
  email,
  address,
  city,
  state,
  country,
  google_maps_url,
  instagram_url,
  timezone,
  about_history,
  about_experience,
  meta_title,
  meta_description
) VALUES (
  'default',
  'Ana María Salas | Studio & Belleza',
  'Ana María Salas',
  'Cejista & Maquillista Profesional',
  'Estudio exclusivo dedicado al diseño, visagismo y micropigmentación de cejas, lifting de pestañas y maquillaje profesional para ocasiones memorables.',
  '+57 310 000 0000',
  '573100000000',
  'contacto@anamariasalas.com',
  'TODO_CONFIGURE - Calle 123 #45-67, Edificio Boutique',
  'TODO_CONFIGURE - Ciudad Principal',
  'TODO_CONFIGURE - Departamento',
  'Colombia',
  'https://maps.google.com',
  'https://instagram.com/anamariasalas_studio',
  'America/Bogota',
  'Con una profunda pasión por la armonía facial y el cuidado de cada detalle, me especializo en resaltar la mirada y la belleza única de cada mujer con técnicas refinadas.',
  'Formada con certificaciones internacionales en visagismo de cejas, micropigmentación avanzada y técnicas de maquillaje de larga duración para novias y editoriales.',
  'Ana María Salas | Cejas & Maquillaje Profesional',
  'Reserva tu cita de cejas, pestañas y maquillaje con Ana María Salas. Atención personalizada de alta gama.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Service Categories (DEMO)
INSERT INTO public.service_categories (id, name, slug, description, display_order) VALUES
('c0000001-0000-0000-0000-000000000001', 'Diseño de Cejas', 'diseno-de-cejas', 'Técnicas avanzadas para dar forma, definir y resaltar tu mirada.', 1),
('c0000002-0000-0000-0000-000000000002', 'Pestañas', 'pestanas', 'Lifting y realce de pestañas naturales con máxima suavidad.', 2),
('c0000003-0000-0000-0000-000000000003', 'Maquillaje Profesional', 'maquillaje-profesional', 'Maquillaje social, novias y eventos especiales de alta duración.', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Services (DEMO)
INSERT INTO public.services (
  id, name, slug, short_description, description, price, price_type, duration_minutes, category_id, active, featured, display_order, preparation_notes, aftercare_notes
) VALUES
(
  's0000001-0000-0000-0000-000000000001',
  'Diseño & Depilación con Hilo',
  'diseno-depilacion-hilo',
  'Mapeo facial con visagismo y depilación precisa con hilo antibacteriano.',
  'Servicio personalizado de diseño de cejas que estudia las proporciones de tu rostro mediante visagismo. Incluye depilación suave con hilo hindú y perfilado impecable.',
  45000,
  'fixed',
  45,
  'c0000001-0000-0000-0000-000000000001',
  TRUE,
  TRUE,
  1,
  'Ven con el rostro limpio y sin maquillaje en la zona de cejas.',
  'Evitar exposición solar directa y no frotar la zona durante las primeras 12 horas.'
),
(
  's0000002-0000-0000-0000-000000000002',
  'Laminado de Cejas & Tinte de Henna',
  'laminado-cejas-henna',
  'Fijación, alineación y nutrición de vellos rebeldes con tinte orgánico de efecto sombreado.',
  'Tratamiento de nutrición y peinado semipermanente para lograr cejas pobladas, definidas y con efecto lifting. Incluye pigmento orgánico de alta duración.',
  85000,
  'fixed',
  60,
  'c0000001-0000-0000-0000-000000000001',
  TRUE,
  TRUE,
  2,
  'Suspender uso de ácidos exfoliantes o retinol 3 días antes del tratamiento.',
  'No mojar las cejas durante las primeras 24 horas. Aplicar sérum hidratante.'
),
(
  's0000003-0000-0000-0000-000000000003',
  'Lifting de Pestañas + Keratina',
  'lifting-pestanas-keratina',
  'Curvatura natural y baño de color negro intenso para alargar tus pestañas.',
  'Realce natural de tus pestañas desde la raíz con tratamiento intensivo de keratina y botox de nutrición. Brinda una mirada abierta, fresca y sin necesidad de rímel.',
  75000,
  'fixed',
  60,
  'c0000002-0000-0000-0000-000000000002',
  TRUE,
  TRUE,
  3,
  'Asistir sin rímel ni lentes de contacto puestos.',
  'No mojar los ojos ni aplicar vapor en 24 horas.'
),
(
  's0000004-0000-0000-0000-000000000004',
  'Maquillaje Social de Alta Gama',
  'maquillaje-social',
  'Técnicas blindadas, preparación de piel premium y pestañas postizas incluidas.',
  'Maquillaje profesional adaptado a tu estilo y al tipo de evento. Utilizamos productos de alta gama con técnica de piel blindada a prueba de agua y sudor.',
  160000,
  'from',
  90,
  'c0000003-0000-0000-0000-000000000003',
  TRUE,
  TRUE,
  4,
  'Rostro hidratado y limpio. Si tienes alguna referencia de estilo, tráela contigo.',
  'Retirar con limpiador bifásico y crema desmaquillante suave.'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Business Hours (DEMO: Mon - Sat)
INSERT INTO public.business_hours (day_of_week, start_time, end_time, active) VALUES
(1, '09:00:00', '13:00:00', TRUE),
(1, '14:00:00', '19:00:00', TRUE),
(2, '09:00:00', '13:00:00', TRUE),
(2, '14:00:00', '19:00:00', TRUE),
(3, '09:00:00', '13:00:00', TRUE),
(3, '14:00:00', '19:00:00', TRUE),
(4, '09:00:00', '13:00:00', TRUE),
(4, '14:00:00', '19:00:00', TRUE),
(5, '09:00:00', '13:00:00', TRUE),
(5, '14:00:00', '19:00:00', TRUE),
(6, '09:00:00', '18:00:00', TRUE)
ON CONFLICT DO NOTHING;

-- 5. FAQs (DEMO)
INSERT INTO public.faqs (question, answer, display_order) VALUES
('¿Con cuánta anticipación debo reservar mi cita?', 'Recomendamos reservar con 3 a 5 días de anticipación para asegurar tu horario preferido, y al menos 2 semanas para eventos de maquillaje o novias.', 1),
('¿Cómo confirmo mi reserva?', 'Al finalizar tu reserva en la web recibirás un resumen con un botón directo a WhatsApp. Al enviarnos el mensaje generado, confirmaremos formalmente tu espacio.', 2),
('¿Qué cuidados debo tener antes de mi cita de cejas?', 'Te recomendamos no depilarte las cejas durante al menos 2 semanas antes para poder realizar el visagismo completo y lograr la máxima armonía.', 3),
('¿Los productos que utilizan son hipoalergénicos?', 'Sí, todos nuestros insumos son de grado profesional, dermatológicamente probados y de marcas de alta gama.', 4)
ON CONFLICT DO NOTHING;

-- 6. Approved Reviews (DEMO)
INSERT INTO public.reviews (customer_name, rating, comment, status, featured, appointment_date) VALUES
('Valentina Morales', 5, '¡El mejor diseño de cejas que me han hecho! La atención de Ana es impecable, súper detallista y el resultado superó todas mis expectativas.', 'approved', TRUE, CURRENT_DATE - INTERVAL '12 days'),
('Camila Rengifo', 5, 'El maquillaje para el matrimonio de mi hermana duró toda la noche intacto. La piel quedó luminosa y nada pesada. ¡100% recomendada!', 'approved', TRUE, CURRENT_DATE - INTERVAL '20 days'),
('Sofía Mendoza', 5, 'Amé mi lifting de pestañas. Súper natural pero con un cambio increíble en la mirada. El estudio es hermoso y muy acogedor.', 'approved', TRUE, CURRENT_DATE - INTERVAL '35 days')
ON CONFLICT DO NOTHING;
