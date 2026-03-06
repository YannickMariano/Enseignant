import axios from "axios";

// Remplacez par votre IP locale ou URL déployée
const BASE_URL = "http://192.168.16.102:3000/api";

export const getEnseignants = () => axios.get(`${BASE_URL}/enseignants`);
export const addEnseignant = (data) =>
  axios.post(`${BASE_URL}/enseignants`, data);
export const updateEnseignant = (matricule, data) =>
  axios.put(`${BASE_URL}/enseignants/${matricule}`, data);
export const deleteEnseignant = (matricule) =>
  axios.delete(`${BASE_URL}/enseignants/${matricule}`);
