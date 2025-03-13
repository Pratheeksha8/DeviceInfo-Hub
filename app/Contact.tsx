import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      setStatus("Please fill out all fields.");
      return;
    }

    const formData = {
      name,
      email,
      message,
    };

    try {
      const response = await fetch("https://formspree.io/f/xgvelveb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        await AsyncStorage.removeItem("unsentMessage");
      } else {
        setStatus("Failed to send message. Please try again.");
        await AsyncStorage.setItem("unsentMessage", JSON.stringify(formData));
      }
    } catch (error) {
      console.error(error);
      setStatus("An error occurred while sending the message.");
      await AsyncStorage.setItem("unsentMessage", JSON.stringify(formData));
    }
  };

  const checkUnsentMessage = async () => {
    const savedMessage = await AsyncStorage.getItem("unsentMessage");
    if (savedMessage) {
      const { name, email, message } = JSON.parse(savedMessage);
      setName(name);
      setEmail(email);
      setMessage(message);
      setStatus("You have an unsent message, would you like to try again?");
    }
  };

  React.useEffect(() => {
    checkUnsentMessage();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black", // A soft, neutral background
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "white", // Deep gray color for text
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#bdc3c7", // A light gray border for inputs
    borderRadius: 6,
    padding: 12,
    marginVertical: 12,
    backgroundColor: "#fff", // White background for inputs
    fontSize: 16,
    color: "#2c3e50", // Matching the title color for consistency
  },
  textArea: {
    height: 150, // Increased height for better message input area
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#3498db", // A professional blue color for the button
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // For subtle shadow on Android devices
  },
  buttonText: {
    color: "#fff", // White text on the button for contrast
    fontSize: 18,
    fontWeight: "500",
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "400",
    color: "#28a745", // Green color for success status
    textAlign: "center",
  },
});
