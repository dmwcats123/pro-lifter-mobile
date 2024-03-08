import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { REACT_NATIVE_API_BASE_URL } from "@env";
import ExerciseModal from "../Components/ExerciseModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../Components/Navbar";

const GraphScreen = ({ navigation }) => {
  const [selectionVisibility, setSelectionVisibility] = useState(false);
  const [exerciseData, setExcerciseData] = useState({});

  const addExercise = async (exercise) => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/SingleExerciseData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            exerciseName: exercise.name,
            volWeightId: "weight",
            avgMaxId: "avg",
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const rawData = await response.json();
        console.log(rawData.exerciseData);
        setExcerciseData(rawData.exerciseData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Graph Screen</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectionVisibility(true)}
        >
          <Text style={styles.buttonText}>
            Select an exercise to view a graph of your progress!
          </Text>
        </TouchableOpacity>
      </View>
      <ExerciseModal
        isVisible={selectionVisibility}
        onClose={() => setSelectionVisibility(false)}
        addExercise={addExercise}
      />
      <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    padding: 5,
  },
});

export default GraphScreen;
