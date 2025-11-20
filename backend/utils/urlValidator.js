// URL validation patterns for social media platforms
export const platformUrlPatterns = {
  youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/i,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.+/i,
  twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/i,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i,
};

// Validate URL for a specific platform
export const validatePlatformUrl = (url, platform) => {
  const pattern = platformUrlPatterns[platform];
  if (!pattern) {
    return { valid: false, message: 'Invalid platform' };
  }
  
  if (!pattern.test(url)) {
    return { 
      valid: false, 
      message: `Invalid ${platform} URL. Please enter a valid profile URL.` 
    };
  }
  
  return { valid: true };
};

