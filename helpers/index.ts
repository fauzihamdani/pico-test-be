export const mapsPlaceUrl = (placeId: string) =>
  `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(
    placeId
  )}`;

export const mapsDirectionsUrl = (
  dest: string,
  origin?: { lat: number; lng: number }
) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    dest
  )}${origin ? `&origin=${origin.lat},${origin.lng}` : ""}`;

export async function placesNearbySearch(params: {
  lat: number;
  lng: number;
  keyword: string; // e.g. "gas station"
  radius?: number; // meters (max ~50,000). 2000 is a good default for city use.
  openNow?: boolean;
}) {
  const API_KEY = process.env.GMAP_KEY;
  const { lat, lng, keyword, radius = 2000, openNow = true } = params;

  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=${radius}` +
    `&keyword=${encodeURIComponent(keyword)}` +
    (openNow ? `&opennow=true` : ``) +
    `&key=${API_KEY!}`;

  const resp = await fetch(url);
  const data = await resp.json();

  // Normalize a few key fields
  const results = (data.results ?? []).map((p: any) => ({
    name: p.name,
    address: p.vicinity ?? p.formatted_address,
    rating: p.rating,
    user_ratings_total: p.user_ratings_total,
    place_id: p.place_id,
    location: p.geometry?.location,
    maps_url: mapsPlaceUrl(p.place_id),
  }));

  return { results, status: data.status, raw: data };
}
