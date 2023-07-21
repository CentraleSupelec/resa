const stringValidator = (string) => (string ? String(string) : '');
const labelValidator = (arr) => (!!arr && Array.isArray(arr) ? arr.map((i) => i.label).join(' ') : '');

export default [
  {
    key: 'name',
    label: 'Intitulé',
    validation: stringValidator,
  },
  {
    key: 'capacity',
    label: 'Capacité',
    validation: Number,
  },
  {
    key: 'allowBookings',
    label: 'Réservable sans validation',
    validation: Boolean,
  },
  {
    key: 'type',
    label: 'Type de salle',
    validation: stringValidator,
  },
  {
    key: 'openSpace',
    label: 'Espace ouvert',
    validation: Boolean,
  },
  {
    key: 'videoRecording',
    label: 'Captation',
    validation: Boolean,
  },
  {
    key: 'videoConference',
    label: 'Visioconférence',
    validation: Boolean,
  },
  {
    key: 'department',
    label: 'Département',
    validation: labelValidator,
  },
  {
    key: 'belongsTo',
    label: 'Validation par',
    validation: labelValidator,
  },
  {
    key: 'campus',
    label: 'Campus',
    validation: stringValidator,
  },
  {
    key: 'building',
    label: 'Bâtiment',
    validation: stringValidator,
  },
];
