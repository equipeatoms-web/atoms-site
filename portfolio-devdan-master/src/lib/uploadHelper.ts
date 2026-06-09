import { supabase } from '@/integrations/supabase/client';

export const uploadSiteAsset = async (
  file: File,
  type: 'logo' | 'favicon'
): Promise<string> => {
  // Gerar nome único
  const fileExt = file.name.split('.').pop();
  const fileName = `${type}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  // Upload
  const { error } = await supabase.storage
    .from('site-assets')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    });

  if (error) throw error;

  // Retornar URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('site-assets')
    .getPublicUrl(filePath);

  return publicUrl;
};
