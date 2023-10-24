import React, { useContext } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../App.js";

const LogoutButton = () => {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext); // Accessing signOut function from AuthContext

  const handleLogout = async () => {
    try {
      await signOut(); // Calling signOut function from AuthContext
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50", // or any color you prefer
    paddingHorizontal: 10, // Horizontal padding
    paddingVertical: 5, // Vertical padding
    borderRadius: 5, // Rounded corners
    alignSelf: "flex-start", // Align to the start of parent view
  },
  buttonText: {
    color: "#FFFFFF", // White text color
    fontSize: 16, // Font size
  },
});
export default LogoutButton;

// ... (your styles and export statements remain unchanged)
