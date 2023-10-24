import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import FilterModal from "./FilterModal";
import SingleExerciseModal from "./SingleExcercise";
function ExerciseModal({ isVisible, onClose, addExercise }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Define searchTerm state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [singleExerciseModalVisible, setSingleExerciseModalVisible] =
    useState(false);
  const [filters, setFilters] = useState({
    workoutType: null,
    equipmentType: null,
    primaryMuscle: null,
  });
  const [selectedExercise, setSelectedExercise] = useState(null);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://localhost:3000/exercises");
        const data = await response.json();

        setExercises(data.exercises);
      } catch (error) {
        console.error("Error fetching exercises: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
    console.log(filters);
  }, [filters]);

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const toggleSingleExcerciseModal = () => {
    setSingleExerciseModalVisible(!singleExerciseModalVisible);
  };

  const detailAddExercise = (exercise) => {
    addExercise(exercise);
    toggleSingleExcerciseModal();
    onClose();
  };

  const handleFiltersChange = (filterType, value) => {
    setFilters((prevFilters) => {
      if (
        filterType === "workoutType" ||
        filterType === "equipmentType" ||
        filterType === "primaryMuscle"
      ) {
        if (prevFilters[filterType]?.includes(value)) {
          // If value is already in the filter array, remove it
          return {
            ...prevFilters,
            [filterType]: prevFilters[filterType].filter(
              (type) => type !== value
            ),
          };
        } else {
          // If value is not in the filter array, add it
          return {
            ...prevFilters,
            [filterType]: [...(prevFilters[filterType] || []), value],
          };
        }
      } else {
        // If the filter type isn't recognized, return the previous filters unchanged
        return { ...prevFilters };
      }
    });
  };

  const filteredExercises = exercises.filter((exercise) => {
    return (
      (!filters.workoutType ||
        filters.workoutType.includes(exercise.category)) &&
      (!filters.equipmentType ||
        filters.equipmentType.includes(exercise.equipment)) &&
      (!filters.primaryMuscle ||
        filters.primaryMuscle.includes(exercise.primaryMuscles[0])) &&
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity onPress={toggleFilterModal}>
              <Image
                source={require("../assets/filter.png")}
                style={styles.filterIcon}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={{ flex: 1 }}>
              <FilterModal
                isVisible={filterModalVisible}
                onClose={toggleFilterModal}
                onFiltersChange={handleFiltersChange}
              />
              <FlatList
                data={filteredExercises}
                renderItem={({ item }) => (
                  <View style={styles.exerciseItem}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <View style={styles.textContainer}>
                        <Text style={styles.exerciseName}>{item.name}</Text>
                        <Text>{`\u2022 ${item.primaryMuscles} \u2022 ${item.category}`}</Text>
                      </View>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.smallButton}
                          onPress={() => {
                            setSelectedExercise(item);
                            setSingleExerciseModalVisible(true);
                          }}
                        >
                          <Text style={styles.buttonText}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.smallButton}
                          onPress={() => {
                            addExercise(item);
                            onClose();
                          }}
                        >
                          <Text style={styles.buttonText}>Quick Add</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {selectedExercise && (
                      <SingleExerciseModal
                        isVisible={singleExerciseModalVisible}
                        onClose={() => {
                          toggleSingleExcerciseModal();
                          setSelectedExercise(null); // Clear the selected exercise when modal is closed
                        }}
                        addExercise={detailAddExercise}
                        exercise={selectedExercise}
                      />
                    )}
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}

          <TouchableOpacity onPress={onClose} style={styles.button}>
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20, // Adjust the padding as per your preference
    maxWidth: "90%", // Adjust maximum width as per your preference
    maxHeight: "90%", // Adjust maximum height as per your preference
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  filterIcon: {
    height: 40,
    width: 40,
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
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  smallButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10, // Adjust the horizontal padding as per your preference
    paddingVertical: 3, // Adjust the vertical padding as per your preference
    borderRadius: 5,
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
    flexWrap: "wrap", // Ensure text wraps
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 75, // adjust the height as per your needs
  },
});

export default ExerciseModal;
