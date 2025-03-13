import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase-config'; // Adjust the path to your Firebase configuration
import { Animated } from 'react-native';

interface FormData {
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered user:', userCredential.user);
      Alert.alert('For Successful Registration ', 'please fill out this form');
      router.push('/selection'); 
    } catch (error: any) {
      let message = 'An error occurred during registration. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered. Please log in.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          message = 'Your password is too weak. It must be at least 6 characters long.';
          break;
      }
      Alert.alert('Registration Failed', message);
    }
  };

  const [scale, setScale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98, // Shrinks the button when pressed
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1, // Resets the button size after release
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
        <TouchableOpacity
        onPress={handleRegister}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, { transform: [{ scale }] }]}
      >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    width: '80%', // Keep width at 80% of screen width
    height: 50, // Optimal height for touch targets
    backgroundColor: '#3498db', // A clean blue background
    borderRadius: 25, // Round corners for a sleek look
    marginTop: 20,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    elevation: 6, // Shadow for elevation (Android)
    shadowColor: '#2980b9', // Slight blue shadow for depth
    shadowOffset: { width: 0, height: 4 }, // Position of the shadow
    shadowOpacity: 0.3, // Semi-transparent shadow
    shadowRadius: 5, // Soft blur of the shadow
    transform: [{ scale: 1 }], // Default scale (without transition)
  padding: 0, // Remove any extra padding around the button
  alignSelf:'center',
  },
  buttonText: {
    color: '#fff', // White text color for contrast
    fontSize: 18, // Good font size for readability
    fontWeight: 'bold', // Bold text for a strong impact
    letterSpacing: 1, // Slight spacing between letters for a clean look
  },
  inputFocused: {
    borderColor: '#3498db',
  },
});

export default Register;
