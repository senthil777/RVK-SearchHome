// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeViewModel } from '../viewmodels/HomeViewModel';
import {
  HomeHeader,
  HomeSearchBar,
  HomeBanner,
  SectionHeader,
  PropertyCard,
} from './components/home';
import ListingCard from './components/home/ListingCard';
import { PropertyModel, ListingModel } from '../models/HomeModel';
import { UserStorage } from '../storage/UserStorage';
import { UserModel } from '../models/AuthModel';

const HomeScreen = () => {
  const {
    properties,
    listings,
    loading,
    listLoading,
    error,
    listError,
    greeting,
    searchQuery,
    setSearchQuery,
    refreshAll,
  } = useHomeViewModel();

  // ✅ Load user name from local storage
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    UserStorage.getUser().then(setUser);
  }, []);

  const userName = user?.firstName ?? 'User';

  const handlePropertyPress = (property: PropertyModel) => {
    console.log('Property pressed:', property.id);
  };

  const handleListingPress = (listing: ListingModel) => {
    console.log('Listing pressed:', listing.id);
  };

  const handleBrowsePress = () => console.log('Browse all pressed');
  const handleSeeAllPress = () => console.log('See all featured');
  const handleMyListSeeAll = () => console.log('See all my listings');

  // Combined refresh loading
  const isRefreshing = loading || listLoading;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            tintColor="#2E6B3E"
            testID="home-refresh-control"
          />
        }
      >
        {/* ── Header with user name from storage ── */}
        <HomeHeader greeting={greeting} userName={userName} />

        {/* ── Search bar ── */}
        <HomeSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* ── Banner ── */}
        <HomeBanner onBrowsePress={handleBrowsePress} />

       

        {/* ════════════════════════════════════════
            MY LIST SECTION (real API listings)
        ════════════════════════════════════════ */}
        <View style={styles.sectionGap} />

        <SectionHeader
          title="My List"
          onSeeAllPress={handleMyListSeeAll}
        />

        {/* My List loading */}
        {listLoading && listings.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#2E6B3E" />
            <Text style={styles.loadingText}>Loading your listings...</Text>
          </View>
        ) : null}

        {/* My List error */}
        {listError && !listLoading ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{listError}</Text>
          </View>
        ) : null}

        {/* My List empty */}
        {!listLoading && listings.length === 0 && !listError ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🏘️</Text>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptySubtitle}>
              Your saved properties will appear here.
            </Text>
          </View>
        ) : null}

        {/* My List items */}
        {listings.map(listing => (
          <ListingCard
            key={listing.id}
            item={listing}
            onPress={handleListingPress}
          />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  flex: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },

  // Gap between sections
  sectionGap: {
    height: 8,
    marginBottom: 8,
  },

  // States
  center: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B8C6B',
  },
  emptyIcon:  { fontSize: 44, marginBottom: 10 },
  emptyText:  { fontSize: 14, color: '#6B8C6B', textAlign: 'center' },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B8C6B',
    textAlign: 'center',
    lineHeight: 20,
  },

  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    textAlign: 'center',
  },
});