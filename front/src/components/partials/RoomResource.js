// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faTv,
  faMapSigns,
  faBuilding,
  faUsers,
  faUserCircle,
  faCamera,
  faChevronCircleRight,
  faShieldAlt,
  faTimesCircle,
  faDoorOpen,
} from '@fortawesome/fontawesome-free-solid';

const RoomResource = ({ memberOf, resource, showBuilding }) => {
  if (
    resource.type !== 'buildingAndCampus' &&
    resource.type !== 'wingAndFloor' &&
    !resource.value
  ) {
    return null;
  }

  if (resource.type === 'buildingAndCampus' && !showBuilding) {
    return null;
  }

  let value = '';
  let icon;
  const classNames = ['col-12'];

  if (resource.type === 'capacity') {
    icon = faUsers;
    value = (
      <span>
        {resource.value}
        &nbsp;personnes
      </span>
    );
  } else if (resource.type === 'buildingAndCampus') {
    icon = faBuilding;
    // value = `Bâtiment ${resource.building} (campus de ${resource.campus})`;
    value = `Bâtiment ${resource.building}`;
  } else if (resource.type === 'wingAndFloor') {
    icon = faMapSigns;

    const friendlyFloorName = {
      '-1': 'sous-sol',
      0: 'rez-de-chaussée',
      1: '1er étage',
      2: '2e étage',
      3: '3e étage',
      4: '4e étage',
      5: '5e étage',
    };

    if (friendlyFloorName[resource.floor]) {
      if (resource.wing) {
        value = `Univers ${resource.wing}, ${
          friendlyFloorName[resource.floor]
        }`;
      } else {
        value = `${friendlyFloorName[resource.floor]}`;
      }
    } else {
      value = 'Non défini';
    }
  } else if (resource.type === 'video') {
    icon = faTv;
    value = 'Projection vidéo';
  } else if (resource.type === 'videoConference') {
    icon = faVideo;
    value = 'Visioconférence';
  } else if (resource.type === 'donator') {
    icon = faUserCircle;
    value = `Donateur : ${resource.value}`;
  } else if (resource.type === 'roomType') {
    icon = faChevronCircleRight;
    ({ value } = resource);
  } else if (resource.type === 'needConfirmation') {
    icon = faShieldAlt;
    const belongsTo =
      resource.belongsTo &&
      resource.belongsTo.find(({ groupId }) => memberOf.includes(groupId));
    if (belongsTo) {
      value = `Autorisé (${belongsTo.label})`;
      classNames.push('font-weight-bold');
      classNames.push('text-success');
    } else {
      value = 'Nécessite validation';
      if (resource.belongsTo && resource.belongsTo.length > 0) {
        value = `${value} (${resource.belongsTo
          .map(({ label }) => label)
          .join(' ou ')})`;
      }
      classNames.push('font-weight-bold');
      classNames.push('custom-text-color-cs');
    }
  } else if (resource.type === 'notAvailable') {
    icon = faTimesCircle;
    value = 'Non disponible à cet horaire';
  } else if (resource.type === 'videoRecording') {
    icon = faCamera;
    value = 'Captation vidéo';
  } else if (resource.type === 'openSpace') {
    icon = faDoorOpen;
    value = 'Espace ouvert';
    classNames.push('text-success');
  } else if (resource.type === 'modular') {
    icon = faDoorOpen;
    value = 'Salle décloisonnée';
  }

  return (
    <li>
      <div className="row no-gutters">
        <div className={classNames.join(' ')}>
          <FontAwesomeIcon icon={icon} />
          &nbsp;&nbsp;
          {value}
        </div>
      </div>
    </li>
  );
};

RoomResource.propTypes = {
  resource: PropTypes.object.isRequired,
  memberOf: PropTypes.array.isRequired,
  showBuilding: PropTypes.bool,
};

RoomResource.defaultProps = {
  showBuilding: false,
};

export default RoomResource;
