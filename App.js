import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Search, Heart, Play, Square } from 'lucide-react-native';
import { Audio } from 'expo-av';

import SearchScreen from './src/screens/SearchScreen';
import DetailScreen from './src/screens/DetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import { loadFavorites, saveFavorites, loadRatings, saveRatings } from './src/services/storage';

const Tab = createBottomTabNavigator();
const SearchStack = createStackNavigator();
const FavoritesStack = createStackNavigator();

const PlayerTabPlaceholder = () => null;

function SearchStackNavigator({ favorites, ratings, onToggleFavorite, onRate, onPlayPreview, currentTrackUrl, isPlaying }) {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" options={{ title: 'iTunes Seeker' }}>
        {(props) => (
          <SearchScreen {...props} favorites={favorites} onToggleFavorite={onToggleFavorite} />
        )}
      </SearchStack.Screen>
      <SearchStack.Screen name="Detail" options={{ title: 'Détails' }}>
        {(props) => (
          <DetailScreen
            {...props}
            favorites={favorites}
            ratings={ratings}
            onToggleFavorite={onToggleFavorite}
            onRate={onRate}
            onPlayPreview={onPlayPreview}
            currentTrackUrl={currentTrackUrl}
            isPlaying={isPlaying}
          />
        )}
      </SearchStack.Screen>
    </SearchStack.Navigator>
  );
}

function FavoritesStackNavigator({ favorites, ratings, onToggleFavorite, onRate, onPlayPreview, currentTrackUrl, isPlaying }) {
  return (
    <FavoritesStack.Navigator>
      <FavoritesStack.Screen name="Favorites" options={{ title: 'Mes Favoris' }}>
        {(props) => (
          <FavoritesScreen
            {...props}
            favorites={favorites}
            ratings={ratings}
            onToggleFavorite={onToggleFavorite}
          />
        )}
      </FavoritesStack.Screen>
      <FavoritesStack.Screen name="Detail" options={{ title: 'Détails' }}>
        {(props) => (
          <DetailScreen
            {...props}
            favorites={favorites}
            ratings={ratings}
            onToggleFavorite={onToggleFavorite}
            onRate={onRate}
            onPlayPreview={onPlayPreview}
            currentTrackUrl={currentTrackUrl}
            isPlaying={isPlaying}
          />
        )}
      </FavoritesStack.Screen>
    </FavoritesStack.Navigator>
  );
}

export default function App() {
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState(null);
  const soundRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [f, r] = await Promise.all([loadFavorites(), loadRatings()]);
      setFavorites(f);
      setRatings(r);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    })();
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  useEffect(() => { saveFavorites(favorites); }, [favorites]);
  useEffect(() => { saveRatings(ratings); }, [ratings]);

  async function handlePlayPreview(url) {
    if (!url) return;
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      if (currentTrackUrl === url) {
        setCurrentTrackUrl(null);
        setIsPlaying(false);
        return;
      }
    }
    setCurrentTrackUrl(url);
    setIsPlaying(true);
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    soundRef.current = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        soundRef.current = null;
        setCurrentTrackUrl(null);
        setIsPlaying(false);
      }
    });
  }

  async function handleStopAudio() {
    if (!soundRef.current) return;
    await soundRef.current.unloadAsync();
    soundRef.current = null;
    setCurrentTrackUrl(null);
    setIsPlaying(false);
  }

  function getItemId(item) {
    return item.trackId ?? item.artistId;
  }

  function handleToggleFavorite(item) {
    const id = getItemId(item);
    setFavorites((prev) => {
      const exists = prev.some((f) => getItemId(f) === id);
      return exists ? prev.filter((f) => getItemId(f) !== id) : [...prev, item];
    });
  }

  function handleRate(item, star) {
    const id = getItemId(item);
    setRatings((prev) => ({ ...prev, [id]: star }));
  }

  const audioProps = { onPlayPreview: handlePlayPreview, currentTrackUrl, isPlaying };

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#253444' }}>
        <Tab.Screen
          name="SearchTab"
          options={{
            tabBarLabel: 'Rechercher',
            tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          }}
        >
          {() => (
            <SearchStackNavigator
              favorites={favorites}
              ratings={ratings}
              onToggleFavorite={handleToggleFavorite}
              onRate={handleRate}
              {...audioProps}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="PlayerTab"
          component={PlayerTabPlaceholder}
          options={{
            tabBarLabel: '',
            tabBarButton: () => (
              <TouchableOpacity
                style={styles.playerTabBtn}
                onPress={isPlaying ? handleStopAudio : undefined}
                activeOpacity={isPlaying ? 0.7 : 1}
              >
                <View style={[styles.playerBtnCircle, !isPlaying && styles.playerBtnInactive]}>
                  {isPlaying
                    ? <Square size={32} color="#fff" />
                    : <Play size={32} color="#bbb" />}
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="FavoritesTab"
          options={{
            tabBarLabel: 'Favoris',
            tabBarActiveTintColor: '#c20c45',
            tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          }}
        >
          {() => (
            <FavoritesStackNavigator
              favorites={favorites}
              ratings={ratings}
              onToggleFavorite={handleToggleFavorite}
              onRate={handleRate}
              {...audioProps}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  playerTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  playerBtnCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#253444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  playerBtnInactive: {
    backgroundColor: '#ddd',
    shadowOpacity: 0.25,
    elevation: 2,
  },
});
