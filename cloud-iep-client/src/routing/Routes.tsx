import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import GoalDetail, { goalDetailRoute } from '../ui/goal/GoalDetail';
import Home, { homeRoute } from '../ui/Home';
import SimpleStudentPage, {
  studentsRoute,
} from '../ui/student/SimpleStudentPage';
import StudentDetail, { studentDetailRoute } from '../ui/student/StudentDetail';
import Auth, { authCallbackRoute } from '../ui/user/Auth';
import Profile, { profileRoute } from '../ui/user/Profile';

const RouterRoutes = () => {
  return (
    <Routes>
      <Route path={homeRoute} element={<Home />} />
      <Route
        path={profileRoute}
        element={
          <RequireAuth redirectTo={homeRoute}>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path={studentsRoute}
        element={
          <RequireAuth redirectTo={homeRoute}>
            <SimpleStudentPage />
          </RequireAuth>
        }
      />
      <Route
        path={authCallbackRoute}
        element={
          <RequireAuth redirectTo={homeRoute}>
            <Auth />
          </RequireAuth>
        }
      />
      <Route
        path={studentDetailRoute}
        element={
          <RequireAuth redirectTo={homeRoute}>
            <StudentDetail />
          </RequireAuth>
        }
      />
      <Route
        path={goalDetailRoute}
        element={
          <RequireAuth redirectTo={homeRoute}>
            <GoalDetail />
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={<Navigate key="redirect" to={homeRoute} replace />}
      />
    </Routes>
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
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

export default RouterRoutes;
