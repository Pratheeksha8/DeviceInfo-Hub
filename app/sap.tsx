import React, { useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { check } from '../utils/checkWarrantyExpiryAndNotify'; // Correct import

const App = () => {
  const router = useRouter();

  useEffect(() => {
    const checkExpiry = async () => {
      await check(); // Await the async check function properly
    };

    checkExpiry(); // Call the async function

  }, []);  // Empty dependency array so it runs only once

  const navigateToNextScreen = () => {
    router.push('/login'); // Use Expo Router to navigate to another screen
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Warranty Checker App!</Text>
      <Button title="Go to Next Screen" onPress={navigateToNextScreen} />
    </View>
  );
};

export default App;
