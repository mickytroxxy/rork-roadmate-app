import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Camera, MapPin, Upload, Car } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = 'AIzaSyCLAMYOom9w4vzrDFQuEJG5Ov3e24D7mQI';

interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface PlaceSuggestion {
  description: string;
  place_id: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export default function RequestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [locationName, setLocationName] = useState<string>('');
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
  const [carMake, setCarMake] = useState<string>('');
  const [carModel, setCarModel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant access to your photo library.');
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant access to your camera.');
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to detect your location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoordinates = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      setCoordinates(coords);

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (response.data.results && response.data.results.length > 0) {
        setLocationName(response.data.results[0].formatted_address);
      } else {
        setLocationName(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please enter manually.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const searchPlaces = async (text: string) => {
    setLocationName(text);
    
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(text)}&components=country:ZA&key=${GOOGLE_PLACES_API_KEY}`
      );

      console.log('Geocoding response:', response.data);

      if (response.data.results && response.data.results.length > 0) {
        const results = response.data.results.slice(0, 5).map((result: any) => ({
          description: result.formatted_address,
          place_id: result.place_id,
          location: result.geometry.location,
        }));
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error: any) {
      console.error('Error searching places:', error);
      console.error('Error details:', error.response?.data || error.message);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectPlace = async (suggestion: PlaceSuggestion) => {
    setLocationName(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);

    if (suggestion.location) {
      setCoordinates({
        lat: suggestion.location.lat,
        lng: suggestion.location.lng,
      });
      console.log('Selected location:', suggestion.description, suggestion.location);
    } else {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?place_id=${suggestion.place_id}&key=${GOOGLE_PLACES_API_KEY}`
        );

        if (response.data.results && response.data.results[0]) {
          const location = response.data.results[0].geometry.location;
          setCoordinates({
            lat: location.lat,
            lng: location.lng,
          });
          console.log('Fetched location from place_id:', location);
        }
      } catch (error) {
        console.error('Error getting place details:', error);
      }
    }
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Car Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => pickImage(true),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImage(false),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const filename = `car-photos/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  };

  const handleSubmit = async () => {
    if (!locationName.trim()) {
      Alert.alert('Missing Information', 'Please enter or detect your location.');
      return;
    }

    if (!carMake.trim() || !carModel.trim()) {
      Alert.alert('Missing Information', 'Please enter your car make and model.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please describe the issue with your car.');
      return;
    }

    if (!imageUri) {
      Alert.alert('Missing Information', 'Please add a photo of your car.');
      return;
    }

    try {
      setIsSubmitting(true);

      const imageUrl = await uploadImage(imageUri);

      await addDoc(collection(db, 'assistance-requests'), {
        locationName,
        coordinates: coordinates || { lat: 0, lng: 0 },
        carMake,
        carModel,
        description,
        imageUrl,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      router.replace('/confirmation' as any);
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Location</Text>
          <View style={styles.inputContainer}>
            <MapPin color={colors.primary} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your location"
              placeholderTextColor={colors.textLight}
              value={locationName}
              onChangeText={searchPlaces}
              onFocus={() => setShowSuggestions(true)}
            />
          </View>
          
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.place_id}
                  style={styles.suggestionItem}
                  onPress={() => selectPlace(suggestion)}
                >
                  <MapPin color={colors.textLight} size={16} />
                  <Text style={styles.suggestionText}>{suggestion.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity 
            style={styles.detectButton}
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <>
                <MapPin color={colors.primary} size={18} />
                <Text style={styles.detectButtonText}>Detect Current Location</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Photo</Text>
          <TouchableOpacity 
            style={styles.imageUploadContainer}
            onPress={showImageOptions}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Camera color={colors.primary} size={48} />
                <Text style={styles.uploadText}>Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Details</Text>
          <View style={styles.inputContainer}>
            <Car color={colors.primary} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Car Make (e.g., Toyota)"
              placeholderTextColor={colors.textLight}
              value={carMake}
              onChangeText={setCarMake}
            />
          </View>
          
          <View style={[styles.inputContainer, styles.inputSpacing]}>
            <Car color={colors.primary} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Car Model (e.g., Corolla)"
              placeholderTextColor={colors.textLight}
              value={carModel}
              onChangeText={setCarModel}
            />
          </View>
          
          <View style={[styles.textAreaContainer, styles.inputSpacing]}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the issue (e.g., won't start, flat tire)"
              placeholderTextColor={colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Upload color={colors.white} size={20} />
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
  },
  inputSpacing: {
    marginTop: 12,
  },
  textAreaContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
    minHeight: 100,
  },
  suggestionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  detectButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.primary,
    marginLeft: 8,
  },
  imageUploadContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed' as const,
  },
  uploadPlaceholder: {
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.textLight,
    marginTop: 12,
  },
  uploadedImage: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.white,
    marginLeft: 8,
  },
});
