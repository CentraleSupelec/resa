const roomTypes = [
  {
    value: 'Salle de réunion',
    fullName: 'Salles de réunion',
  },
  {
    value: ['Amphithéâtre', 'Enseignement', 'Auditorium'],
    fullName: "Amphis et salles d'enseignement",
  },
  {
    value: 'TP numérique',
    fullName: 'TP numériques',
  },
  {
    value: 'Plateau projet',
    fullName: 'Espaces projets',
  },
  {
    value: ['Salle de musique', 'Salle de sport'],
    fullName: 'Salles de musique/sport',
  },
  {
    value: 'Evénementiel',
    fullName: 'Événementiels',
  },
  {
    value: "Studio d'enregistrement",
    fullName: "Studios d'enregistrement",
  },
];

export const defaultValue = roomTypes[0];

export default {
  options: roomTypes,
};
