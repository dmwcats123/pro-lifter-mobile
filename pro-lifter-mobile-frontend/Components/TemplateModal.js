import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_NATIVE_API_BASE_URL } from "@env";
const numColumns = 2; // for example, change as per your design

const WorkoutTemplateModal = ({
  navigation,
  isVisible,
  onClose,
  templates,
}) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => onSelectTemplate(item)}
    >
      <Text style={styles.templateTitle}>{item.workoutName}</Text>
      <View style={styles.exercisesList}>
        {item.exercises.map((exercise, index) => (
          <Text
            key={index}
            style={styles.exerciseText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {exercise.name}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  const closeOnOverlayPress = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  const createNewTemplate = () => {
    navigation.navigate("NewWorkout", {
      workout: null,
      isNewTemplate: true,
    });
    onClose();
  };

  const onSelectTemplate = (template) => {
    navigation.navigate("NewWorkout", {
      workout: template,
      fromTemplate: true,
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill} // This covers the entire screen
          activeOpacity={1}
          onPress={onClose} // Close the modal when the overlay is pressed
        />
        <View style={styles.modalView}>
          {templates && (
            <FlatList
              data={templates}
              renderItem={renderItem}
              numColumns={numColumns} // Define how many columns the grid should have
              keyExtractor={(item, index) => String(index)} // Add this line if your items don't have a 'key' or 'id' field
            />
          )}

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => createNewTemplate()}
          >
            <Text style={styles.createButtonText}>Create New Template</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.startBlankButton}
            onPress={() => {
              navigation.navigate("NewWorkout");
              onClose();
            }}
          >
            <Text style={styles.startBlankButtonText}>Start Blank Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%", // Make the modal take up 90% of the screen width
    maxHeight: "80%", // Make the modal take up to 80% of the screen height
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25, // Increase padding to give more space inside the modal
    alignItems: "stretch", // Stretch items to use full width
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  templateItem: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    margin: 10, // Consistent spacing around items
    justifyContent: "center",
    alignItems: "center",
    height: 150, // Fixed height for each grid item
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    // Dynamic calculation of item width based on modal width and number of columns
    width:
      (Dimensions.get("window").width * 0.9) / numColumns -
      (20 + 10 * (numColumns - 1)),
    overflow: "hidden", // Hide overflow
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  exercisesList: {
    alignSelf: "stretch",
    marginTop: 8,
  },
  exerciseText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
    marginBottom: 2,
    overflow: "hidden",
  },
  createButton: {
    backgroundColor: "#34C759",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignSelf: "center",
    marginTop: 15,
    width: "80%", // Consistent with modal width style
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  startBlankButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignSelf: "center",
    marginTop: 15,
    width: "80%", // Consistent with modal width style
  },
  startBlankButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default WorkoutTemplateModal;
