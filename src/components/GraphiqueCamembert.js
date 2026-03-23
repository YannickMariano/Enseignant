import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function GraphiqueCamembert({ enseignants }) {
  if (enseignants.length === 0) return null;

  const total = enseignants.reduce(
    (sum, e) => sum + parseFloat(e.prestation),
    0,
  );
  const min = Math.min(...enseignants.map((e) => parseFloat(e.prestation)));
  const max = Math.max(...enseignants.map((e) => parseFloat(e.prestation)));
  const autre = total - min - max;

  const data = [
    {
      name: "Maximum",
      population: max,
      color: "#4CAF50",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Minimum",
      population: min,
      color: "#f44336",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Autres",
      population: autre > 0 ? autre : 0.01,
      color: "#2196F3",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Répartition des Prestations</Text>
      <PieChart
        data={data}
        width={screenWidth - 20}
        height={200}
        chartConfig={{ color: (opacity = 1) => `rgba(0,0,0,${opacity})` }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <View style={styles.legend}>
        <Text style={styles.legendItem}>🟢 Max : {max.toFixed(2)}</Text>
        <Text style={styles.legendItem}>🔴 Min : {min.toFixed(2)}</Text>
        <Text style={styles.legendItem}>🔵 Total : {total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  legendItem: { fontSize: 12, color: "#555" },
});
