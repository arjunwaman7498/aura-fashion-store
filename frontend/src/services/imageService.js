const BACKEND_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  // Existing external image URLs
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Newly uploaded backend images
  return `${BACKEND_URL}${image}`;
};