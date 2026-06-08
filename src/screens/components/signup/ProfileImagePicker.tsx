import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';

interface Props {
  profileImage: string | null;
  onImageSelected: (uri: string) => void;
}

const requestAndroidPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    // Android 13+ (API 33+)
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Photo Library Permission',
          message: 'App needs access to your photos to set a profile picture.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // Android 12 and below
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);

    return (
      results[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      results[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    return false;
  }
};

const ProfileImagePicker = ({ profileImage, onImageSelected }: Props) => {

  const handleResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage ?? 'Something went wrong.');
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) onImageSelected(uri);
  };

  const openCamera = async () => {
    const hasPermission = await requestAndroidPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please allow camera access in your device settings.',
      );
      return;
    }

    launchCamera(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        saveToPhotos: false,
        cameraType: 'front',
      },
      handleResponse,
    );
  };

  const openGallery = async () => {
    const hasPermission = await requestAndroidPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please allow photo library access in your device settings.',
      );
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        selectionLimit: 1,
      },
      handleResponse,
    );
  };

  const handlePickImage = () => {
    Alert.alert('Upload Profile Photo', 'Choose an option', [
      {
        text: '📷  Camera',
        onPress: openCamera,
      },
      {
        text: '🖼️  Gallery',
        onPress: openGallery,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleRemoveImage = () => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove your profile photo?', [
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => onImageSelected(''),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={handlePickImage}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={profileImage ? 'Change profile photo' : 'Upload profile photo'}
        testID="profile-image-picker"
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>👤</Text>
            <Text style={styles.placeholderText}>Upload Photo</Text>
          </View>
        )}

        {/* Camera badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>📷</Text>
        </View>
      </TouchableOpacity>

      {/* Change / Remove buttons shown after image is selected */}
      {profileImage ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.actionBtn}
            testID="change-photo-btn"
          >
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>

          <Text style={styles.separator}>|</Text>

          <TouchableOpacity
            onPress={handleRemoveImage}
            style={styles.actionBtn}
            testID="remove-photo-btn"
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.hint}>Tap to upload a profile photo</Text>
      )}

    </View>
  );
};

export default ProfileImagePicker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 28,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F4FF',
    borderWidth: 2,
    borderColor: '#C5D3F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  placeholderIcon: {
    fontSize: 28,
  },
  placeholderText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeIcon: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  changeText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  separator: {
    fontSize: 13,
    color: '#ccc',
  },
  removeText: {
    fontSize: 13,
    color: '#E24B4A',
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 10,
  },
});