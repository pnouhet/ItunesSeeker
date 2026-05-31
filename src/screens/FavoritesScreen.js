import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import StarRating from '../components/StarRating';

export default function FavoritesScreen({ navigation, favorites, ratings, onToggleFavorite }) {
  function getItemId(item) {
    return item.trackId ?? item.artistId;
  }

  function renderItem({ item }) {
    const id = getItemId(item);
    const isTrack = !!item.trackId;
    const rating = ratings[id] ?? 0;
    const onPress = () => navigation.navigate('Detail', { item });

    return (
      <View style={styles.itemWrapper}>
        <View style={styles.cardContainer}>
          {isTrack
            ? <TrackCard track={item} onPress={onPress} />
            : <ArtistCard artist={item} onPress={onPress} />}
        </View>
        <View style={styles.meta}>
          <StarRating rating={rating} />
          <TouchableOpacity
            onPress={() => {
              const itemName = isTrack ? item.trackName : item.artistName;
              Alert.alert(
                'Retirer des Favoris',
                `Êtes vous sûr de vouloir retirer "${itemName}" ?`,
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Retirer', style: 'destructive', onPress: () => onToggleFavorite(item) },
                ],
              );
            }}
            style={styles.removeBtn}
          >
            <Text style={styles.removeText}>Retirer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Vous n'avez pas encore de Favoris.</Text>
        <Text style={styles.emptySubText}>Rechercher le titre d'un son ou un artiste puis ajouter le pour le retrouver ici.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={favorites}
      keyExtractor={(item) => String(getItemId(item))}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: '#fff' },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardContainer: { flex: 1 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  removeBtn: { padding: 8 },
  removeText: { 
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#c20c45',
    padding: 8,
    borderRadius: 4,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontStyle: 'italic', 
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
