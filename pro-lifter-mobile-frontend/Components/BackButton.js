import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomBackButton = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
      <Text style={styles.buttonText}>Back</Text>
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

export default CustomBackButton;
