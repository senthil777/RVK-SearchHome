import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

// ── Design tokens (matches app theme) ──────────────────────────
const GREEN_NAVY = '#1A237E';
const TEXT_DARK  = '#111827';
const TEXT_MUTED = '#6B8C6B';
const BORDER     = '#D4E8D4';
const UPLOAD_BG  = '#E8EAF6';   // light lavender — matches screenshot
const UPLOAD_BORDER = '#C5CAE9';

const AddHomeScreen = ({ navigation }: any) => {
  const [image, setImage]             = useState<string | null>(null);
  const [latitude, setLatitude]       = useState<number | null>(null);
  const [longitude, setLongitude]     = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  // ── Permission requests ───────────────────────────────────
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera access to capture your home photo.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs location access to tag your property.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  // ── Location capture ──────────────────────────────────────
  const captureLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please allow location access in your device settings.',
      );
      return;
    }

    setFetchingLocation(true);

    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setFetchingLocation(false);
      },
      error => {
        console.log('Location Error:', error);
        setFetchingLocation(false);
        Alert.alert('Location Error', 'Could not fetch your current location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  // ── Image picker handling ─────────────────────────────────
  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage ?? 'Something went wrong.');
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) {
      setImage(uri);
      // ✅ Capture location right after photo is taken
      captureLocation();
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please allow camera access in your device settings.',
      );
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
        quality: 0.8,
      },
      handleImageResponse,
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
      handleImageResponse,
    );
  };

  const handleUploadPress = () => {
    Alert.alert('Add Home Photo', 'Choose an option', [
      { text: '📷  Camera',  onPress: openCamera  },
      { text: '🖼️  Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
  if (!image) {
    Alert.alert('Photo Required', 'Please upload a home photo first.');
    return;
  }
  if (latitude === null || longitude === null) {
    Alert.alert('Location Required', 'Please wait for location to load, or retry.');
    return;
  }

  setSubmitting(true);
  try {
    // TODO: replace with real API call (multipart upload)
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1200));   // ✅ Fixed

    Alert.alert('Success', 'Home submitted successfully');
    navigation.goBack();
  } catch {
    Alert.alert('Error', 'Failed to submit. Please try again.');
  } finally {
    setSubmitting(false);
  }
};

  const handleSettingsPress = () => console.log('Settings pressed');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false} />

      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="back-btn"
          >
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Home</Text>

          <TouchableOpacity
            onPress={handleSettingsPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            testID="settings-btn"
          >
            <Ionicons name="settings-outline" size={22} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>

        {/* ── Upload box ── */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleUploadPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={image ? 'Change home photo' : 'Upload home photo'}
          testID="upload-photo-box"
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} resizeMode="cover" />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.cameraIconWrapper}>
                <Ionicons name="camera-outline" size={30} color={GREEN_NAVY} />
                <View style={styles.plusBadge}>
                  <Ionicons name="add" size={12} color="#fff" />
                </View>
              </View>
              <Text style={styles.uploadText}>Tap to upload home photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ── Location card ── */}
        <View style={styles.locationCard}>

          <View style={styles.locationRow}>
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationLabel}>Latitude</Text>
              <Text style={styles.locationValue}>
                {latitude !== null ? latitude.toFixed(7) : '—'}
              </Text>
            </View>
            <Ionicons name="location-outline" size={20} color="#AAB4C4" />
          </View>

          <View style={styles.divider} />

          <View style={styles.locationRow}>
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationLabel}>Longitude</Text>
              <Text style={styles.locationValue}>
                {longitude !== null ? longitude.toFixed(7) : '—'}
              </Text>
            </View>
            {fetchingLocation ? (
              <ActivityIndicator size="small" color={GREEN_NAVY} />
            ) : (
              <Ionicons name="compass-outline" size={20} color="#AAB4C4" />
            )}
          </View>

        </View>

        {/* ── Description ── */}
        <Text style={styles.descLabel}>Description / Notes</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter details about the property, condition, or neighborhood..."
          placeholderTextColor="#AAB4C4"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          testID="description-input"
        />

        {/* ── Submit ── */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel={submitting ? 'Submitting' : 'Submit'}
          testID="submit-btn"
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.submitContent}>
              <Text style={styles.submitText}>Submit</Text>
              <Ionicons name="send" size={16} color="#fff" style={{ marginLeft: 8 }} />
            </View>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default AddHomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: GREEN_NAVY,
  },

  // ── Upload box ──────────────────────────────────────────────
  uploadBox: {
    marginTop: 16,
    height: 200,
    borderRadius: 16,
    backgroundColor: UPLOAD_BG,
    borderWidth: 1.5,
    borderColor: UPLOAD_BORDER,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  plusBadge: {
    position: 'absolute',
    top: -2,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: GREEN_NAVY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },

  // ── Location card ───────────────────────────────────────────
  locationCard: {
    marginTop: 18,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  locationTextGroup: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
  },

  // ── Description ────────────────────────────────────────────
  descLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 22,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    fontSize: 14,
    color: TEXT_DARK,
    backgroundColor: '#fff',
  },

  // ── Submit ──────────────────────────────────────────────────
  submitButton: {
    marginTop: 22,
    backgroundColor: GREEN_NAVY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: GREEN_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});