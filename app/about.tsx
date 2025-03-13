import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function About() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>About Us</Text>
        <Text style={styles.headerSubtitle}>
          Discover who we are, our vision, and why we’re here to serve you better.
        </Text>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Who We Are</Text>
          <Text style={styles.cardText}>
          We are a passionate team of tech enthusiasts focused on providing up-to-date and detailed information about the latest devices to your fingertips.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Vision</Text>
          <Text style={styles.cardText}>
          Our vision is to be the go-to platform for tech enthusiasts, offering easy access to detailed and reliable device information. We aim to empower users to make informed decisions.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why Choose Us?</Text>
          <Text style={styles.cardText}>
          Choose us for up-to-date device information in one place. Stay informed and make the best tech choices with us. Your satisfaction drives us forward.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Us</Text>
          <View style={styles.memberList}>
            <View style={styles.member}>
              <Text style={styles.memberName}>Pratheeksha P</Text>
              <Text style={styles.memberEmail}>pratheekshap837@gmail.com</Text>
            </View>
            <View style={styles.member}>
              <Text style={styles.memberName}>Rashmitha</Text>
              <Text style={styles.memberEmail}>rashmithapoojari3@gmail.com</Text>
            </View>
            <View style={styles.member}>
              <Text style={styles.memberName}>Punyashree</Text>
              <Text style={styles.memberEmail}>punyashree974@gmail.com</Text>
            </View>
            <View style={styles.member}>
              <Text style={styles.memberName}>Tilak</Text>
              <Text style={styles.memberEmail}>thilakraj67411@gmail.com</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("./Contact")}>
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "black", // Soft background color
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
    fontWeight: "bold"
  },
  content: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "black",
    lineHeight: 24,
    textAlign: "justify"
  },
  memberList: {
    marginTop: 10,
  },
  member: {
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  memberEmail: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007BFF", // Professional blue tone
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    elevation: 2,
    shadowColor: "#007BFF",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
