import { API_BASE_URL } from "../api/constants";

const getApiOrigin = () => {
  try {
    return new URL(BE_IMG_URL).origin;
  } catch {
    return "";
  }
};

export const getInitial = (user) =>
  (user?.name || user?.email || "U").charAt(0).toUpperCase();

export const getProfileImageUrl = (user) => {
  const image = user?.profileImg || "";
  if (!image) return "";

  if (
    /^https?:\/\//i.test(image) ||
    image.startsWith("blob:") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const apiOrigin = getApiOrigin();
  const normalizedImage = image.replace(/\\/g, "/");

  if (normalizedImage.startsWith("/uploads/")) {
    return `${apiOrigin}${normalizedImage}`;
  }

  return `${apiOrigin}/uploads/profiles/${normalizedImage.replace(/^\/+/, "")}`;
};
