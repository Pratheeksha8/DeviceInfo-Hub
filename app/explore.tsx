import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { firestore } from '../utils/firebase-config';
import { useRouter } from 'expo-router';

const Explore: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Record<string, DocumentData[]>>({});
  const router = useRouter();

  const collections = ['Smartphones', 'TV', 'Laptops', 'Washing Machines', 'Refrigerators'];

  const collectionImages: Record<string, any> = {
    Smartphones: require('../assets/images/smartphone.jpg'),
    TV: require('../assets/images/tv.jpg'),
    Laptops: require('../assets/images/laptop.jpg'),
    'Washing Machines': require('../assets/images/washing_machine.jpg'),
    Refrigerators: require('../assets/images/refrigerator.jpg'),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData: Record<string, DocumentData[]> = {};
        for (const col of collections) {
          const querySnapshot = await getDocs(collection(firestore, col));
          fetchedData[col] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Explore Products</Text>
      
      <ScrollView horizontal contentContainerStyle={styles.cardContainer}>
        {collections.map((collectionName) => (
          <TouchableOpacity
            key={collectionName}
            style={styles.card}
            onPress={() => router.push(`/product-details/${collectionName}`)}
          >
            {/* Add an image next to the text */}
            <Image
              source={collectionImages[collectionName]}  // Local image from the collectionImages object
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>{collectionName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  card: {
    width: 300,
    height: 120, // Adjust height to accommodate image and text
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cardImage: {
    width: 70,  // Adjust image width
    height: 70, // Adjust image height
    marginBottom: 10,
    borderRadius: 25, // Space between image and text
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Explore;
