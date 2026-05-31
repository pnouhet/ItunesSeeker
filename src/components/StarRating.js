import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

export default function StarRating({ rating = 0, onRate }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate && onRate(star)}
          disabled={!onRate}
          style={styles.starWrapper}
        >
          <Star
            size={28}
            color={star <= rating ? '#e67839' : '#ccc'}
            fill={star <= rating ? '#f5a623' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  starWrapper: {
    marginHorizontal: 2,
  },
});
