import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { REACT_NATIVE_API_BASE_URL } from "@env";
import CustomBackButton from "../Components/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../App.js";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { signIn } = useContext(AuthContext);

  // Call signIn() when the user successfully logs in.

  const handleLogin = () => {
    fetch(`${REACT_NATIVE_API_BASE_URL}/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.token) {
          await AsyncStorage.setItem("userToken", data.token);
          signIn(data.token);
        } else {
          setLoginError("Login failed. Please try again.");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <CustomBackButton style={styles.backButton} navigation={navigation} />
      </View>

      <View style={styles.centeredContent}>
        <Text style={styles.title}>Welcome to Lifter Pro</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => handleLogin()} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {loginError && <Text>{loginError}</Text>}
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
