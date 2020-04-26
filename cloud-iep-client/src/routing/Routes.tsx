import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '../react-auth0-spa';
import Home, { homeRoute } from '../ui/Home';
import SimpleStudentPage, {
  studentsRoute,
} from '../ui/student/SimpleStudentPage';
import Auth, { authCallbackRoute } from '../ui/user/Auth';
import Profile, { profileRoute } from '../ui/user/Profile';
import StudentDetail, { studentDetailRoute } from '../ui/student/StudentDetail';

// Logged-in routing inspired by John Reilly on GitHub:
// https://github.com/johnnyreilly/auth0-react-typescript-asp-net-core

const privateRoutes = [
  { path: profileRoute, component: Profile },
  { path: studentsRoute, component: SimpleStudentPage },
  { path: authCallbackRoute, component: Auth },
  { path: studentDetailRoute, component: StudentDetail },
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
