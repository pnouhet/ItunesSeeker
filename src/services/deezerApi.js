const BASE_URL = 'https://api.deezer.com';

export async function fetchArtistImage(artistName) {
  const url = `${BASE_URL}/search/artist?q=${encodeURIComponent(artistName)}&limit=1`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data?.[0]?.picture_medium ?? null;
}
