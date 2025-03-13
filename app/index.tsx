import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  DrawerLayoutAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // For hamburger icon
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [loading, setLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  const router = useRouter();
  
  // Drawer reference
  const drawerRef = useRef(null);

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Scale pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate a delay for loading screen
    setTimeout(() => setLoading(false), 4000);
  }, []);

  const renderDrawer = () => (
    <View style={styles.drawerContent}>
      
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/login")}
      >
        <Ionicons name="log-in-outline" size={22} color="#6a11cb" />
        <Text style={styles.drawerItemText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("./about")}
      >
        <Ionicons name="information-circle-outline" size={22} color="#6a11cb" />
        <Text style={styles.drawerItemText}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("./Contact")}
      >
        <Ionicons name="call-outline" size={22} color="#6a11cb" />
        <Text style={styles.drawerItemText}>Contact Info</Text>
      </TouchableOpacity>
    </View>
  );

  const handleHamburgerPress = () => {
    // Open the drawer when hamburger menu is pressed
    drawerRef.current?.openDrawer();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#0f2027", "#203a43", "#2c5364"]}
        style={styles.loadingContainer}
      >
        <Animated.View
          style={[
            styles.animatedCircle,
            { transform: [{ scale: scaleAnim }] },
          ]}
        />
        <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
          Preparing Your Experience...
        </Animated.Text>
      </LinearGradient>
    );
  }

  return (
    <DrawerLayoutAndroid
      ref={drawerRef} // Attach ref to DrawerLayoutAndroid
      drawerWidth={width * 0.75}
      drawerPosition="left"
      renderNavigationView={renderDrawer}
    >
      <LinearGradient colors={["#1c92d2", "#f2fcfe"]} style={styles.container}>
        {/* Hamburger Icon */}
        <TouchableOpacity style={styles.hamburger} onPress={handleHamburgerPress}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome to DeviceInfo Hub</Text>
          <Text style={styles.subtitle}>Informing your digital life..</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.exploreButton]}
            onPress={() => router.push("/explore")}
          >
            <Text style={styles.buttonText}>Explore Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  animatedCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    opacity: 0.8,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  // Home Screen
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#f0f0f0",
    marginTop: 10,
    textAlign: "center",
  },
  content: {
    flex: 0.5,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    width: width * 0.7,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  startButton: {
    backgroundColor: "indigo",
  },
  exploreButton: {
    backgroundColor: "green",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  hamburger: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: "#fff", // Light background
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drawerItemText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 15,
  },
});