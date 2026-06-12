import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddHomeScreen = ({route, navigation}: any) => {
  const {image, latitude, longitude} = route.params;
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = () => {
    Alert.alert(
      'Success',
      `Data submitted successfully\nSuggestion: ${suggestion}`,
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        translucent={false}
      />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
  onPress={() => navigation.goBack()}
  style={styles.backButtonContainer}>
  <Ionicons
    name="arrow-back"
    size={24}
    color="#000"
  />
</TouchableOpacity>

          <Text style={styles.headerTitle}>Add Home</Text>

          <View style={{width: 50}} />
        </View>

        <Image source={{uri: image}} style={styles.image} />

        <View style={styles.card}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{latitude}</Text>

          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{longitude}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your suggestion..."
          value={suggestion}
          onChangeText={setSuggestion}
          multiline
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
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

  backButtonContainer: {
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
},

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginTop: 10,
  },

  card: {
    marginTop: 20,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },

  value: {
    fontSize: 15,
    color: '#555',
  },

  input: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});