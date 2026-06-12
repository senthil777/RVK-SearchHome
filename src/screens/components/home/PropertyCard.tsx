import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  PropertyModel,
  PropertyBadge,
} from '../../../models/HomeModel';

interface Props {
  property: PropertyModel;
  onPress: (property: PropertyModel) => void;
}

const BADGE_COLORS: Record<
  PropertyBadge,
  { background: string; text: string }
> = {
  'For Sale': {
    background: '#E8F5E9',
    text: '#2E7D32',
  },
  'For Rent': {
    background: '#E3F2FD',
    text: '#1565C0',
  },
  Sold: {
    background: '#FFEBEE',
    text: '#B71C1C',
  },
};

const formatPrice = (price: number): string => {
  return `₹ ${price.toLocaleString('en-IN')}`;
};

const PropertyCard: React.FC<Props> = ({
  property,
  onPress,
}) => {
  const badge = BADGE_COLORS[property.badge];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(property)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${property.title}, ${property.address}, ${formatPrice(
        property.price,
      )}, ${property.badge}`}
      testID={`property-card-${property.id}`}
    >
      <View style={styles.imageBox}>
        <Text style={styles.imageEmoji}>
          {property.emoji}
        </Text>
      </View>

      <View style={styles.body}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {property.title}
        </Text>

        <Text
          style={styles.address}
          numberOfLines={1}
        >
          {property.address}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            {formatPrice(property.price)}
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: badge.background,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: badge.text,
                },
              ]}
            >
              {property.badge}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageBox: {
    height: 140,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: {
    fontSize: 48,
  },
  body: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#007AFF',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});