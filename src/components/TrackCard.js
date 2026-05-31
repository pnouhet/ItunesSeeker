import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function TrackCard({ track, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {track.artworkUrl100 ? (
        <Image source={{ uri: track.artworkUrl100 }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.placeholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.trackName} numberOfLines={1}>{track.trackName}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artistName}</Text>
        <Text style={styles.albumName} numberOfLines={1}>{track.collectionName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  placeholder: {
    backgroundColor: '#ddd',
  },
  info: {
    flex: 1,
  },
  trackName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  artistName: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  albumName: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
