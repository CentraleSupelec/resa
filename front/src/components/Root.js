// lib
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import LoadedRoute from 'containers/partials/LoadedRoute';
import AcceptRequest from 'components/scenes/AcceptRequest';
import Bookings from 'containers/scenes/Bookings';
import Search from 'containers/scenes/Search';
import DirectSearch from 'containers/scenes/Search/DirectSearch';
import Shell from 'components/partials/Shell';
import LoginAccept from 'components/scenes/LoginAccept';
import AllRooms from 'components/scenes/AllRooms';
import Login from 'components/scenes/Login';
import Logout from 'components/scenes/Logout';
import Admin from 'containers/scenes/Admin';
import Manager from 'containers/scenes/Manager';
import Helpdesk from 'components/scenes/Helpdesk';

const Root = ({ isLogged, currentRoomId, fetchMember }) => {
  // Did mount
  useEffect(() => {
    async function fetchData() {
      if (isLogged) {
        const member = await authenticatedFetch('user/me');
        fetchMember(member);
      }
    }
    fetchData();
  }, [isLogged, fetchMember]);

  return (
    <Shell>
      <Switch>
        <Route exact path="/login" component={Login} />
        {!isLogged && (
          <Route
            path="/loginAccept/"
            component={(p) => <LoginAccept casToken={p.location.search} />}
          />
        )}
        <Route path="/request/:token" component={AcceptRequest} />
        <Route path="/recherche/:resourceId" component={DirectSearch} />
        <Route path="/logout">
          {isLogged ? <Logout /> : <Redirect to="/login" />}
        </Route>
        <LoadedRoute
          component={() => (
            <Switch>
              <Route exact path="/recherche/" component={Search} />
              <Route path="/reservations/" component={Bookings} />
              <Route path="/admin/:type?" component={Admin} />
              <Route path="/manager/:type?/:id?" component={Manager} />
              <Route path="/rooms/" component={AllRooms} />
              <Route path="/help/" component={Helpdesk} />
              <Redirect from="/" to={`/recherche/${currentRoomId || ''}`} />
            </Switch>
          )}
        />
      </Switch>
    </Shell>
  );
};

Root.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  fetchMember: PropTypes.func.isRequired,
  currentRoomId: PropTypes.string,
};

Root.defaultProps = {
  currentRoomId: null,
};

export default Root;
