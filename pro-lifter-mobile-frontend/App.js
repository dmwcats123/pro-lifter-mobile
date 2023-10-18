import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import LoginScreen from "./Components/LoginScreen.js";
import SignUpScreen from "./Components/SignUpScreen.js";
const Stack = createStackNavigator();

function SplashScreen({ navigation }) {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Lifter Pro</Text>
      <Text style={styles.splashSubtitle}>Track Workouts and Nutrition</Text>
      <Button
        title="Log In"
        onPress={() => {
          navigation.navigate("Login");
        }}
      />
      <Text>Not a member yet?</Text>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Text style={styles.signupButtonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  return (
    <View>
      <Text>Welcome to Home!</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeAreaContainer}>
        <Stack.Navigator initialRouteName="Splash" headerMode="none">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  splashContainer: {
    flex: 1,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  splashText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  splashSubtitle: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 100, // or any width that you want
    borderRadius: 5,
  },
  signupButtonText: {
    color: "#007AFF",
  },
});
