import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function SingleFilter({ title, items, selectedItems, onItemPress }) {
  const [toggle, setToggle] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setToggle(!toggle)}
        style={styles.toggleButton}
      >
        <Text style={[styles.buttonText, { textAlign: "left" }]}>{title}</Text>
        <Text style={[styles.buttonText, { textAlign: "left" }]}>
          Current selection:{" "}
          {selectedItems.length > 0 ? selectedItems.join(", ") : "None Applied"}
        </Text>
      </TouchableOpacity>
      {toggle && (
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <TouchableOpacity key={item} onPress={() => onItemPress(item)}>
              <Text
                style={
                  selectedItems.includes(item)
                    ? styles.textEnabled
                    : styles.textDisabled
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    padding: 5,
  },
  toggleButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
    margin: 1,
  },
  itemsContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: "#f9f9f9",
    alignItems: "flex-start",
  },
  textEnabled: {
    color: "black",
  },
  textDisabled: {
    color: "grey",
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

export default SingleFilter;
