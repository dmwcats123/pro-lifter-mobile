import React, { useState, useEffect, createContext, useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
``;
export const AuthContext = createContext();

import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import LoginScreen from "./Views/LoginScreen.js";
import SignUpScreen from "./Views/SignUpScreen.js";
import NewWorkoutScreen from "./Views/NewWorkoutScreen.js";
import HomeScreen from "./Views/HomeScreen.js";

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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const restoreToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    setIsLoading(false);
    setUserToken(token);
  };

  useEffect(() => {
    restoreToken();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (token) => {
        setIsLoading(false);
        setUserToken(token);
        await AsyncStorage.setItem("userToken", token);
      },
      signOut: async () => {
        setIsLoading(false);
        setUserToken(null);
        await AsyncStorage.removeItem("userToken");
      },
    }),
    []
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <SafeAreaView style={styles.safeAreaContainer}>
          <Stack.Navigator initialRouteName="Splash" headerMode="none">
            {userToken == null ? (
              <>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} />
              </>
            )}
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </AuthContext.Provider>
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
