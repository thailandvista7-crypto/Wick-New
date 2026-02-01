/**
 * Utility functions for working with product data
 * Handles conversion between JSON string (SQLite) and array formats
 */

export function parseProductImages(images: string | string[] | null | undefined): string[] {
  // Handle null/undefined
  if (!images) {
    return [];
  }

  // If already an array, return it
  if (Array.isArray(images)) {
    return images.filter((img) => img && typeof img === 'string' && img.length > 0);
  }

  // If it's a string, try to parse it
  if (typeof images === 'string') {
    // Empty string
    if (images.trim().length === 0) {
      return [];
    }

    // Try JSON parsing first
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((img) => img && typeof img === 'string' && img.length > 0);
      }
      if (typeof parsed === 'string' && parsed.length > 0) {
        return [parsed];
      }
    } catch {
      // JSON parsing failed, try other methods
    }

    // If it looks like a JSON array string but parsing failed, try to extract URLs
    if (images.trim().startsWith('[') && images.trim().endsWith(']')) {
      try {
        // Try to extract URLs from malformed JSON
        const urlMatches = images.match(/https?:\/\/[^\s"']+/g);
        if (urlMatches && urlMatches.length > 0) {
          return urlMatches;
        }
      } catch {
        // Extraction failed
      }
    }

    // Check if it's a data URL (base64 image)
    if (images.startsWith('data:image/')) {
      return [images];
    }

    // Check if it's a valid URL
    if (images.startsWith('http://') || images.startsWith('https://') || images.startsWith('/')) {
      return [images];
    }

    // Try comma-separated values
    if (images.includes(',')) {
      const urls = images.split(',').map((url) => url.trim()).filter(Boolean);
      return urls;
    }

    // Return as single item if it's a non-empty string
    if (images.length > 0) {
      return [images];
    }
  }

  return [];
}

export function getProductImage(product: { images?: string | string[] | null }, index: number = 0): string {
  const imageArray = parseProductImages(product.images);
  
  if (imageArray.length === 0) {
    return '/placeholder.jpg';
  }

  const image = imageArray[index] || imageArray[0];
  
  // Validate the image URL
  if (!image || typeof image !== 'string') {
    return '/placeholder.jpg';
  }

  // Check if it's a valid URL format
  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('/') ||
    image.startsWith('data:image/')
  ) {
    return image;
  }

  // If it's not a valid format, return placeholder
  return '/placeholder.jpg';
}
