import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import StarRating from '../components/StarRating';
import { lookupArtist } from '../services/itunesApi';
import { fetchArtistImage } from '../services/deezerApi';

export default function DetailScreen({
  route, navigation,
  favorites, ratings, onToggleFavorite, onRate,
  onPlayPreview, currentTrackUrl, isPlaying,
}) {
  const { item } = route.params;
  const isTrack = !!item.trackId;
  const itemId = item.trackId ?? item.artistId;

  const isFavorite = favorites.some((f) => (f.trackId ?? f.artistId) === itemId);
  const currentRating = ratings[itemId] ?? 0;
  const isThisTrackPlaying = isPlaying && currentTrackUrl === item.previewUrl;

  const [artistLoading, setArtistLoading] = useState(false);

  async function handleArtistPress() {
    if (!item.artistId) return;
    setArtistLoading(true);
    try {
      const artist = await lookupArtist(item.artistId);
      if (artist) {
        const deezerImage = await fetchArtistImage(artist.artistName);
        navigation.push('Detail', { item: { ...artist, deezerImage } });
      }
    } finally {
      setArtistLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isTrack && item.artworkUrl100 && (
        <Image
          source={{ uri: item.artworkUrl100.replace('100x100', '300x300') }}
          style={styles.artwork}
        />
      )}

      {!isTrack && item.deezerImage && (
        <Image source={{ uri: item.deezerImage }} style={styles.artistImage} />
      )}

      <Text style={styles.title}>
        {isTrack ? item.trackName : item.artistName}
      </Text>

      {isTrack && (
        <>
          <TouchableOpacity onPress={handleArtistPress} style={styles.artistRow} disabled={artistLoading}>
            {artistLoading
              ? <ActivityIndicator size="small" />
              : <Text style={styles.artistLink}>{item.artistName}</Text>}
          </TouchableOpacity>
          <Text style={styles.subtitle}>{item.collectionName}</Text>
        </>
      )}

      {!isTrack && (
        <Text style={styles.subtitle}>{item.primaryGenreName}</Text>
      )}

      {isTrack && item.previewUrl && (
        <TouchableOpacity style={styles.previewBtn} onPress={() => onPlayPreview(item.previewUrl)}>
          <Text style={styles.previewBtnText}>
            {isThisTrackPlaying ? 'Stop' : 'Écouter'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Votre note</Text>
        <StarRating
          rating={currentRating}
          onRate={(star) => onRate(item, star)}
        />
      </View>

      <TouchableOpacity
        style={[styles.favBtn, isFavorite && styles.favBtnActive]}
        onPress={() => onToggleFavorite(item)}
      >
        <Text style={[styles.favBtnText, isFavorite && styles.favBtnTextActive]}>
          {isFavorite ? 'Retirer des Favoris' : 'Ajouter aux Favoris'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center' },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  artistImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  artistRow: {
    marginBottom: 4,
    minHeight: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistLink: {
    fontSize: 15,
    color: '#253444',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  previewBtn: {
    marginTop: 16,
    backgroundColor: '#253444',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  previewBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', fontStyle: 'italic' },
  section: { marginTop: 24, alignItems: 'center' },
  sectionLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  favBtn: {
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#c20c45',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  favBtnActive: { backgroundColor: '#c20c45' },
  favBtnText: { color: '#c20c45', fontSize: 16, fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' },
  favBtnTextActive: { color: '#fff' },
});
