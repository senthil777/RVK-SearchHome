import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';


interface ListItem {
  id: string;
  image: string;
  latitude: number;
  longitude: number;
  address: string;
}
type Props = NativeStackScreenProps<RootStackParamList, 'AddHomeScreen'>;

const MyListScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<ListItem[]>([]);

  const requestPermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const cameraPermission =
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

    const locationPermission =
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

    const granted =
      cameraPermission ===
        PermissionsAndroid.RESULTS.GRANTED &&
      locationPermission ===
        PermissionsAndroid.RESULTS.GRANTED;

    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Camera and Location permissions are required.',
      );
    }

    return granted;
  } catch (error) {
    console.log(error);
    return false;
  }
};

  const handleAdd = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
      },
      async response => {
        if (response.didCancel || !response.assets?.length) {
          return;
        }

        const imageUri = response.assets[0].uri || '';

        Geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const newItem: ListItem = {
              id: Date.now().toString(),
              image: imageUri,
              latitude,
              longitude,
              address: `Lat: ${latitude}, Lng: ${longitude}`,
            };

            setItems(prev => [newItem, ...prev]);
            console.log('New Item Added:', newItem);
            navigation.navigate('AddHomeScreen', {
              image: imageUri,
              latitude,
              longitude,
            });
          },
          error => {
            console.log('Location Error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
        
      },
    );
  };

  const renderItem = ({item}: {item: ListItem}) => (
    <View style={styles.card}>
      <Image
        source={{uri: item.image}}
        style={styles.image}
      />

      <Text style={styles.address}>
        {item.address}
      </Text>

      <Text style={styles.coordinates}>
        Latitude: {item.latitude}
      </Text>

      <Text style={styles.coordinates}>
        Longitude: {item.longitude}
      </Text>
    </View>
  );

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          My List
        </Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleAdd}>
          <Text style={styles.headerButtonText}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📷</Text>

          <Text style={styles.emptyTitle}>
            No Items Available
          </Text>

          <Text style={styles.emptyText}>
            Tap Add to capture an image.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            styles.listContainer
          }
        />
      )}
    </View>
  );
};

export default MyListScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },

  headerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  headerButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },

  emptyText: {
    color: '#777',
    textAlign: 'center',
  },

  listContainer: {
    padding: 15,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 10,
  },

  address: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },

  coordinates: {
    fontSize: 12,
    color: '#666',
  },
});