import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import GoalDetail, { goalDetailRoute } from '../ui/goal/GoalDetail';
import Home, { homeRoute } from '../ui/Home';
import SimpleStudentPage, {
  studentsRoute,
} from '../ui/student/SimpleStudentPage';
import StudentDetail, { studentDetailRoute } from '../ui/student/StudentDetail';
import Auth, { authCallbackRoute } from '../ui/user/Auth';
import Profile, { profileRoute } from '../ui/user/Profile';

const Routes = () => {
  return (
    <Switch>
      <Route path={homeRoute} exact={true}>
        <Home />
      </Route>
      <Route
        path={profileRoute}
        render={() => (
          <RequireAuth redirectTo={homeRoute}>
            <Profile />
          </RequireAuth>
        )}
      />
      <Route
        path={studentsRoute}
        render={() => (
          <RequireAuth redirectTo={homeRoute}>
            <SimpleStudentPage />
          </RequireAuth>
        )}
      />
      <Route
        path={authCallbackRoute}
        render={() => (
          <RequireAuth redirectTo={homeRoute}>
            <Auth />
          </RequireAuth>
        )}
      />
      <Route
        path={studentDetailRoute}
        render={() => (
          <RequireAuth redirectTo={homeRoute}>
            <StudentDetail />
          </RequireAuth>
        )}
      />
      <Route
        path={goalDetailRoute}
        render={() => (
          <RequireAuth redirectTo={homeRoute}>
            <GoalDetail />
          </RequireAuth>
        )}
      />
      <Redirect key="redirect" to={homeRoute} />
    </Switch>
  );
};

type PrivateRouteProps = {
  redirectTo: string;
  children: JSX.Element;
};

// Example taken from
// https://gist.github.com/mjackson/d54b40a094277b7afdd6b81f51a0393f#get-started-upgrading-today
const RequireAuth = ({ redirectTo, children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? children : <Redirect to={redirectTo} />;
};

export default Routes;
