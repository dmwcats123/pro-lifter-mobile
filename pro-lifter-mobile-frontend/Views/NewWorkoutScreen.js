import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { REACT_NATIVE_API_BASE_URL } from "@env";
import CustomBackButton from "../Components/BackButton";
import ExerciseModal from "../Components/ExerciseModal";
import Excercise from "../Models/excercise";

const NewWorkoutScreen = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [workout, setWorkout] = useState([]);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const addExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      weightPerSet: ["0"], // Default weight value
      repsPerSet: ["0"], // Add any other attributes you need here
    };
    console.log(newExercise);
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
    setWorkout(newWorkout);
  };

  const handleRepsChange = (text, exerciseIndex, setIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].repsPerSet[setIndex] = text;
    setWorkout(newWorkout);
  };

  const deleteSet = (exerciseIndex, setIndex) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].repsPerSet.splice(setIndex, 1);
    newWorkout[exerciseIndex].weightPerSet.splice(setIndex, 1);
    setWorkout(newWorkout);
  };

  const saveWorkout = () => {
    
  }
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <CustomBackButton style={styles.backButton} navigation={navigation} />
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add an Excercise!</Text>
        </TouchableOpacity>
        <View>
          <FlatList
            data={workout}
            renderItem={({ item, index: exerciseIndex }) => (
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <FlatList
                  data={item.repsPerSet}
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
                          workout[exerciseIndex].weightPerSet[setIndex] == 0
                            ? ""
                            : workout[exerciseIndex].weightPerSet[setIndex]
                        }
                        onChangeText={(text) =>
                          handleWeightChange(text, exerciseIndex, setIndex)
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
                          workout[exerciseIndex].repsPerSet[setIndex] == 0
                            ? ""
                            : workout[exerciseIndex].weightPerSet[setIndex]
                        }
                        onChangeText={(text) =>
                          handleRepsChange(text, exerciseIndex, setIndex)
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
                        onPress={() => deleteSet(exerciseIndex, setIndex)}
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
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <ExerciseModal
          isVisible={isVisible}
          onClose={toggleModal}
          addExercise={addExercise}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => saveWorkout(workout)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Log current Workout!</Text>
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
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
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
  textContainer: {
    flex: 1, // Take as much space as possible
    marginRight: 10, // Optional: add some space between text and button
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mainContent: {
    flex: 1, // Allows this view to expand and push the button down
  },
  footer: {
    marginBottom: 10, // Optional: adds some space at the bottom
  },
  buttonImage: {
    height: "100%",
    width: "100%",
    resizeMode: "center",
  },
});

export default NewWorkoutScreen;
