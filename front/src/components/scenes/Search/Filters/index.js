// lib
import React from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";
// src
import { CAMPUSES, BUILDINGS } from "config";
import Checkbox from "components/partials/Checkbox";
import roomTypes from "reducers/search/roomTypes.data";
import SearchBar from "./SearchBar";
import TypeSelector from "./TypeSelector";
import CapacitySelector from "./CapacitySelector";

class Filters extends React.Component {
  static propTypes = {
    minCapacity: PropTypes.number.isRequired,
    searchText: PropTypes.string.isRequired,
    setMinCapacity: PropTypes.func.isRequired,
    setSearchText: PropTypes.func.isRequired,
    selectRoomType: PropTypes.func.isRequired,
    type: PropTypes.object.isRequired,
    toggleDisplayVideoAcquisitionRooms: PropTypes.func.isRequired,
    toggleDisplayVideoConferenceRooms: PropTypes.func.isRequired,
    toggleDisplayUnavailableRooms: PropTypes.func.isRequired,
    toggleDisplayOpenSpaces: PropTypes.func.isRequired,
    toggleDisplayCampusAmong: PropTypes.func.isRequired,
    toggleDisplayBuildingAmong: PropTypes.func.isRequired,
    displayVideoAcquisitionRooms: PropTypes.bool.isRequired,
    displayVideoConferenceRooms: PropTypes.bool.isRequired,
    displayUnavailableRooms: PropTypes.bool.isRequired,
    displayOpenSpaces: PropTypes.bool.isRequired,
    displayCampuses: PropTypes.array.isRequired,
    displayBuildings: PropTypes.array.isRequired,
  };

  // As the minCapacity and searchText values aren't set
  // anywhere else in the code, the state here doesn't
  // follow the updates of the props:
  // state => props but not props => state

  throttledSetMinCapacity = throttle(this.props.setMinCapacity, 300);

  throttledSetSearchText = throttle(this.props.setSearchText, 300);

  constructor(props) {
    super(props);
    const { minCapacity, searchText } = props;
    this.state = { minCapacity, searchText };
  }

  setMinCapacity = ({ x }) => {
    this.setState({ minCapacity: x });
    this.throttledSetMinCapacity({ x });
  };

  setSearchText = (searchText) => {
    this.setState({ searchText });
    this.throttledSetSearchText(searchText);
  };

  render() {
    const { searchText, minCapacity } = this.state;
    const {
      selectRoomType,
      type,
      toggleDisplayVideoConferenceRooms,
      toggleDisplayVideoAcquisitionRooms,
      toggleDisplayUnavailableRooms,
      toggleDisplayOpenSpaces,
      toggleDisplayCampusAmong,
      toggleDisplayBuildingAmong,
      displayVideoAcquisitionRooms,
      displayVideoConferenceRooms,
      displayUnavailableRooms,
      displayOpenSpaces,
      displayCampuses,
      displayBuildings,
    } = this.props;
    return (
      <div className="sticky-top custom-sticky">
        <SearchBar
          searchText={searchText}
          onSearchTextInput={this.setSearchText}
        />
        <div className="card my-3">
          <div className="card-body">
            <TypeSelector
              disabled={Boolean(searchText)}
              onChange={selectRoomType}
              data={roomTypes}
              selectedType={type}
            />
            <CapacitySelector
              onChange={this.setMinCapacity}
              minCapacity={minCapacity}
            />
            <div>Campus :</div>
            {CAMPUSES.map((c) => (
              <Checkbox
                key={c}
                onChange={() => toggleDisplayCampusAmong(c)}
                checked={displayCampuses.includes(c)}
                name={c}
              />
            ))}
            <div>Bâtiments :</div>
            {BUILDINGS.map((b) => (
              <Checkbox
                key={b}
                onChange={() => toggleDisplayBuildingAmong(b)}
                checked={displayBuildings.includes(b)}
                name={b}
              />
            ))}
            <div className="mt-1">Filtres :</div>
            <Checkbox
              onChange={toggleDisplayVideoConferenceRooms}
              checked={displayVideoConferenceRooms}
              name="Visioconférence"
            />
            <Checkbox
              onChange={toggleDisplayVideoAcquisitionRooms}
              checked={displayVideoAcquisitionRooms}
              name="Captation vidéo"
            />
            <div className="mt-1">Compléments :</div>
            <Checkbox
              onChange={toggleDisplayUnavailableRooms}
              checked={displayUnavailableRooms}
              name="Afficher les salles indisponibles"
            />
            <Checkbox
              onChange={toggleDisplayOpenSpaces}
              checked={displayOpenSpaces}
              name="Afficher les espaces ouverts"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Filters;
