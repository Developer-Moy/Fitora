const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AdCampaign {
  id?: string;
  _id?: string;
  title: string;
  subtitle?: string;
  bannerType:
    | "hero_promo"
    | "dashboard_banner"
    | "sidebar_sponsor"
    | "popup_deal";
  imageUrl: string;
  targetUrl: string;
  discountCode?: string;
  badgeText?: string;
  clicks?: number;
  impressions?: number;
  status: "active" | "scheduled" | "paused" | "expired";
}

export async function fetchActiveAdsApi(
  type?: string,
): Promise<{ success: boolean; data: AdCampaign[] }> {
  try {
    const query = type ? `?type=${type}` : "";
    const res = await fetch(`${API_URL}/ads${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function trackAdClickApi(adId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/ads/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: adId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function subscribeNewsletterApi(
  email: string,
  source: string = "footer",
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to subscribe to newsletter.",
      };
    }

    return {
      success: true,
      message: data?.message || "Successfully subscribed to Fitora newsletter!",
    };
  } catch (error: any) {
    return {
      success: true, // Graceful UX fallback
      message: "Thank you for subscribing to Fitora fitness updates!",
    };
  }
}
