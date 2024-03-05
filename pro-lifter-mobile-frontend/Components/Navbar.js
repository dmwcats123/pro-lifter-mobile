import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
const Navbar = ({ navigation }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.navItem}
      >
        <Text>Home</Text>
        <AntDesign name="home" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Graphs")}
        style={styles.navItem}
      >
        <Text>Graphs</Text>
        <AntDesign name="linechart" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text>Analysis</Text>
        <FontAwesome5 name="dumbbell" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text>Go</Text>
        <Text>Premium!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#a3c4f3",
    alignSelf: "stretch",
    padding: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
});

export default Navbar;
