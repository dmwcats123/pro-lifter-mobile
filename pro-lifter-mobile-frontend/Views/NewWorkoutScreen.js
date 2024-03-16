import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { REACT_NATIVE_API_BASE_URL } from "@env";
import CustomBackButton from "../Components/BackButton";
import ExerciseModal from "../Components/ExerciseModal";
import ContextMenu from "../Components/ContextMenu";
const NewWorkoutScreen = ({ route, navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutID, setWorkoutID] = useState(null);
  const [isNewTemplate, setIsNewTemplate] = useState(null);
  const [fromTemplate, setFromTemplate] = useState(null);

  useEffect(() => {
    let initialWorkout = [];
    if (route.params && route.params.workout) {
      const { workout } = route.params;
      setWorkoutID(workout._id);
      setWorkoutName(workout.workoutName);
      initialWorkout = workout.exercises;
    }

    if (route.params && route.params.isNewTemplate) {
      setIsNewTemplate(route.params.isNewTemplate);
    }
    if (route.params && route.params.fromTemplate) {
      setFromTemplate(route.params.fromTemplate);
      initialWorkout = initialWorkout.map((exercise) => ({
        ...exercise,
        isSaved: false,
      }));
    }
    setWorkout(initialWorkout);
  }, [route.params]);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const addExercise = (exercise) => {
    let newExercise = {
      ...exercise,
    };

    if (
      exercise.category === "strength" ||
      exercise.category === "strongman" ||
      exercise.category === "powerlifting"
    ) {
      newExercise = {
        ...newExercise,
        weightPerSet: ["0"], // Default weight value
        repsPerSet: ["0"], // Default reps value
      };
    } else if (exercise.category === "cardio") {
      newExercise = {
        ...newExercise,
        duration: "0", // Default duration value
        distance: "0", // Default distance value
      };
    }
    newExercise = {
      ...newExercise,
      isSaved: false,
    };
    if (newExercise.category === "stretching") {
      newExercise.isSaved = true;
    }
    setWorkout((prevWorkout) => [...prevWorkout, newExercise]);
  };
  const addSet = (index) => {
    const newWorkout = [...workout];
    newWorkout[index].weightPerSet.push("0");
    newWorkout[index].repsPerSet.push("0");
    setWorkout(newWorkout);
  };

  const handleWeightChange = (text, exerciseIndex, setIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].weightPerSet[setIndex] = text;
    newWorkout[exerciseIndex].isSaved = false;
    setWorkout(newWorkout);
  };

  const handleRepsChange = (text, exerciseIndex, setIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].repsPerSet[setIndex] = text;
    newWorkout[exerciseIndex].isSaved = false;
    setWorkout(newWorkout);
  };

  const handleDurationChange = (text, exerciseIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].duration = text;
    newWorkout[exerciseIndex].isSaved = false;
    setWorkout(newWorkout);
  };

  const handleDistanceChange = (text, exerciseIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].distance = text;
    newWorkout[exerciseIndex].isSaved = false;
    setWorkout(newWorkout);
  };

  const deleteSet = (exerciseIndex, setIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].repsPerSet.splice(setIndex, 1);
    newWorkout[exerciseIndex].weightPerSet.splice(setIndex, 1);
    setWorkout(newWorkout);
  };

  const saveExercise = (exerciseIndex) => {
    const newWorkout = [...workout];
    let isValid = false;

    // Validate inputs
    if (
      newWorkout[exerciseIndex].category == "strength" ||
      newWorkout[exerciseIndex].category == "strongman" ||
      newWorkout[exerciseIndex].category == "powerlifting"
    ) {
      isValid =
        newWorkout[exerciseIndex].weightPerSet.every((weight) => weight > 0) &&
        newWorkout[exerciseIndex].repsPerSet.every((rep) => rep > 0);
    } else if (newWorkout[exerciseIndex].category == "cardio") {
      isValid = newWorkout[exerciseIndex].duration > 0;
    } else if (newWorkout[exerciseIndex].category == "stretching") {
      isValid = true;
    }

    if (isValid) {
      newWorkout[exerciseIndex].isSaved = true;
      setWorkout(newWorkout);
    } else {
      (newWorkout[exerciseIndex].category == "strength" ||
        newWorkout[exerciseIndex].category == "strongman" ||
        newWorkout[exerciseIndex].category == "powerlifting") &&
        alert("Weight and Reps must be a number greater than zero.");
      newWorkout[exerciseIndex].category == "cardio" &&
        alert("Duration must be a number greater than zero.");
    }
  };
  const editExercise = (exerciseIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex] = {
      ...newWorkout[exerciseIndex],
      isSaved: false,
    };
    setWorkout(newWorkout);
  };

  const deleteExercise = (exerciseIndex) => {
    const newWorkout = [...workout];
    newWorkout.splice(exerciseIndex, 1);
    setWorkout(newWorkout);
  };

  const saveWorkout = async () => {
    const isWorkoutComplete = workout.every((exercise) => exercise.isSaved);

    if (!isWorkoutComplete) {
      // If the workout is incomplete, display an error message to the user
      alert(
        "Please ensure all exercises are complete before saving the workout."
      );
      return; // Exit the function early
    }
    // Get the token from storage
    const token = await AsyncStorage.getItem("userToken");

    // Define the header and request method
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        workoutName: workoutName,
        exercises: workout,
        // Include the id only if updating (assuming id is not used for creating a new workout)
        ...(workoutID && !fromTemplate ? { id: workoutID } : {}),
      }),
    };

    // Conditional path based on whether you have a workout ID
    let path;
    if (isNewTemplate) {
      path = workoutID ? "UpdateTemplate" : "SaveTemplate";
    } else if (fromTemplate) {
      path = "SaveWorkout";
    } else {
      path = workoutID ? "UpdateWorkout" : "SaveWorkout";
    }
    fetch(`${REACT_NATIVE_API_BASE_URL}/${path}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // This parses the body of the response as JSON
      })
      .then((data) => {
        const workoutData = data.data;
        const newWorkout = { ...workoutData };

        // Check if the route.params has the callback, and if so, call it
        if (route.params?.onWorkoutAdded) {
          route.params.onWorkoutAdded(newWorkout);
        }

        navigation.goBack();
      })
      .catch((error) => {
        console.error(
          "There has been a problem with saving your workout: ",
          error
        );
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <CustomBackButton style={styles.backButton} navigation={navigation} />
      </View>

      <View style={styles.mainContent}>
        <TextInput
          style={
            workoutName != ""
              ? [styles.workoutNameInput]
              : [styles.workoutNameInput, styles.workoutNameInputPlaceholder]
          }
          placeholder={"Workout Name"}
          value={workoutName}
          onChangeText={(text) => setWorkoutName(text)}
          keyboardType="default"
        />

        <View>
          <FlashList
            data={workout}
            renderItem={({ item: exercise, index: exerciseIndex }) => (
              <View style={styles.exerciseItem}>
                <View
                  style={[
                    styles.exerciseHeader,
                    { marginBottom: !exercise.isSaved ? 10 : 0 },
                  ]}
                >
                  <Text style={[styles.exerciseName]}>{exercise.name}</Text>

                  {exercise.isSaved && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {(exercise.category == "strength" ||
                        exercise.category == "powerlifting" ||
                        exercise.category == "strongman") && (
                        <>
                          <Text style={{ marginLeft: 10 }}>
                            Sets: {exercise.repsPerSet.length}
                          </Text>
                          <Text>
                            Reps:{" "}
                            {exercise.repsPerSet.reduce(
                              (total, rep) => total + Number(rep),
                              0
                            )}
                          </Text>
                        </>
                      )}
                      {exercise.category == "cardio" && (
                        <>
                          <Text style={{ marginLeft: 10 }}>
                            Duration: {exercise.duration}
                          </Text>
                          <Text>Distance: {exercise.distance}</Text>
                        </>
                      )}
                      {exercise.category == "stretching" && (
                        <Text style={{ marginLeft: 10 }}>Stretch Complete</Text>
                      )}
                    </View>
                  )}

                  <ContextMenu
                    onEdit={() => editExercise(exerciseIndex)}
                    onDelete={() => deleteExercise(exerciseIndex)}
                    isSaved={exercise.isSaved}
                  />
                </View>
                {!exercise.isSaved && (
                  <View style={{ width: "100%" }}>
                    {(exercise.category == "strength" ||
                      exercise.category == "strongman" ||
                      exercise.category == "powerlifting") && (
                      <>
                        <FlashList
                          data={exercise.repsPerSet}
                          renderItem={({ item: reps, index: setIndex }) => (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                height: 40,
                                marginBottom: 5,
                              }}
                            >
                              <Text
                                style={{
                                  textAlignVertical: "center",
                                  marginRight: 5,
                                  marginLeft: 5,
                                }}
                              >
                                Weight:
                              </Text>

                              <TextInput
                                style={styles.input}
                                value={
                                  workout[exerciseIndex].weightPerSet[
                                    setIndex
                                  ] == 0
                                    ? ""
                                    : workout[exerciseIndex].weightPerSet[
                                        setIndex
                                      ].toString()
                                }
                                onChangeText={(text) =>
                                  handleWeightChange(
                                    text,
                                    exerciseIndex,
                                    setIndex
                                  )
                                }
                                keyboardType="numeric"
                              />
                              <Text
                                style={{
                                  textAlignVertical: "center",
                                  marginRight: 5,
                                  marginLeft: 5,
                                }}
                              >
                                Reps:
                              </Text>
                              <TextInput
                                style={styles.input}
                                value={
                                  workout[exerciseIndex].repsPerSet[setIndex] ==
                                  0
                                    ? ""
                                    : workout[exerciseIndex].repsPerSet[
                                        setIndex
                                      ].toString()
                                }
                                onChangeText={(text) =>
                                  handleRepsChange(
                                    text,
                                    exerciseIndex,
                                    setIndex
                                  )
                                }
                                keyboardType="numeric"
                              />
                              <TouchableOpacity
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: 20,
                                  width: 20,
                                }}
                                onPress={() =>
                                  deleteSet(exerciseIndex, setIndex)
                                }
                              >
                                <Image
                                  source={require("../assets/delete.png")}
                                  style={styles.buttonImage}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </>
                    )}
                    {exercise.category == "cardio" && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          height: 40,
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            textAlignVertical: "center",
                            marginRight: 5,
                            marginLeft: 5,
                          }}
                        >
                          Duration:
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={
                            workout[exerciseIndex].duration == 0
                              ? ""
                              : workout[exerciseIndex].duration
                          }
                          onChangeText={(text) =>
                            handleDurationChange(text, exerciseIndex)
                          }
                          keyboardType="numeric"
                        />
                        <Text
                          style={{
                            textAlignVertical: "center",
                            marginRight: 5,
                            marginLeft: 5,
                          }}
                        >
                          Distance:
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={
                            workout[exerciseIndex].distance == 0
                              ? ""
                              : workout[exerciseIndex].distance
                          }
                          onChangeText={(text) =>
                            handleDistanceChange(text, exerciseIndex)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    )}
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      {(exercise.category == "strength" ||
                        exercise.category == "strongman" ||
                        exercise.category == "powerlifting") && (
                        <TouchableOpacity
                          onPress={() => addSet(exerciseIndex)}
                          style={[
                            styles.button,
                            {
                              width: "50%",
                              alignSelf: "center",
                              backgroundColor: "#808080",
                            },
                          ]}
                        >
                          <Text style={styles.buttonText}>Add Set</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={[
                          styles.button,
                          {
                            width: "50%",
                            alignSelf: "center",
                            backgroundColor: "#808080",
                          },
                        ]}
                        onPress={() => saveExercise(exerciseIndex)}
                      >
                        <Text style={styles.buttonText}>Save Exercise!</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Add an exercise!</Text>
          </TouchableOpacity>
        </View>
        <ExerciseModal
          isVisible={isVisible}
          onClose={toggleModal}
          addExercise={addExercise}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            saveWorkout();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isNewTemplate
              ? "Save Template!"
              : workoutID && !fromTemplate
              ? "Update workout"
              : "Log current Workout!"}
          </Text>
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
    width: 60,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
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
  textContainer: {
    flex: 1, // Take as much space as possible
    marginRight: 10, // Optional: add some space between text and button
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1, // Allows this view to exp and and push the button down
  },
  footer: {
    marginBottom: 10, // Optional: adds some space at the bottom
  },
  buttonImage: {
    height: "100%",
    width: "100%",
    resizeMode: "center",
  },
  exerciseItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: "#f9f9f9",
    alignItems: "flex-start",
  },
  exerciseHeader: {
    flexDirection: "row", // Organize child components in a row
    justifyContent: "space-between", // Space between exerciseName and edit button
    alignItems: "center", // Align items vertically in the center
    width: "100%", // Take the full width of the parent component
  },
  workoutNameInput: {
    fontSize: 30, // Larger font size
    fontWeight: "bold", // Bold font weight
    borderBottomWidth: 1, // Only a bottom border
    borderBottomColor: "gray", // Border color
    marginBottom: 20, // More margin at the bottom
    width: "100%", // Full width
    paddingHorizontal: 5, // Some padding on the sides
  },
  workoutNameInputPlaceholder: {
    fontStyle: "italic",
    color: "gray",
  },
});

export default NewWorkoutScreen;
