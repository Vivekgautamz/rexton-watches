export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
    format?: 'auto' | 'webp' | 'avif' | 'jpg';
  }
): string {
  if (!url) return '/images/watch-placeholder.jpg';

  // If it's a Cloudinary URL, insert transformation parameters
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transforms: string[] = ['f_auto', 'q_auto'];
      if (options?.width) transforms.push(`w_${options.width}`);
      if (options?.height) transforms.push(`h_${options.height}`);
      if (options?.crop) transforms.push(`c_${options.crop}`);
      if (options?.quality && typeof options.quality === 'number') transforms.push(`q_${options.quality}`);

      return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }
  }

  // If it's an Unsplash image, use Unsplash query parameters
  if (url.includes('images.unsplash.com')) {
    const parsed = new URL(url);
    if (options?.width) parsed.searchParams.set('w', options.width.toString());
    if (options?.height) parsed.searchParams.set('h', options.height.toString());
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', options?.crop === 'fill' ? 'crop' : 'max');
    parsed.searchParams.set('q', '80');
    return parsed.toString();
  }

  return url;
}

export const WATCH_IMAGE_SIZES = {
  thumbnail: { width: 120, height: 120, crop: 'fill' as const },
  card: { width: 600, height: 600, crop: 'fill' as const },
  hero: { width: 1200, height: 1200, crop: 'fit' as const },
  galleryZoom: { width: 1800, height: 1800, crop: 'fit' as const },
};
