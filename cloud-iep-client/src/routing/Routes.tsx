import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../ui/Home';
import StudentPage from '../ui/student/StudentPage';

const Routes = () => (
    <Switch>
        <Switch>
            <Route path="/students">
                <StudentPage />
            </Route>
            <Route path="/">
                <Home />
            </Route>
        </Switch>
    </Switch>
)

export default Routes;