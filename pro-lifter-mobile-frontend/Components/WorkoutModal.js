import React, { useEffect } from "react";

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

function WorkoutModal({ isVisible, onClose, workout }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.workoutTitle}>{workout.workoutName}</Text>
          <FlatList
            data={workout.exercises}
            renderItem={({ item: exercise }) => (
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                {["strength", "strongman", "powerlifting"].includes(
                  exercise.category
                ) && (
                  <FlatList
                    data={exercise.repsPerSet}
                    renderItem={({ item: reps, index: setIndex }) => (
                      <View style={styles.repsRow}>
                        <Text style={styles.repsText}>
                          {exercise.weightPerSet[setIndex]}lbs x {reps}
                        </Text>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
                {exercise.category == "cardio" && (
                  <>
                    <Text style={styles.repsText}>
                      Distance: {exercise.distance}
                    </Text>
                    <Text style={styles.repsText}>
                      Duration: {exercise.duration}
                    </Text>
                  </>
                )}
              </View>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center", // Centers modal content vertically in safe area
    alignItems: "center", // Centers modal content horizontally in safe area
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch", // Ensures content stretches to the modal's padding
    maxWidth: "90%", // Limits how wide the modal can be
    maxHeight: Dimensions.get("window").height * 0.8, // Makes sure modal is not too tall
    width: 350, // Can be removed if you want to use maxWidth as the defining width
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  exerciseItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseCategory: {
    fontSize: 15,
    color: "#666",
    marginTop: 5,
  },
  repsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  repsText: {
    fontSize: 15,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#E74C3C",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutModal;
