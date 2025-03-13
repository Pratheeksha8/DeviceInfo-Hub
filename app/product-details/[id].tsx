import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { firestore } from '../../utils/firebase-config';

// Debounce function to delay the search input
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProductDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DocumentData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // No debounce for immediate updates
  const router = useRouter();

  // Use debounce to delay filtering (after typing is done)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const inputRef = useRef<TextInput>(null); // Reference to maintain focus

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const querySnapshot = await getDocs(collection(firestore, id as string));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter data based on the debounced search query
  const filteredData = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return data;
    }

    return data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    );
  }, [debouncedSearchQuery, data]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text); // Immediate update for search query
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading {id} data...</Text>
      </View>
    );
  }

  // Render the title and search bar as part of the FlatList header
  const renderHeader = () => (
    <View>
      <Text style={styles.title}>{id} Details</Text>
      <View style={styles.searchWrapper}>
        <TextInput
          ref={inputRef} // Reference to manage focus
          style={styles.searchInput}
          
          placeholder="Search by brand..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoFocus // Ensure input is always focused
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View key={item.id} style={styles.card}>
          {Object.keys(item).map((key) => (
            key !== 'id' && (
              <Text key={key}>
                <Text style={styles.label}>{key}:</Text> {item[key]}
              </Text>
            )
          ))}
        </View>
      )}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={<Text style={styles.noData}>No data found for {id}.</Text>}
      ListFooterComponent={
        <Text onPress={() => router.back()} style={styles.backButton}>
          ← Back
        </Text>
      }
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
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
  card: {
    backgroundColor: 'lavender',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#3498DB',
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    width: '100%',
    padding: 12,
    fontSize: 18,
    color: '#2C3E50',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
  },
  backButton: {
    marginTop: 10,
    fontSize: 18,
    color: '#007bff',
    textAlign: 'center',
  },
});

export default ProductDetails;
