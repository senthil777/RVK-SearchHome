// src/screens/components/home/PropertyCard.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image,
} from 'react-native';
import { PropertyModel, PropertyBadge } from '../../../models/HomeModel';

interface Props {
  property: PropertyModel;
  onPress: (property: PropertyModel) => void;
}

const BADGE_COLORS: Record<PropertyBadge, { bg: string; text: string }> = {
  'For Sale': { bg: '#E8F5E9', text: '#2E6B3E' },
  'For Rent': { bg: '#E3F2FD', text: '#1565C0' },
  'Sold':     { bg: '#FFEBEE', text: '#B71C1C' },
};

const formatPrice = (price: number): string =>
  `₹ ${price.toLocaleString('en-IN')}`;

const PropertyCard: React.FC<Props> = ({ property, onPress }) => {
  const badge = BADGE_COLORS[property.badge];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(property)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${property.title}, ${property.address}, ${formatPrice(property.price)}, ${property.badge}`}
      testID={`property-card-${property.id}`}
    >
      {/* ── Image area ── */}
      <View style={styles.imageBox}>
        {property.imageUrl ? (
          <Image
            source={{ uri: property.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.imageEmoji}>{property.emoji ?? '🏠'}</Text>
          </View>
        )}

        {/* Premium badge top-left */}
        {property.isPremium ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        ) : null}
      </View>

      {/* ── Card body ── */}
      <View style={styles.body}>

        {/* Title + For Sale badge */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {property.badge}
            </Text>
          </View>
        </View>

        {/* Address */}
        <Text style={styles.address} numberOfLines={1}>
          {property.address}
        </Text>

        {/* Price + actions row */}
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(property.price)}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              accessibilityLabel="Save property"
            >
              <Text style={styles.actionIcon}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              accessibilityLabel="Share property"
            >
              <Text style={styles.actionIcon}>⤴</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;

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

  // Image
  imageBox:    { height: 180, width: '100%', position: 'relative' },
  image:       { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%', height: '100%',
    backgroundColor: '#E8F5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  imageEmoji: { fontSize: 52 },

  // Premium badge
  premiumBadge: {
    position: 'absolute',
    top: 12, left: 12,
    backgroundColor: '#2E6B3E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // Body
  body: { padding: 14 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  address: {
    fontSize: 13,
    color: '#6B8C6B',
    marginBottom: 12,
  },

  // For Sale / Rent badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A237E',      // navy blue price — matches screenshot
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D4E8D4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  actionIcon: {
    fontSize: 16,
    color: '#6B8C6B',
  },
});