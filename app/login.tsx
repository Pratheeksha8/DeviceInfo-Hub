import React, { useState } from 'react';
import { loginuser } from '../utils/auth';
import { useRouter } from 'expo-router';
import { TextInput, View, Text, Alert, StyleSheet, TouchableOpacity, Animated } from 'react-native'; // React Native components

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Updated function to handle button press, not form submit
  const handleSubmit = async () => {
    // Check if the form is filled out
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill out the form.');
      return;
    }

    try {
      const user = await loginuser(email, password);
      if (user) {
        console.log('User logged in successfully');
        Alert.alert('Success', 'Login successfully');
        router.push('/dashboard'); // Navigate to the dashboard after login
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
       console.error('Error logging in:', error.message);
        Alert.alert('Invalid Credentials', 'Please check your email and password.');
      } else {
       console.error('An unknown error occurred.');
        Alert.alert('Error', 'An unknown error occurred.');
      }
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
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleSubmit}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, { transform: [{ scale }] }]}
      >
        <Text style={styles.buttonText}>Login</Text>
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
  },
  buttonText: {
    color: '#fff', // White text color for contrast
    fontSize: 18, // Good font size for readability
    fontWeight: 'bold', // Bold text for a strong impact
    letterSpacing: 1, // Slight spacing between letters for a clean look
  },
});

export default Login;
