const BASE_URL = 'https://itunes.apple.com/search';

export async function searchTracks(term) {
  const url = `${BASE_URL}?term=${encodeURIComponent(term)}&entity=song&limit=100`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results ?? [];
}

export async function searchArtists(term) {
  const url = `${BASE_URL}?term=${encodeURIComponent(term)}&entity=musicArtist&limit=100`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results ?? [];
}

export async function lookupArtist(artistId) {
  const url = `https://itunes.apple.com/lookup?id=${artistId}&entity=musicArtist`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results[0] ?? null;
}
