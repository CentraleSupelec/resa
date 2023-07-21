// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/fontawesome-free-solid';

const iconize = (bool) => (bool ? (
  <FontAwesomeIcon icon={faCheck} color="#1e7e34" />
) : (
  <FontAwesomeIcon icon={faTimes} color="#dc3545" />
));

const RoomRow = ({ data }) => (
  <tr>
    <th scope="row" className="text-center">
      {data.name}
    </th>
    <td className="text-center">{data.capacity}</td>
    <td className="text-center">{iconize(data.allowBookings)}</td>
    <td className="text-center">{data.type}</td>
    <td className="text-center">{iconize(data.openSpace)}</td>
    <td className="text-center">{iconize(data.videoRecording)}</td>
    <td className="text-center">{iconize(data.videoConference)}</td>
    <td className="text-center">{data.department}</td>
    <td className="text-center">{data.belongsTo}</td>
    <td className="text-center">{data.campus}</td>
    <td className="text-center">{data.building}</td>
  </tr>
);

RoomRow.propTypes = {
  data: PropTypes.object,
};

RoomRow.defaultProps = {
  data: undefined,
};

export default RoomRow;
