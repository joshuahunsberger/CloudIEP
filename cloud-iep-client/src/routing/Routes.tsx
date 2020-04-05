import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../ui/Home';
import StudentPage from '../ui/student/StudentPage';
import Profile from "../ui/user/Profile";

const Routes = () => (
    <Switch>
        <Switch>
            <Route path="/" exact={true}>
                <Home />
            </Route>
            <Route path="/students">
                <StudentPage />
            </Route>
            <Route path="/profile">
                <Profile />
            </Route>
        </Switch>
    </Switch>
)

export default Routes;