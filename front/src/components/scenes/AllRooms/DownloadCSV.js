// lib
import React from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';

const headers = [
  { label: 'ID salle', key: 'id' },
  { label: 'Intitulé', key: 'name' },
  { label: 'Type de salle', key: 'type' },
  { label: 'Code', key: 'code' },
  { label: 'Capacité', key: 'capacity' },
  { label: 'Réservable sans validation', key: 'allowBookings' },
  { label: 'Validation par', key: 'belongsTo' },
  { label: 'Espace ouvert', key: 'openSpace' },
  { label: 'Captation', key: 'videoRecording' },
  { label: 'Projection', key: 'video' },
  { label: 'Visioconférence', key: 'videoConference' },
  { label: 'Audioconférence', key: 'audioConference' },
  { label: 'Retransmission live', key: 'liveStreaming' },
  { label: 'Sonorisation', key: 'audio' },
  { label: 'Modulable', key: 'modular' },
  { label: "WiFi pour l'enseignement", key: 'wifiForEducation' },
  { label: 'Donateur', key: 'donator' },
  { label: 'Campus', key: 'campus' },
  { label: 'Bâtiment', key: 'building' },
  { label: 'Univers', key: 'wing' },
  { label: 'Etage', key: 'floor' },
  { label: 'Localisation', key: 'location' },
  { label: 'Département', key: 'department' },
  { label: 'Superficie m2', key: 'area' },
  { label: 'Située en ZRR', key: 'zrr' },
  { label: "Aide à l'utilisation", key: 'help' },
];

const boolean = (bool) => (bool ? 'Oui' : 'Non');

const flatten = (arr) => arr.map((item) => item.label).join(' ');

const parser = (roomList) => roomList.map((room) => ({
  ...room,
  belongsTo: flatten(room.belongsTo),
  department: flatten(room.department),
  allowBookings: boolean(room.allowBookings),
  openSpace: boolean(room.openSpace),
  videoRecording: boolean(room.videoRecording),
  video: boolean(room.video),
  videoConference: boolean(room.videoConference),
  audioConference: boolean(room.audioConference),
  liveStreaming: boolean(room.liveStreaming),
  audio: boolean(room.audio),
  modular: boolean(room.modular),
  wifiForEducation: boolean(room.wifiForEducation),
  zrr: boolean(room.zrr),
}));

const DownloadCSV = ({ roomList }) => (
  <div className="row">
    <div className="col-sm">
      <p className="reset">
        <CSVLink
          data={parser(roomList)}
          headers={headers}
          separator=";"
          className="btn btn-primary"
          filename="resa-salles.csv"
        >
          Télécharger en CSV
        </CSVLink>
        <span className="light btn-inlined">(encodage UTF-8)</span>
      </p>
    </div>
  </div>
);

DownloadCSV.propTypes = {
  roomList: PropTypes.array,
};

DownloadCSV.defaultProps = {
  roomList: [],
};

export default DownloadCSV;
