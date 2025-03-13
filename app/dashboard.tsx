import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, TextInput, FlatList,ScrollView } from 'react-native';
import { auth } from '../utils/firebase-config';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../utils/firebase-config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const calculateWarrantyExpiry = (releasedYear: number, warrantyPeriod: number): Date => {
  const currentDate = new Date();
  const expiryYear = releasedYear + warrantyPeriod;
  return new Date(expiryYear, currentDate.getMonth(), currentDate.getDate());
};
const YourComponent = () => {
  const router = useRouter(); }

const Dashboard: React.FC = () => {
  const [userDeviceData, setUserDeviceData] = useState<any | null>(null); 
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [results, setResults] = useState<any[]>([]); 
  const [data, setData] = useState<any[]>([]); 
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null); // For timeout handling
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      // Example: Mock user device data for demonstration
      const mockDeviceData = {
        email: currentUser.email,
        warrantyPeriod: 2,
        releasedYear: 2022
      };

      // Calculate the warranty expiry and time remaining
      const expiryDate = calculateWarrantyExpiry(mockDeviceData.releasedYear, mockDeviceData.warrantyPeriod);
      const timeRemaining = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 3600 * 24)); // days remaining

      setUserDeviceData({
        ...mockDeviceData,
        expiryDate,
        timeRemaining
      });

    } else {
      Alert.alert('Error', 'No user found!');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionNames = ['Smartphones', 'Laptops', 'Refrigerators', 'Washing Machines', 'TV'];
        let allData: any[] = [];

        for (let collectionName of collectionNames) {
          const querySnapshot = await getDocs(collection(firestore, collectionName));
          querySnapshot.forEach((doc) => {
            allData.push({ id: doc.id, ...doc.data(), category: collectionName });
          });
        }
        
        setData(allData);
        setResults(allData);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch data from Firestore');
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logout Successful', 'You have been logged out.');
      router.push('/login');
    } catch (error) {
      Alert.alert('Logout Error', 'There was an error logging out.');
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    // Clear any previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout
    const newTimeout = setTimeout(() => {
      if (!text.trim()) {
        setResults(data);
        return;
      }

      const filteredData = data.filter(
        (item) => item.brand && item.brand.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filteredData);
    }, 500); // Adjust delay time as needed (500ms here)

    setTypingTimeout(newTimeout); // Store the timeout reference
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/profile.png')} style={styles.profileIcon} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Hello</Text>
        {user && <Text style={styles.emailText}>{String(user.email)}</Text>}
      </View>
{/* User Device Info Card */}
{userDeviceData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Device Information</Text>
          <Text style={styles.cardContent}>Email: {userDeviceData.email}</Text>
          <Text style={styles.cardContent}>Warranty Period: {userDeviceData.warrantyPeriod} years</Text>
          <Text style={styles.cardContent}>Released Year: {userDeviceData.releasedYear}</Text>
          <Text style={styles.cardContent}>Warranty Expiry Date: {userDeviceData.expiryDate.toDateString()}</Text>
          <Text style={styles.cardContent}>Time Remaining: {userDeviceData.timeRemaining.toFixed(0)} days</Text>
        </View>
      )}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by brand..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>
 
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.brand}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>

            {/* Conditional rendering based on category */}
            {item.category === 'Smartphones' && (
              <>
                <Text style={styles.cardContent}>Display: {item.Display}</Text>
                <Text style={styles.cardContent}>Price: {item.price}</Text>
                <Text style={styles.cardContent}>Model: {item.model}</Text>
                <Text style={styles.cardContent}>Released year: {item['released year']}</Text>
                <Text style={styles.cardContent}>Support years: {item['support years']}</Text>
                <Text style={styles.cardContent}>Warranty period: {item['warranty period']}</Text>
                <Text style={styles.cardContent}>HDR Quality: {item['HDR Quality']}</Text>
              </>
            )}
            {/* Similar rendering for other categories... */}

            {item.category === 'Laptops' && (
              <>
                <Text style={styles.cardContent}>Model: {item.model}</Text>
                <Text style={styles.cardContent}>Price: {item.price}</Text>
                <Text style={styles.cardContent}>Released year: {item['released year']}</Text>
                <Text style={styles.cardContent}>Support year: {item['support year']}</Text>
                <Text style={styles.cardContent}>Warranty period: {item['warranty period']}</Text>
                <Text style={styles.cardContent}>Storage type: {item['storage type']}</Text>
                <Text style={styles.cardContent}>Display size: {item['display size']}</Text>
              </>
            )}

            {/* Similar rendering for other categories */}
            {item.category === 'Refrigerators' && (
              <>
                <Text style={styles.cardContent}>Model: {item.model}</Text>
                <Text style={styles.cardContent}>Price: {item.price}</Text>
                <Text style={styles.cardContent}>Released year: {item['release year']}</Text>
                <Text style={styles.cardContent}>Support year: {item['support year']}</Text>
                <Text style={styles.cardContent}>Warranty period: {item['warranty period']}</Text>
              </>
            )}
            {item.category === 'TV' && (
              <>
                <Text style={styles.cardContent}>Model: {item.model}</Text>
                <Text style={styles.cardContent}>Price: {item.price}</Text>
                <Text style={styles.cardContent}>Released year: {item['released year']}</Text>
                <Text style={styles.cardContent}>Support year: {item['support year']}</Text>
                <Text style={styles.cardContent}>Warranty period: {item['warranty period']}</Text>
                <Text style={styles.cardContent}>HDR Qualities: {item['HDR Qualities']}</Text>
              </>
            )}
            {item.category === 'Washing Machines' && (
              <>
                <Text style={styles.cardContent}>Model: {item.model}</Text>
                <Text style={styles.cardContent}>Price: {item.price}</Text>
                <Text style={styles.cardContent}>Released year: {item['released year']}</Text>
                <Text style={styles.cardContent}>Support year: {item['support year']}</Text>
                <Text style={styles.cardContent}>Warranty period: {item['warranty period']}</Text>
                <Text style={styles.cardContent}>Load capacity: {item['load capacity']}</Text>
                <Text style={styles.cardContent}>Water consumption: {item['water consumption']}</Text>
              </>
            )}

          </View>
        )}
        ListEmptyComponent={() => <Text style={styles.noResultsText}>No results found</Text>}
      />
      <TouchableOpacity onPress={()=>router.push('/')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Home</Text>
      </TouchableOpacity>

</ScrollView>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      
    </View>
    
  );
};

