import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { REACT_NATIVE_API_BASE_URL } from "@env";
import ExerciseModal from "../Components/ExerciseModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../Components/Navbar";
import ExerciseGraph from "../Components/ExerciseGraph";
import RadioGroup from "react-native-radio-buttons-group";

const GraphScreen = ({ navigation }) => {
  const [selectionVisibility, setSelectionVisibility] = useState(false);
  const [exerciseData, setExcerciseData] = useState(null);
  const [volWeightId, setVolWeightId] = useState("vol");
  const [avgMaxId, setAvgMaxId] = useState("avg");
  const [selectedExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    const updateCharts = async () => {
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
              exerciseName: selectedExercise.name,
              volWeightId: volWeightId,
              avgMaxId: avgMaxId,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const rawData = await response.json();
          setExcerciseData(rawData.exerciseData);
          console.log(rawData.exerciseData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (selectedExercise != "") {
      updateCharts();
    }
  }, [selectedExercise, avgMaxId, volWeightId]);

  const radioButtonsOne = useMemo(
    () => [
      {
        id: "avg", // acts as primary key, should be unique and non-empty string
        label: "Average",
        value: "avg",
      },
      {
        id: "max",
        label: "Max       ",
        value: "max",
      },
    ],
    []
  );

  const radioButtonsTwo = useMemo(
    () => [
      {
        id: "weight", // acts as primary key, should be unique and non-empty string
        label: "Weight ",
        value: "weight",
      },
      {
        id: "vol",
        label: "Volume",
        value: "vol",
      },
    ],
    []
  );

  const addExercise = async (exercise) => {
    setSelectedExercise(exercise);
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectionVisibility(true)}
        >
          <Text style={styles.buttonText}>
            Select an exercise to view a graph of your progress!
          </Text>
        </TouchableOpacity>
        <View style={styles.radioContainer}>
          <RadioGroup
            radioButtons={radioButtonsOne}
            onPress={setAvgMaxId}
            selectedId={avgMaxId}
            layout="col"
          />
          <RadioGroup
            radioButtons={radioButtonsTwo}
            onPress={setVolWeightId}
            selectedId={volWeightId}
            layout="col"
          />
        </View>
      </View>
      <View style={styles.container}>
        {exerciseData != null && exerciseData.length > 1 && (
          <>
            <Text>{selectedExercise.name}</Text>
            <ExerciseGraph
              data={exerciseData.map((pair) => pair.data)}
              title={
                (avgMaxId == "avg" ? "Average " : "Max ") +
                (volWeightId == "vol" ? "Volume per Set" : "Weight per Rep")
              }
              labels={exerciseData.map((pair) => pair.workoutCreatedAt)}
            ></ExerciseGraph>
          </>
        )}
        {exerciseData != null && exerciseData.length <= 1 && (
          <Text>
            Insufficient data was found for {selectedExercise.name}! Please try
            again or add more data.
          </Text>
        )}
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
    marginTop: 15,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    padding: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
  },
});

export default GraphScreen;
