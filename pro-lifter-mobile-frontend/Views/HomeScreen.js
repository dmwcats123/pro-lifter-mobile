import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { REACT_NATIVE_API_BASE_URL } from "@env";
import LogoutButton from "../Components/LogoutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);

  const getWorkouts = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/workouts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    setWorkouts(data.workouts);
  };

  useEffect(() => {
    getWorkouts();
  }, []);

  const renderWorkouts = ({ item }) => (
    <TouchableOpacity style={styles.workoutCard}>
      <Text style={styles.workoutTitle}>{item.workoutName}</Text>
      <FlatList data={item.exercises} renderItem={renderExercises} />
    </TouchableOpacity>
  );

  const renderExercises = ({ item }) => (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <View style={styles.exerciseDetails}>
        {item.category == "cardio" && (
          <>
            <Text style={styles.detailText}>Duration: {item.duration}</Text>
            <Text style={styles.detailText}>Distance: {item.distance}</Text>
          </>
        )}
        {item.category == "strength" && (
          <>
            <Text style={styles.detailText}>
              Reps:{" "}
              {item.repsPerSet.reduce((total, rep) => total + Number(rep), 0)}
            </Text>
            <Text style={styles.detailText}>
              Volume:{" "}
              {item.weightPerSet.reduce(
                (total, weight) => total + Number(weight),
                0
              )}
            </Text>
          </>
        )}
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LogoutButton />
      </View>
      <View style={{ flex: 1, alignSelf: "center", width: "67.5%" }}>
        <FlatList
          data={workouts}
          renderItem={renderWorkouts}
          contentContainerStyle={styles.workoutList}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("NewWorkout")}
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>Start a new Workout!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#f4f4f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  workoutCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseLabel: {
    color: "#666",
    marginLeft: 5,
  },
  startButton: {
    backgroundColor: "#34C759",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#333",
  },
  exerciseDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginRight: 10, // added some margin for spacing between details
  },
});

export default HomeScreen;