const styles = StyleSheet.create({
  // Styles here...
  container: {
    flex: 1,
    backgroundColor: '#F4F6F6',  // Lighter background for a modern feel
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2980B9', // Profile icon border color
  },
  welcomeContainer: {
    marginVertical: 30,
    alignItems: 'center',
    marginTop: -50,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',  // Darker text for contrast
  },
  emailText: {
    fontSize: 18,
    color: '#7F8C8D',
    marginTop: 20,
  },
  searchContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3498DB',  // Blue search box border
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    width: '90%',
  },
  searchInput: {
    width: '90%',
    padding: 12,
    fontSize: 18,
    color: '#2C3E50',
  },
  searchIcon: {
    marginRight: 10,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#E74C3C',  // Red color for no results
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2980B9', // Brand color for titles
  },
  cardCategory: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 5,
  },
  cardContent: {
    fontSize: 14,
    color: '#34495E',
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 20, // Add space for scrolling
  },
  backButton:{
    backgroundColor: 'blue',
    padding: 10, // Reduced padding for smaller size
    borderRadius: 5, // Smaller border radius for a square button
    alignItems: 'center',
    justifyContent: 'center', // Ensure the text is centered
    //width: 80, // Set a fixed width to make it square
    //height: 50, 
  },
  backButtonText:{
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    
    backgroundColor: '#E74C3C',
    padding: 10, // Reduced padding for smaller size
    borderRadius: 5, // Smaller border radius for a square button
    alignItems: 'center',
    justifyContent: 'center', // Ensure the text is centered
    width: 65, // Set a fixed width to make it square
    height: 50, // Set a fixed height to make it square
    marginTop: 10, // Adjust as needed for placement
    position: 'absolute', // To fix its position
    top: 20, // Place it at the top, adjust as needed
    right: 30, 
  },
  logoutButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Dashboard;
