import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { REACT_NATIVE_API_BASE_URL } from "@env";
import LogoutButton from "../Components/LogoutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WorkoutModal from "../Components/WorkoutModal";
import ContextMenu from "../Components/ContextMenu";
import { useFocusEffect } from "@react-navigation/native";
import TemplateModal from "../Components/TemplateModal";
import Navbar from "../Components/Navbar";
import { FlashList } from "@shopify/flash-list";

const HomeScreen = ({ route, navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [workoutModalData, setWorkoutModalData] = useState({});
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [templates, setTemplates] = useState(null);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const updateWorkoutsAndTemplates = async () => {
        const token = await AsyncStorage.getItem("userToken");
        setLoadingWorkouts(true);
        if (!route.params?.newWorkout) {
          setWorkouts(
            await fetchData(`${REACT_NATIVE_API_BASE_URL}/workouts`, token)
          );
        }
        setLoadingWorkouts(false);

        setTemplates(
          await fetchData(`${REACT_NATIVE_API_BASE_URL}/templates`, token)
        );
      };
      updateWorkoutsAndTemplates();
    }, [route.params?.newWorkout])
  );

  const fetchData = async (url, token) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    return url == `${REACT_NATIVE_API_BASE_URL}/workouts`
      ? data.workouts
      : data.templates;
  };

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
      // might want to display an error message to the user.
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
              onWorkoutAdded: (newWorkout) => {
                setWorkouts((currentWorkouts) => [
                  newWorkout,
                  ...currentWorkouts,
                ]);
              },
            })
          }
          onDelete={() => deleteWorkout(item._id)} // pass the item's _id directly
          isSaved={true}
        />
      </View>
      <FlashList
        estimatedItemSize={50}
        data={item.exercises}
        renderItem={renderExercises}
      />
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
                (total, weight, index) =>
                  total + Number(weight) * item.repsPerSet[index],
                0
              )}
            </Text>
          </>
        )}
      </View>
    </View>
  );
  return (
    <View style={styles.fullContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <LogoutButton />
        </View>

        {loadingWorkouts ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlashList
            estimatedItemSize={50}
            data={[...workouts].reverse()}
            renderItem={renderWorkouts}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={[styles.workoutList, { paddingBottom: 80 }]}
          />
        )}
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
      <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1, // Ensures the full container takes up the entire screen
    backgroundColor: "#f4f4f8",
  },
  container: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 40,
    backgroundColor: "#f4f4f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#a3c4f3",
    alignSelf: "stretch",
    padding: 1,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  workoutCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
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
