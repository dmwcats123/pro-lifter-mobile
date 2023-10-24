import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { REACT_NATIVE_API_BASE_URL } from "@env";
import CustomBackButton from "../Components/BackButton";
import LogoutButton from "../Components/LogoutButton";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <View>
          <LogoutButton />
        </View>
      </View>

      <View style={styles.topContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate("NewWorkout")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Start a new Workout!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  topContent: {
    alignItems: "flex-start",
    padding: 2,
    flexDirection: "row",
    justifyContent: "right",
    width: "100%",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
  },
});

export default LoginScreen;
