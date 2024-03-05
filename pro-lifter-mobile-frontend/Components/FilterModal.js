import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import SingleFilter from "./SingleFilter";
import { REACT_NATIVE_API_BASE_URL } from "@env";

function FilterModal({ isVisible, onClose, onFiltersChange, selectedFilters }) {
  const workoutTypes = [
    "stretching",
    "cardio",
    "strength",
    "strongman",
    "plyometrics",
    "powerlifting",
  ];
  const equipmentTypes = [
    "machine",
    "dumbbell",
    "barbell",
    "kettlebells",
    "foam roller",
    "body only",
  ];
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [selectedWorkoutTypes, setSelectedWorkoutTypes] = useState([]);
  const [selectedEquipmentTypes, setSelectedEquipmentTypes] = useState([]);

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch(REACT_NATIVE_API_BASE_URL + "/muscles");
        const data = await response.json();

        setMuscleGroups(data);
      } catch (error) {
        console.error("Error fetching exercises: ", error);
      }
    };

    selectedFilters.equipmentType &&
      setSelectedEquipmentTypes(selectedFilters.equipmentType);
    selectedFilters.primaryMuscle &&
      setSelectedMuscleGroups(selectedFilters.primaryMuscle);
    selectedFilters.workoutType &&
      setSelectedWorkoutTypes(selectedFilters.workoutType);

    fetchMuscleGroups();
  }, [selectedMuscleGroups]);

  const workoutFilterClicked = (workoutType) => {
    setSelectedWorkoutTypes((prevWorkoutTypes) =>
      prevWorkoutTypes.includes(workoutType)
        ? prevWorkoutTypes.filter((t) => t !== workoutType)
        : [...prevWorkoutTypes, workoutType]
    );
    onFiltersChange("workoutType", workoutType);
  };

  const equipmentFilterClicked = (equipmentType) => {
    setSelectedEquipmentTypes((prevEquipmentTypes) =>
      prevEquipmentTypes.includes(equipmentType)
        ? prevEquipmentTypes.filter((t) => t !== equipmentType)
        : [...prevEquipmentTypes, equipmentType]
    );
    onFiltersChange("equipmentType", equipmentType);
  };

  const muscleFilterClicked = (muscleGroup) => {
    setSelectedMuscleGroups((prevMuscleGroups) =>
      prevMuscleGroups.includes(muscleGroup)
        ? prevMuscleGroups.filter((t) => t !== muscleGroup)
        : [...prevMuscleGroups, muscleGroup]
    );
    onFiltersChange("primaryMuscle", muscleGroup);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView style={{ flex: 1 }}>
            <SingleFilter
              title="Workout Type"
              items={workoutTypes}
              selectedItems={selectedWorkoutTypes}
              onItemPress={workoutFilterClicked}
            />
            <SingleFilter
              title="Equipment Type"
              items={equipmentTypes}
              selectedItems={selectedEquipmentTypes}
              onItemPress={equipmentFilterClicked}
            />
            <SingleFilter
              title="Muscle Groups"
              items={muscleGroups}
              selectedItems={selectedMuscleGroups}
              onItemPress={muscleFilterClicked}
            />
            {/* ... other filters */}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
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
  },
  modalContent: {
    maxWidth: "90%",
    minHeight: "65%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10, // Add padding
  },
  textDisabled: {
    color: "grey",
    opacity: 0.5,
  },
  textEnabled: {
    color: "black",
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

export default FilterModal;
