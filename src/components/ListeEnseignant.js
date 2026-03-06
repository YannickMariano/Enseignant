import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ListeEnseignants({ enseignants, onEdit, onDelete }) {
  const total = enseignants.reduce((sum, e) => sum + parseFloat(e.prestation), 0);
  const min = enseignants.length > 0 ? Math.min(...enseignants.map(e => parseFloat(e.prestation))) : 0;
  const max = enseignants.length > 0 ? Math.max(...enseignants.map(e => parseFloat(e.prestation))) : 0;

  const confirmDelete = (matricule) => {
    Alert.alert('Confirmation', `Supprimer l'enseignant ${matricule} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(matricule) }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.cellSm]}>{item.matricule}</Text>
      <Text style={[styles.cell, styles.cellMd]}>{item.nom}</Text>
      <Text style={[styles.cell, styles.cellSm]}>{parseFloat(item.taux_horaire).toFixed(0)}</Text>
      <Text style={[styles.cell, styles.cellSm]}>{parseFloat(item.nombre_heures).toFixed(0)}</Text>
      <Text style={[styles.cell, styles.cellMd]}>{parseFloat(item.prestation).toFixed(2)}</Text>
      <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(item)}>
        <Text style={styles.btnIcon}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnDel} onPress={() => confirmDelete(item.matricule)}>
        <Text style={styles.btnIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.cellSm, styles.headerText]}>Matricule</Text>
        <Text style={[styles.cell, styles.cellMd, styles.headerText]}>Nom</Text>
        <Text style={[styles.cell, styles.cellSm, styles.headerText]}>Taux</Text>
        <Text style={[styles.cell, styles.cellSm, styles.headerText]}>Heures</Text>
        <Text style={[styles.cell, styles.cellMd, styles.headerText]}>Prestation</Text>
        <Text style={{ width: 60 }}></Text>
      </View>

      <FlatList
        data={enseignants}
        keyExtractor={(item) => item.matricule}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Aucun enseignant enregistré</Text>}
      />

      {/* Statistiques en bas */}
      {enseignants.length > 0 && (
        <View style={styles.stats}>
          <Text style={styles.statText}>💰 Total : <Text style={styles.statVal}>{total.toFixed(2)}</Text></Text>
          <Text style={styles.statText}>📉 Min : <Text style={styles.statVal}>{min.toFixed(2)}</Text></Text>
          <Text style={styles.statText}>📈 Max : <Text style={styles.statVal}>{max.toFixed(2)}</Text></Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8, paddingHorizontal: 4 },
  header: { backgroundColor: '#3F51B5', borderRadius: 8 },
  headerText: { color: '#fff', fontWeight: 'bold' },
  cell: { fontSize: 12, paddingHorizontal: 2 },
  cellSm: { width: 65 },
  cellMd: { width: 80 },
  btnEdit: { padding: 4 },
  btnDel: { padding: 4 },
  btnIcon: { fontSize: 16 },
  empty: { textAlign: 'center', padding: 20, color: '#999' },
  stats: { backgroundColor: '#E8EAF6', padding: 12, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  statText: { fontSize: 13, marginBottom: 4, color: '#333' },
  statVal: { fontWeight: 'bold', color: '#3F51B5' }
});