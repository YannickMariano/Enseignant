import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function FormulaireEnseignant({ onSubmit, enseignantEdit, onCancelEdit }) {
  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [tauxHoraire, setTauxHoraire] = useState('');
  const [nombreHeures, setNombreHeures] = useState('');

  useEffect(() => {
    if (enseignantEdit) {
      setMatricule(enseignantEdit.matricule);
      setNom(enseignantEdit.nom);
      setTauxHoraire(String(enseignantEdit.taux_horaire));
      setNombreHeures(String(enseignantEdit.nombre_heures));
    } else {
      resetForm();
    }
  }, [enseignantEdit]);

  const resetForm = () => {
    setMatricule(''); setNom('');
    setTauxHoraire(''); setNombreHeures('');
  };

  const handleSubmit = () => {
    if (!matricule || !nom || !tauxHoraire || !nombreHeures) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    onSubmit({ matricule, nom, taux_horaire: parseFloat(tauxHoraire), nombre_heures: parseFloat(nombreHeures) });
    resetForm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{enseignantEdit ? '✏️ Modifier' : '➕ Ajouter'} un enseignant</Text>
      <TextInput style={styles.input} placeholder="Matricule" value={matricule}
        onChangeText={setMatricule} editable={!enseignantEdit} />
      <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
      <TextInput style={styles.input} placeholder="Taux horaire" value={tauxHoraire}
        onChangeText={setTauxHoraire} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Nombre d'heures" value={nombreHeures}
        onChangeText={setNombreHeures} keyboardType="decimal-pad" />
      <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
        <Text style={styles.btnText}>{enseignantEdit ? 'Modifier' : 'Ajouter'}</Text>
      </TouchableOpacity>
      {enseignantEdit && (
        <TouchableOpacity style={styles.btnCancel} onPress={onCancelEdit}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16, borderRadius: 10, margin: 10, elevation: 3 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 14 },
  btnSubmit: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnCancel: { backgroundColor: '#f44336', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});