import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { getEnseignants } from "../../src/api/api";

const screenWidth = Dimensions.get("window").width;

const COLORS = [
  "#3F51B5",
  "#e53935",
  "#43a047",
  "#FB8C00",
  "#8E24AA",
  "#00ACC1",
  "#F06292",
  "#FFB300",
];

interface Enseignant {
  matricule: string;
  nom: string;
  taux_horaire: number;
  nombre_heures: number;
  prestation: number;
}

export default function ChartScreen() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const charger = useCallback(async () => {
    try {
      const res = await getEnseignants();
      setEnseignants(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recharge quand on revient sur cette page
  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await charger();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  if (enseignants.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Visualisation</Text>
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>Aucune donnée à afficher</Text>
          <Text style={styles.emptyHint}>
            Ajoutez des enseignants depuis l onglet Liste
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const total = enseignants.reduce(
    (sum, e) => sum + Number(e.prestation ?? 0),
    0,
  );
  const min = Math.min(...enseignants.map((e) => Number(e.prestation ?? 0)));
  const max = Math.max(...enseignants.map((e) => Number(e.prestation ?? 0)));
  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2 });

  // Données pour le camembert — une part par enseignant
  const pieData = enseignants.map((e, i) => ({
    name: e.nom.split(" ")[0], // Prénom seulement pour lisibilité
    population: Number(e.prestation ?? 0),
    color: COLORS[i % COLORS.length],
    legendFontColor: "#444",
    legendFontSize: 12,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Visualisation des Prestations</Text>
        <Text style={styles.headerSub}>{enseignants.length} enseignant(s)</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Carte camembert */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Répartition par enseignant</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute={false}
          />
        </View>

        {/* Cartes stats */}
        <Text style={styles.sectionTitle}>Statistiques globales</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: "#3F51B5" }]}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
            <Text style={[styles.statValue, { color: "#3F51B5" }]}>
              {fmt(total)}
            </Text>
            <Text style={styles.statUnit}>Ar</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#e53935" }]}>
            <Text style={styles.statEmoji}>📉</Text>
            <Text style={styles.statLabel}>MINIMUM</Text>
            <Text style={[styles.statValue, { color: "#e53935" }]}>
              {fmt(min)}
            </Text>
            <Text style={styles.statUnit}>Ar</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#43a047" }]}>
            <Text style={styles.statEmoji}>📈</Text>
            <Text style={styles.statLabel}>MAXIMUM</Text>
            <Text style={[styles.statValue, { color: "#43a047" }]}>
              {fmt(max)}
            </Text>
            <Text style={styles.statUnit}>Ar</Text>
          </View>
        </View>

        {/* Détail par enseignant */}
        <Text style={styles.sectionTitle}>Détail par enseignant</Text>
        <View style={styles.card}>
          {enseignants.map((e, i) => {
            const prestation = Number(e.prestation ?? 0);
            const pct = total > 0 ? (prestation / total) * 100 : 0;
            return (
              <View key={e.matricule} style={styles.detailRow}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: COLORS[i % COLORS.length] },
                  ]}
                />
                <Text style={styles.detailNom} numberOfLines={1}>
                  {e.nom}
                </Text>
                <View style={styles.detailBarContainer}>
                  <View
                    style={[
                      styles.detailBar,
                      {
                        width: `${pct}%`,
                        backgroundColor: COLORS[i % COLORS.length],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.detailPct}>{pct.toFixed(1)}%</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F2FF" },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#3F51B5",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },
  scroll: { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 12,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderTopWidth: 4,
    elevation: 2,
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#999",
    letterSpacing: 0.8,
  },
  statValue: { fontSize: 15, fontWeight: "800", marginTop: 4 },
  statUnit: { fontSize: 10, color: "#aaa", marginTop: 2 },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  detailNom: { width: 80, fontSize: 12, color: "#333", fontWeight: "600" },
  detailBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  detailBar: { height: 8, borderRadius: 4 },
  detailPct: { width: 38, fontSize: 11, color: "#666", textAlign: "right" },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#555" },
  emptyHint: { fontSize: 13, color: "#aaa", marginTop: 8, textAlign: "center" },
});
