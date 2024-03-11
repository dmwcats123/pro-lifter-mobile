// src/components/FinanceLineChart.js
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

function ExerciseGraph({ title, data, labels }) {
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,

    fillShadowGradient: "#DF5353",
    fillShadowGradientOpacity: 0,
    color: (opacity = 1) => `#023047`,
    labelColor: (opacity = 1) => `#333`,
    strokeWidth: 2,

    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text>{title}</Text>
      </View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
  },
});

export default ExerciseGraph;
