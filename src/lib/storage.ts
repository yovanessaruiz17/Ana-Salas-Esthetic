import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadImage(
  file: File,
  bucket: 'services' | 'branding' | 'gallery',
  folder = 'uploads'
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return {
      url: null,
      error: 'Supabase no está configurado. Por favor ingresa tus credenciales en el archivo .env.',
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Error al subir la imagen' };
  }
}
