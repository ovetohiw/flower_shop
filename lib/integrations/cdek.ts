export type PickupPoint = {
  code: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  city: string;
};

const SEED_POINTS: PickupPoint[] = [
  {
    code: "MSK1",
    name: "СДЭК — Тверская",
    address: "Москва, ул. Тверская, 12",
    lat: 55.7577,
    lng: 37.6135,
    city: "Москва",
  },
  {
    code: "MSK2",
    name: "СДЭК — Арбат",
    address: "Москва, ул. Арбат, 25",
    lat: 55.7494,
    lng: 37.5915,
    city: "Москва",
  },
  {
    code: "MSK3",
    name: "СДЭК — Павелецкая",
    address: "Москва, ул. Зацепский Вал, 5",
    lat: 55.7297,
    lng: 37.6388,
    city: "Москва",
  },
  {
    code: "SPB1",
    name: "СДЭК — Невский",
    address: "Санкт-Петербург, Невский пр., 28",
    lat: 59.9352,
    lng: 30.3265,
    city: "Санкт-Петербург",
  },
  {
    code: "SPB2",
    name: "СДЭК — Васильевский",
    address: "Санкт-Петербург, Средний пр. В.О., 36",
    lat: 59.9425,
    lng: 30.2789,
    city: "Санкт-Петербург",
  },
];

type CdekTokenResponse = {
  access_token: string;
};

type CdekOffice = {
  code: string;
  name: string;
  location?: {
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
};

async function fetchCdekToken(): Promise<string | null> {
  const clientId = process.env.CDEK_CLIENT_ID;
  const clientSecret = process.env.CDEK_CLIENT_SECRET;
  const apiUrl = process.env.CDEK_API_URL || "https://api.edu.cdek.ru/v2";
  if (!clientId || !clientSecret) return null;

  const res = await fetch(`${apiUrl}/oauth/token?parameters`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as CdekTokenResponse;
  return data.access_token;
}

export async function listPickupPoints(city = "Москва"): Promise<PickupPoint[]> {
  const apiUrl = process.env.CDEK_API_URL || "https://api.edu.cdek.ru/v2";
  const token = await fetchCdekToken();

  if (!token) {
    const filtered = SEED_POINTS.filter((p) =>
      p.city.toLowerCase().includes(city.toLowerCase()),
    );
    return filtered.length > 0 ? filtered : SEED_POINTS;
  }

  try {
    const url = new URL(`${apiUrl}/deliverypoints`);
    url.searchParams.set("city", city);
    url.searchParams.set("type", "PVZ");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return SEED_POINTS;

    const data = (await res.json()) as CdekOffice[];
    const mapped = data
      .filter((o) => o.location?.latitude && o.location?.longitude)
      .slice(0, 40)
      .map((o) => ({
        code: o.code,
        name: o.name || `СДЭК ${o.code}`,
        address: o.location?.address || "",
        lat: o.location!.latitude!,
        lng: o.location!.longitude!,
        city: o.location?.city || city,
      }));

    return mapped.length > 0 ? mapped : SEED_POINTS;
  } catch {
    return SEED_POINTS;
  }
}

export function getSeedPickupPoints() {
  return SEED_POINTS;
}
