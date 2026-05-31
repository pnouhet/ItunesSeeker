import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ArtistCard({ artist, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {artist.deezerImage ? (
        <Image source={{ uri: artist.deezerImage }} style={styles.image} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>
            {artist.artistName ? artist.artistName[0].toUpperCase() : '?'}
          </Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.artistName} numberOfLines={1}>{artist.artistName}</Text>
        <Text style={styles.genre} numberOfLines={1}>{artist.primaryGenreName}</Text>
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#253444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  info: {
    flex: 1,
  },
  artistName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  genre: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
});
