/**
 * ImgBB & Local File Image Upload Service
 */

const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY || "895c029311dc00966f913d969245fc30";

export interface UploadResult {
  success: boolean;
  url?: string;
  thumbUrl?: string;
  error?: string;
  isLocal?: boolean;
}

/**
 * Reads a local file as Base64 Data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert image to data URL"));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to ImgBB with fallback to local Base64
 */
export async function uploadToImgBB(file: File): Promise<UploadResult> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      error: "Please select a valid image file (JPG, PNG, WEBP, GIF)",
    };
  }

  // Validate size (max 8MB)
  if (file.size > 8 * 1024 * 1024) {
    return {
      success: false,
      error: "Image size must be less than 8MB",
    };
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json().catch(() => null);

    if (res.ok && data?.success && data?.data?.url) {
      return {
        success: true,
        url: data.data.display_url || data.data.url,
        thumbUrl: data.data.thumb?.url || data.data.url,
        isLocal: false,
      };
    }

    // Fallback: If ImgBB request fails or key limit reached, return local Data URL
    const localBase64 = await readFileAsDataURL(file);
    return {
      success: true,
      url: localBase64,
      isLocal: true,
    };
  } catch (err: any) {
    // Graceful fallback to local Data URL
    try {
      const localBase64 = await readFileAsDataURL(file);
      return {
        success: true,
        url: localBase64,
        isLocal: true,
      };
    } catch {
      return {
        success: false,
        error: err?.message || "Failed to upload image",
      };
    }
  }
}
