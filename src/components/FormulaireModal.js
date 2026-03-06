import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function FormulaireModal({
  visible,
  onSubmit,
  enseignantEdit,
  onClose,
}) {
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [tauxHoraire, setTauxHoraire] = useState("");
  const [nombreHeures, setNombreHeures] = useState("");
  const [errors, setErrors] = useState({});

  const isEdit = !!enseignantEdit;

  useEffect(() => {
    if (enseignantEdit) {
      setMatricule(enseignantEdit.matricule);
      setNom(enseignantEdit.nom);
      setTauxHoraire(String(enseignantEdit.taux_horaire));
      setNombreHeures(String(enseignantEdit.nombre_heures));
    } else {
      resetForm();
    }
    setErrors({});
  }, [enseignantEdit, visible]);

  const resetForm = () => {
    setMatricule("");
    setNom("");
    setTauxHoraire("");
    setNombreHeures("");
  };

  const validate = () => {
    const e = {};
    if (!matricule.trim()) e.matricule = "Matricule requis";
    if (!nom.trim()) e.nom = "Nom requis";
    if (!tauxHoraire || isNaN(tauxHoraire)) e.tauxHoraire = "Taux invalide";
    if (!nombreHeures || isNaN(nombreHeures))
      e.nombreHeures = "Heures invalides";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      matricule: matricule.trim(),
      nom: nom.trim(),
      taux_horaire: parseFloat(tauxHoraire),
      nombre_heures: parseFloat(nombreHeures),
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kav}
        >
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerIcon}>{isEdit ? "✏️" : "➕"}</Text>
                <Text style={styles.headerTitle}>
                  {isEdit ? "Modifier enseignant" : "Nouvel enseignant"}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Matricule */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Matricule</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.matricule && styles.inputError,
                    isEdit && styles.inputDisabled,
                  ]}
                  placeholder="Ex: ENS001"
                  placeholderTextColor="#aaa"
                  value={matricule}
                  onChangeText={setMatricule}
                  editable={!isEdit}
                />
                {errors.matricule && (
                  <Text style={styles.errorText}>⚠ {errors.matricule}</Text>
                )}
              </View>

              {/* Nom */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                  style={[styles.input, errors.nom && styles.inputError]}
                  placeholder="Ex: Jean Dupont"
                  placeholderTextColor="#aaa"
                  value={nom}
                  onChangeText={setNom}
                />
                {errors.nom && (
                  <Text style={styles.errorText}>⚠ {errors.nom}</Text>
                )}
              </View>

              {/* Taux & Heures côte à côte */}
              <View style={styles.row2}>
                <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Taux horaire</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.tauxHoraire && styles.inputError,
                    ]}
                    placeholder="Ex: 15000"
                    placeholderTextColor="#aaa"
                    value={tauxHoraire}
                    onChangeText={setTauxHoraire}
                    keyboardType="decimal-pad"
                  />
                  {errors.tauxHoraire && (
                    <Text style={styles.errorText}>⚠ {errors.tauxHoraire}</Text>
                  )}
                </View>

                <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Nombre dheures</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.nombreHeures && styles.inputError,
                    ]}
                    placeholder="Ex: 40"
                    placeholderTextColor="#aaa"
                    value={nombreHeures}
                    onChangeText={setNombreHeures}
                    keyboardType="decimal-pad"
                  />
                  {errors.nombreHeures && (
                    <Text style={styles.errorText}>
                      ⚠ {errors.nombreHeures}
                    </Text>
                  )}
                </View>
              </View>

              {/* Aperçu prestation */}
              {tauxHoraire &&
                nombreHeures &&
                !isNaN(tauxHoraire) &&
                !isNaN(nombreHeures) && (
                  <View style={styles.preview}>
                    <Text style={styles.previewLabel}>
                      💰 Prestation calculée
                    </Text>
                    <Text style={styles.previewValue}>
                      {(
                        parseFloat(tauxHoraire) * parseFloat(nombreHeures)
                      ).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      Ar
                    </Text>
                  </View>
                )}

              {/* Boutons */}
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={handleClose}
                >
                  <Text style={styles.btnCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnSubmit}
                  onPress={handleSubmit}
                >
                  <Text style={styles.btnSubmitText}>
                    {isEdit ? "Modifier" : "Ajouter"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  kav: { width: "100%" },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerIcon: { fontSize: 22, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a2e" },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: { fontSize: 14, color: "#555", fontWeight: "bold" },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#444", marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#1a1a2e",
    backgroundColor: "#fafafa",
  },
  inputError: { borderColor: "#e53935" },
  inputDisabled: { backgroundColor: "#f5f5f5", color: "#999" },
  errorText: { fontSize: 11, color: "#e53935", marginTop: 4 },
  row2: { flexDirection: "row" },
  preview: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 13, color: "#2e7d32", fontWeight: "600" },
  previewValue: { fontSize: 16, color: "#1b5e20", fontWeight: "800" },
  btnRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  btnCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
  },
  btnCancelText: { color: "#666", fontWeight: "600", fontSize: 15 },
  btnSubmit: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#3F51B5",
    alignItems: "center",
  },
  btnSubmitText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
