import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '../react-auth0-spa';
import Home, { homeRoute } from '../ui/Home';
import StudentPage, { studentsRoute } from '../ui/student/StudentPage';
import Auth, { authCallbackRoute } from '../ui/user/Auth';
import Profile, { profileRoute } from '../ui/user/Profile';

// Logged-in routing inspired by John Reilly on GitHub:
// https://github.com/johnnyreilly/auth0-react-typescript-asp-net-core

const privateRoutes = [
  { path: profileRoute, component: Profile },
  { path: studentsRoute, component: StudentPage },
  { path: authCallbackRoute, component: Auth },
];

const Routes = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Switch>
      <Route path={homeRoute} exact={true} component={Home} />
      {isAuthenticated
        ? privateRoutes.map(({ path, component }) => (
            <Route key={path} path={path} exact={true} component={component} />
          ))
        : null}
      <Redirect key="redirect" to={homeRoute} />
    </Switch>
  );
};

export default Routes;
