import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface ListItem {
  id: string;
  image: string;
  latitude: number;
  longitude: number;
  address: string;
  title?: string;
  price?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  isFeatured?: boolean;
}

type Props = NativeStackScreenProps<RootStackParamList, 'AddHomeScreen'>;

// ── Design tokens (matches app theme) ──────────────────────────
const GREEN_NAVY = '#1A237E';
const GREEN_BG   = '#E8F5E9';
const CARD_BG    = '#FFFFFF';
const TEXT_DARK  = '#111827';
const TEXT_MUTED = '#6B8C6B';
const BORDER     = '#D4E8D4';

const MyListScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<ListItem[]>([]);

  // ✅ Just navigate to AddHomeScreen — no camera/location logic here
  const handleAdd = () => {
    navigation.navigate('AddHomeScreen');
  };

  const handleViewAll     = () => console.log('View All pressed');
  const handleFavorite    = (id: string) => console.log('Favorite pressed:', id);
  const handleCardPress   = (item: ListItem) => console.log('Card pressed:', item.id);

  // ── Card renderer ───────────────────────────────────────────
  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${item.title ?? 'Captured Home'}, ${item.address}`}
      testID={`mylist-card-${item.id}`}
    >
      {/* ── Image ── */}
      <View style={styles.imageBox}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        {/* Heart / favorite button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => handleFavorite(item.id)}
          accessibilityLabel="Save to favorites"
          testID={`favorite-btn-${item.id}`}
        >
          <Text style={styles.heartIcon}>♥</Text>
        </TouchableOpacity>

        {/* Featured badge */}
        {item.isFeatured ? (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        ) : null}
      </View>

      {/* ── Body ── */}
      <View style={styles.cardBody}>

        <View style={styles.titleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title ?? 'Captured Home'}
          </Text>
          {item.price ? (
            <Text style={styles.cardPrice}>{item.price}</Text>
          ) : null}
        </View>

        <View style={styles.addressRow}>
          <Text style={styles.pin}>📍</Text>
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        {/* Beds / Baths / Sqft row — only shown if data exists */}
        {(item.beds || item.baths || item.sqft) ? (
          <View style={styles.statsRow}>
            {item.beds ? (
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🛏</Text>
                <Text style={styles.statText}>{item.beds} Beds</Text>
              </View>
            ) : null}
            {item.baths ? (
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🛁</Text>
                <Text style={styles.statText}>{item.baths} Baths</Text>
              </View>
            ) : null}
            {item.sqft ? (
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📐</Text>
                <Text style={styles.statText}>{item.sqft.toLocaleString()} sqft</Text>
              </View>
            ) : null}
          </View>
        ) : null}

      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top header: back arrow + title + Add button ── */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          testID="back-btn"
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.topHeaderTitle}>My List</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel="Add new property"
          testID="add-btn"
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── Section header ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recently Viewed</Text>
        <TouchableOpacity
          onPress={handleViewAll}
          accessibilityRole="link"
          accessibilityLabel="View all"
          testID="view-all-btn"
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* ── List / Empty state ── */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyTitle}>No Items Available</Text>
          <Text style={styles.emptyText}>Tap Add to capture an image.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default MyListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Top header ──────────────────────────────────────────────
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backArrow: {
    fontSize: 22,
    color: TEXT_DARK,
    width: 32,
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  addButton: {
    backgroundColor: GREEN_NAVY,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: GREEN_NAVY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Section header ──────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: GREEN_BG,
    paddingTop: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: GREEN_NAVY,
  },

  // ── List ────────────────────────────────────────────────────
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    backgroundColor: GREEN_BG,
  },

  // ── Card ────────────────────────────────────────────────────
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Image
  imageBox: {
    height: 190,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Heart button
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heartIcon: {
    fontSize: 17,
    color: '#E24B6B',
  },

  // Featured badge
  featuredBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: GREEN_NAVY,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  featuredText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // Body
  cardBody: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_DARK,
    flex: 1,
    marginRight: 8,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: GREEN_NAVY,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  pin: { fontSize: 12 },
  address: {
    fontSize: 13,
    color: TEXT_MUTED,
    flex: 1,
  },

  // Stats row (beds/baths/sqft)
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statIcon: { fontSize: 13 },
  statText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '600',
  },

  // ── Empty state ─────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: GREEN_BG,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: 14,
    textAlign: 'center',
  },
});