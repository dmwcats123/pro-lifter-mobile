import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

function SingleExerciseModal({ exercise, isVisible, onClose, addExercise }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.instructions}>{exercise.instructions}</Text>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                addExercise(exercise);
                onClose;
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Add!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Adds a dim background
  },
  modalContent: {
    width: "80%", // or any value or maxWidth that suits your design
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center", // Center the content horizontally
  },
  header: {
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: 100, // Adjust the width of the button
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
  },
});

export default SingleExerciseModal;
