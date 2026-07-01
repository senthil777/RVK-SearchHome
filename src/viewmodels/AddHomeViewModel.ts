// src/viewmodels/AddHomeViewModel.ts
import { useState, useCallback } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { createListingApi } from '../services/MyListService';
import { ApiErrorResponse } from '../models/AuthModel';
import { ListingModel } from '../models/HomeModel';

export const useAddHomeViewModel = () => {
  const [image, setImage]                 = useState<string | null>(null);
  const [latitude, setLatitude]           = useState<number | null>(null);
  const [longitude, setLongitude]         = useState<number | null>(null);
  const [description, setDescription]     = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  // ── Permissions ─────────────────────────────────────────────
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

  // ── Location capture ────────────────────────────────────────
  const captureLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please allow location access in your device settings.');
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
  }, []);

  // ── Image picker handling ───────────────────────────────────
  const handleImageResponse = useCallback((response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage ?? 'Something went wrong.');
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) {
      setImage(uri);
      captureLocation();   // ✅ fetch location right after photo is taken
    }
  }, [captureLocation]);

  const openCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please allow camera access in your device settings.');
      return;
    }
    launchCamera(
      { mediaType: 'photo', cameraType: 'back', saveToPhotos: true, quality: 0.8 },
      handleImageResponse,
    );
  }, [handleImageResponse]);

  const openGallery = useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
      handleImageResponse,
    );
  }, [handleImageResponse]);

  const handleUploadPress = useCallback(() => {
    Alert.alert('Add Home Photo', 'Choose an option', [
      { text: '📷  Camera',  onPress: openCamera },
      { text: '🖼️  Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [openCamera, openGallery]);

  // ── Submit (real API call) ──────────────────────────────────
  const submitListing = useCallback(async (): Promise<ListingModel | null> => {
    setError(null);

    if (!image) {
      setError('Please upload a home photo first.');
      return null;
    }
    if (latitude === null || longitude === null) {
      setError('Please wait for location to load, or retry.');
      return null;
    }

    setSubmitting(true);
    try {
      const property = await createListingApi({
        imageUri: image,
        latitude,
        longitude,
        description: description.trim(),
      });
      return property;
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message ?? 'Failed to submit listing.');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [image, latitude, longitude, description]);

  return {
    image,
    latitude,
    longitude,
    description,
    fetchingLocation,
    submitting,
    error,
    setDescription,
    handleUploadPress,
    submitListing,
  };
};