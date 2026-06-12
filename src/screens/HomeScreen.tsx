import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { useHomeViewModel } from '../viewmodels/HomeViewModel';
import {
  HomeHeader,
  HomeSearchBar,
  HomeBanner,
  SectionHeader,
  PropertyCard,
} from './components/home';
import { PropertyModel } from '../models/HomeModel';

const HomeScreen = () => {
  const {
    properties,
    loading,
    error,
    greeting,
    searchQuery,
    setSearchQuery,
    fetchProperties,
  } = useHomeViewModel();

  const handlePropertyPress = (property: PropertyModel) => {
    // Navigate to property detail screen
    console.log('Property pressed:', property.id);
  };

  const handleBrowsePress = () => {
    console.log('Browse all pressed');
  };

  const handleSeeAllPress = () => {
    console.log('See all pressed');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchProperties}
          tintColor="#007AFF"
          testID="home-refresh-control"
        />
      }
    >
      <HomeHeader greeting={greeting} userName="John" />

      <HomeSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <HomeBanner onBrowsePress={handleBrowsePress} />

      <SectionHeader
        title="Featured"
        onSeeAllPress={handleSeeAllPress}
      />

      {/* Loading state */}
      {loading && properties.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : null}

      {/* Error state */}
      {error && !loading ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Empty search result */}
      {!loading && properties.length === 0 && searchQuery.length > 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>
            No properties found for "{searchQuery}"
          </Text>
        </View>
      ) : null}

      {/* Property list */}
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          onPress={handlePropertyPress}
        />
      ))}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8F9FB' },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F7C1C1',
  },
  errorText: {
    color: '#E24B4A',
    fontSize: 13,
    textAlign: 'center',
  },
});