import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore"; 
import { initializeApp } from "firebase/app"; 
import { firebaseConfig } from "../utils/firebase-config"; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function DeviceSelection() {
  const [device, setDevice] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [email, setEmail] = useState<string>(''); // New state to hold email
  const router = useRouter();

  const handleDeviceChange = (selectedDevice: string) => {
    setDevice(selectedDevice);
    setConfig({}); // Clear previous configurations
  };

  const handleInputChange = (field: string, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!device) {
      Alert.alert("Error", "Please select a device!");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Please enter your email!");
      return;
    }

    if (Object.values(config).some((field) => !field)) {
      Alert.alert("Error", "Please fill out all configuration fields!");
      return;
    }

    const { model } = config;

    if (!model) {
      Alert.alert("Error", "Model information is required!");
      return;
    }

    try {
      const q = query(
        collection(db, device),
        where("model", "==", model)
      );
      const querySnapshot = await getDocs(q);

      // If the device with the model already exists, show success message
      if (!querySnapshot.empty) {
        Alert.alert("Success", "registered successfully!");
        router.push("/login");
        return;
      }

      const newDeviceData = { device, ...config }; // Store only the device-related data
      await addDoc(collection(db, device), newDeviceData); // Store in device-specific collection

      // Store email and all other details in the 'users' collection
      const userData = { email, ...config }; // Include email here
      await addDoc(collection(db, 'users'), userData); // Store email + other fields in 'users' collection

      Alert.alert("Registered Successfully", "your account has been created!. Please log in");
      router.push("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to register.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Please register with Your Device</Text>

      {/* Input for email */}
      <TextInput
        placeholder="Enter your email"
        onChangeText={(value) => setEmail(value)}
        style={styles.input}
      />

      <Picker
        selectedValue={device}
        onValueChange={(value) => handleDeviceChange(value as string)}
        style={styles.picker}
      >
        <Picker.Item label="Smartphone" value="Smartphones" />
        <Picker.Item label="TV" value="TV" />
        <Picker.Item label="Washing Machine" value="Washing Machines" />
        <Picker.Item label="Laptop" value="Laptops" />
        <Picker.Item label="Refrigerator" value="Refrigerators" />
      </Picker>

      {/* Device-specific configurations */}
      {device === "Smartphones" && (
        <View style={styles.inputContainer}>
          <TextInput placeholder="Price" onChangeText={(value) => handleInputChange("price", value)} style={styles.input} />
          <TextInput placeholder="Brand" onChangeText={(value) => handleInputChange("brand", value)} style={styles.input} />
          <TextInput placeholder="Model" onChangeText={(value) => handleInputChange("model", value)} style={styles.input} />
          <TextInput placeholder="Support Year" onChangeText={(value) => handleInputChange("support years", value)} style={styles.input} />
          <TextInput placeholder="Launched Year" onChangeText={(value) => handleInputChange("released year", value)} style={styles.input} />
          <TextInput placeholder="Warranty period" onChangeText={(value) => handleInputChange("warranty period", value)} style={styles.input} />
          <TextInput placeholder="Display Type" onChangeText={(value) => handleInputChange("Display", value)} style={styles.input} />
          <TextInput placeholder="HDR Qualities" onChangeText={(value) => handleInputChange("HDR Quality", value)} style={styles.input} />
        </View>
      )}

      {device === "TV" && (
        <View style={styles.inputContainer}>
          <TextInput placeholder="TV Brand Name" onChangeText={(value) => handleInputChange("brand", value)} style={styles.input} />
          <TextInput placeholder="Warranty Tracking" onChangeText={(value) => handleInputChange("warranty period", value)} style={styles.input} />
          <TextInput placeholder="Launched Year" onChangeText={(value) => handleInputChange("released year", value)} style={styles.input} />
          <TextInput placeholder="Support Year" onChangeText={(value) => handleInputChange("support year", value)} style={styles.input} />
          <TextInput placeholder="HDR Qualities" onChangeText={(value) => handleInputChange("HDR Qualities", value)} style={styles.input} />
          <TextInput placeholder="Model" onChangeText={(value) => handleInputChange("model", value)} style={styles.input} />
          <TextInput placeholder="Price" onChangeText={(value) => handleInputChange("price", value)} style={styles.input} />
        </View>
      )}

      {/* Use TouchableOpacity instead of Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    backgroundColor: "black",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6200ee",
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
