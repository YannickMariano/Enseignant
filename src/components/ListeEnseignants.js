import React, { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ListeEnseignants({
  enseignants,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  // ✅ useRef garde la dernière valeur même quand on ferme le modal
  const confirmItemRef = useRef(null);

  const total = enseignants.reduce(
    (sum, e) => sum + Number(e.prestation ?? 0),
    0,
  );
  const min =
    enseignants.length > 0
      ? Math.min(...enseignants.map((e) => Number(e.prestation ?? 0)))
      : 0;
  const max =
    enseignants.length > 0
      ? Math.max(...enseignants.map((e) => Number(e.prestation ?? 0)))
      : 0;

  const fmt = (n) =>
    Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 2 });

  const openConfirm = (item) => {
    confirmItemRef.current = item; // ✅ stocker avant d'ouvrir
    setConfirmVisible(true);
  };

  const closeConfirm = () => {
    setConfirmVisible(false);
    // ✅ Ne pas effacer confirmItemRef ici — attendre après la fermeture
  };

  const handleDelete = () => {
    if (confirmItemRef.current) {
      onDelete(confirmItemRef.current.matricule);
    }
    setConfirmVisible(false);
  };

  const renderItem = ({ item, index }) => (
    <View
      style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
    >
      <Text style={[styles.cell, styles.cMatricule]} numberOfLines={1}>
        {item.matricule}
      </Text>
      <Text style={[styles.cell, styles.cNom]} numberOfLines={1}>
        {item.nom}
      </Text>
      <Text style={[styles.cell, styles.cNum]}>{fmt(item.taux_horaire)}</Text>
      <Text style={[styles.cell, styles.cNum]}>{fmt(item.nombre_heures)}</Text>
      <Text style={[styles.cell, styles.cPrestation]}>
        {fmt(item.prestation)}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(item)}>
          <Text style={styles.btnEditText}>Mod.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDel}
          onPress={() => openConfirm(item)}
        >
          <Text style={styles.btnDelText}>Sup.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header + bouton Ajouter */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Liste des enseignants</Text>
        <TouchableOpacity style={styles.btnAdd} onPress={onAdd}>
          <Text style={styles.btnAddText}>＋ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* En-tête tableau */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.cMatricule, styles.headerText]}>
          Matricule
        </Text>
        <Text style={[styles.cell, styles.cNom, styles.headerText]}>Nom</Text>
        <Text style={[styles.cell, styles.cNum, styles.headerText]}>Taux</Text>
        <Text style={[styles.cell, styles.cNum, styles.headerText]}>
          Heures
        </Text>
        <Text style={[styles.cell, styles.cPrestation, styles.headerText]}>
          Prestation
        </Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Données */}
      <FlatList
        data={enseignants}
        keyExtractor={(item) => item.matricule}
        renderItem={renderItem}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Aucun enseignant enregistré</Text>
            <Text style={styles.emptyHint}>
              Appuyez sur "＋ Ajouter" pour commencer
            </Text>
          </View>
        }
      />

      {/* Stats en bas */}
      {enseignants.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL</Text>
            <Text style={[styles.statValue, { color: "#3F51B5" }]}>
              {fmt(total)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MINIMUM</Text>
            <Text style={[styles.statValue, { color: "#e53935" }]}>
              {fmt(min)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MAXIMUM</Text>
            <Text style={[styles.statValue, { color: "#43a047" }]}>
              {fmt(max)}
            </Text>
          </View>
        </View>
      )}

      {/* ✅ Modal confirmation — lit depuis le ref, jamais null */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={closeConfirm}
      >
        <View style={styles.overlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmIcon}>🗑️</Text>
            <Text style={styles.confirmTitle}>Supprimer cet enseignant ?</Text>
            {/* ✅ Lecture depuis le ref — toujours disponible */}
            <Text style={styles.confirmName}>
              {confirmItemRef.current?.nom}
            </Text>
            <Text style={styles.confirmSub}>
              Cette action est irréversible.
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity
                style={styles.confirmBtnCancel}
                onPress={closeConfirm}
              >
                <Text style={styles.confirmBtnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtnDelete}
                onPress={handleDelete}
              >
                <Text style={styles.confirmBtnDeleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: "hidden",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    paddingBottom: 10,
  },
  topTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a2e" },
  btnAdd: {
    backgroundColor: "#3F51B5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnAddText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  header: {
    backgroundColor: "#3F51B5",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  headerText: { color: "#fff", fontWeight: "700", fontSize: 11 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowEven: { backgroundColor: "#fff" },
  rowOdd: { backgroundColor: "#F8F9FF" },
  cell: { fontSize: 12, color: "#333" },
  cMatricule: { width: 70 },
  cNom: { flex: 1 },
  cNum: { width: 55, textAlign: "right" },
  cPrestation: {
    width: 75,
    textAlign: "right",
    fontWeight: "600",
    color: "#3F51B5",
  },

  actions: {
    flexDirection: "row",
    width: 80,
    justifyContent: "flex-end",
    gap: 4,
  },
  btnEdit: {
    backgroundColor: "#E8EAF6",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnEditText: { fontSize: 11, color: "#3F51B5", fontWeight: "700" },
  btnDel: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnDelText: { fontSize: 11, color: "#e53935", fontWeight: "700" },

  emptyBox: { padding: 40, alignItems: "center" },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 15, color: "#555", fontWeight: "600" },
  emptyHint: { fontSize: 12, color: "#aaa", marginTop: 4 },

  statsBar: {
    flexDirection: "row",
    backgroundColor: "#F0F2FF",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statCard: { flex: 1, alignItems: "center" },
  statLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statValue: { fontSize: 13, fontWeight: "800", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "#dde", marginVertical: 4 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    margin: 24,
    alignItems: "center",
    elevation: 10,
    minWidth: 280,
  },
  confirmIcon: { fontSize: 40, marginBottom: 12 },
  confirmTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a2e",
    textAlign: "center",
  },
  confirmName: {
    fontSize: 15,
    color: "#3F51B5",
    fontWeight: "700",
    marginTop: 6,
  },
  confirmSub: { fontSize: 12, color: "#999", marginTop: 4, marginBottom: 20 },
  confirmBtns: { flexDirection: "row", gap: 12, width: "100%" },
  confirmBtnCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
  },
  confirmBtnCancelText: { color: "#666", fontWeight: "600" },
  confirmBtnDelete: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#e53935",
    alignItems: "center",
  },
  confirmBtnDeleteText: { color: "#fff", fontWeight: "700" },
});
