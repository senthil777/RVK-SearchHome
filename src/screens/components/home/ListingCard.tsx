// src/screens/components/home/ListingCard.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image,
} from 'react-native';
import { ListingModel } from '../../../models/HomeModel';
import { isValidImageUrl } from '../../../services/MyListService';

interface Props {
  item: ListingModel;
  onPress: (item: ListingModel) => void;
}

const formatPrice = (price: number): string => {
  if (price === 0) return 'Price on Request';
  return `₹ ${price.toLocaleString('en-IN')}`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

const ListingCard: React.FC<Props> = ({ item, onPress }) => {
  const hasImage = isValidImageUrl(item.imageUrl);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} at ${item.address}`}
      testID={`listing-card-${item.id}`}
    >
      {/* ── Image ── */}
      <View style={styles.imageBox}>
        {hasImage ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.imageFallbackIcon}>🏠</Text>
          </View>
        )}

        {/* Sale / Rent badge */}
        <View style={[
          styles.typeBadge,
          { backgroundColor: item.type === 'SALE' ? '#2E6B3E' : '#1A237E' },
        ]}>
          <Text style={styles.typeBadgeText}>
            {item.type === 'SALE' ? 'For Sale' : 'For Rent'}
          </Text>
        </View>

        {/* Featured badge */}
        {item.isFeatured ? (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        ) : null}
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.addressRow}>
          <Text style={styles.pin}>📍</Text>
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={[
            styles.price,
            item.price === 0 && styles.priceOnRequest,
          ]}>
            {formatPrice(item.price)}
          </Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default ListingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  imageBox:   { height: 170, width: '100%', position: 'relative' },
  image:      { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%', height: '100%',
    backgroundColor: '#E8F5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  imageFallbackIcon: { fontSize: 48 },

  typeBadge: {
    position: 'absolute', top: 12, left: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  featuredBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 6, borderWidth: 1, borderColor: '#FFD54F',
  },
  featuredText: { color: '#F57F17', fontSize: 11, fontWeight: '700' },

  body: { padding: 14 },

  title: {
    fontSize: 16, fontWeight: '700',
    color: '#111827', marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginBottom: 6,
  },
  pin:     { fontSize: 12 },
  address: { fontSize: 13, color: '#6B8C6B', flex: 1 },

  description: {
    fontSize: 13, color: '#9E9E9E',
    lineHeight: 20, marginBottom: 10,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 16, fontWeight: '800', color: '#1A237E',
  },
  priceOnRequest: {
    fontSize: 13, fontWeight: '600', color: '#6B8C6B',
  },
  date: { fontSize: 12, color: '#BDBDBD' },
});