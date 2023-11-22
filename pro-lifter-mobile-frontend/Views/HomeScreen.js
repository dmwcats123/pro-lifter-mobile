import React, { useCallback, useState } from "react";
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
import WorkoutModal from "../Components/WorkoutModal";
import ContextMenu from "../Components/ContextMenu";
import { useFocusEffect } from "@react-navigation/native";
import TemplateModal from "../Components/TemplateModal";

const HomeScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [workoutModalData, setWorkoutModalData] = useState({});
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [templates, setTemplates] = useState(null);

  // useEffect(() => {
  //   console.log(workoutModalData);
  // }, [workoutModalData]);

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

  const getTemplates = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/templates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    setTemplates(data.templates);
  };

  useFocusEffect(
    useCallback(() => {
      getWorkouts();
      getTemplates();
      return () => {
        setWorkouts([]);
        setTemplates([]);
      };
    }, [])
  );

  const deleteWorkout = async (workoutId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/workouts/${workoutId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the workout.");
      }

      const data = await response.json();

      if (data.success) {
        setWorkouts((currentWorkouts) =>
          currentWorkouts.filter((workout) => workout._id !== workoutId)
        );
      }
    } catch (error) {
      console.error(error);
      // You might want to display an error message to the user.
    }
  };

  const renderWorkouts = ({ item, index }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => {
        setWorkoutModalData(item);
        setWorkoutModalVisible(true);
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.workoutTitle}>{item.workoutName}</Text>
        <ContextMenu
          onEdit={() =>
            navigation.navigate("NewWorkout", {
              workout: item,
            })
          }
          onDelete={() => deleteWorkout(item._id)} // pass the item's _id directly
          isSaved={true}
        />
      </View>
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
      <FlatList
        data={workouts}
        renderItem={renderWorkouts}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={[styles.workoutList, { paddingBottom: 80 }]}
        style={{ flex: 1 }}
      />
      <TouchableOpacity
        onPress={() => setTemplateModalVisible(true)}
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>Start a new Workout!</Text>
      </TouchableOpacity>
      <WorkoutModal
        isVisible={workoutModalVisible}
        onClose={() => setWorkoutModalVisible(false)}
        workout={workoutModalData}
      />
      <TemplateModal
        navigation={navigation}
        isVisible={templateModalVisible}
        onClose={() => setTemplateModalVisible(false)}
        templates={templates}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
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
  startButton: {
    position: "absolute", // Add absolute positioning
    bottom: 10, // Distance from the bottom of the screen
    left: 10, // Distance from the left side of the screen
    right: 10, // Distance from the right side of the screen
    backgroundColor: "#34C759",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
