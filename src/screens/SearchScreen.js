import React, { useState, useRef } from 'react';
import {
  View, TextInput, TouchableOpacity, Text,
  FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { searchTracks, searchArtists } from '../services/itunesApi';
import { fetchArtistImage } from '../services/deezerApi';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import { Search } from 'lucide-react-native';

const PAGE_SIZE = 20;

async function fetchAll(term, type) {
  if (type === 'tracks') {
    return searchTracks(term);
  }
  const artists = await searchArtists(term);
  return Promise.all(
    artists.map(async (artist) => ({
      ...artist,
      deezerImage: await fetchArtistImage(artist.artistName),
    }))
  );
}

export default function SearchScreen({ navigation, favorites, onToggleFavorite }) {
  const [query, setQuery] = useState('');
  const [entity, setEntity] = useState('tracks');
  const [allResults, setAllResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const searchGenRef = useRef(0);

  const displayedResults = allResults.slice(0, visibleCount);
  const hasMore = visibleCount < allResults.length;

  async function handleSearch(searchEntity = entity) {
    const term = query.trim();
    if (!term) return;
    searchGenRef.current += 1;
    const gen = searchGenRef.current;
    setLoading(true);
    setAllResults([]);
    setVisibleCount(PAGE_SIZE);
    try {
      const items = await fetchAll(term, searchEntity);
      if (searchGenRef.current === gen) {
        setAllResults(items);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLoadMore() {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allResults.length));
  }

  function handleToggle(type) {
    searchGenRef.current += 1;
    setEntity(type);
    setAllResults([]);
    setVisibleCount(PAGE_SIZE);
    if (query.trim()) handleSearch(type);
  }

  function getItemId(item) {
    return item.trackId ?? item.artistId;
  }

  function renderItem({ item }) {
    const onPress = () => navigation.navigate('Detail', { item });
    if (entity === 'tracks') return <TrackCard track={item} onPress={onPress} />;
    return <ArtistCard artist={item} onPress={onPress} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher un Artiste ou un Son..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch()}>
          <Search size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, entity === 'tracks' && styles.toggleActive]}
          onPress={() => handleToggle('tracks')}
        >
          <Text style={[styles.toggleText, entity === 'tracks' && styles.toggleTextActive]}>
            Sons
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, entity === 'artists' && styles.toggleActive]}
          onPress={() => handleToggle('artists')}
        >
          <Text style={[styles.toggleText, entity === 'artists' && styles.toggleTextActive]}>
            Artistes
          </Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loader} />}

      <FlatList
        style={styles.list}
        data={displayedResults}
        keyExtractor={(item) => String(getItemId(item))}
        renderItem={renderItem}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore}>
              <Text style={styles.loadMoreText}>Charger plus</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  searchBtn: {
    backgroundColor: '#253444',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#253444',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  toggleActive: { backgroundColor: '#253444' },
  toggleText: { color: '#222', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', fontStyle: 'italic' },
  toggleTextActive: { color: '#fff' },
  list: { flex: 1 },
  loader: { marginVertical: 16 },
  loadMoreBtn: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253444',
    alignItems: 'center',
  },
  loadMoreText: { color: '#253444', fontWeight: '700', fontSize: 16 },
});
