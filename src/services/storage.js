import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  favorites: '@favorites',
  ratings: '@ratings',
};

export async function loadFavorites() {
  const json = await AsyncStorage.getItem(KEYS.favorites);
  return json ? JSON.parse(json) : [];
}

export async function saveFavorites(favorites) {
  await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(favorites));
}

export async function loadRatings() {
  const json = await AsyncStorage.getItem(KEYS.ratings);
  return json ? JSON.parse(json) : {};
}

export async function saveRatings(ratings) {
  await AsyncStorage.setItem(KEYS.ratings, JSON.stringify(ratings));
}
