import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MarkerPage from '../MarkerPage/MarkerPage';
import Dashbords from '../Dashbords/Dashbords';

export const Routes = {
    MARKERS: '/sports-object',
    DASHBORDS: '/statistics',
};

export default function Router() {
    const routes = [
        {
            path: Routes.MARKERS,
            component: MarkerPage,
            exact: true,
        },
        {
            path: Routes.DASHBORDS,
            component: Dashbords,
            exact: true,
        },
    ];

    return (
        <Switch>
            {routes.map((route) => (
                <Route
                    key={route.path}
                    exact={route.exact}
                    path={route.path}
                    component={route.component}
                />
            ))}
            <Redirect to={Routes.MARKERS} />
        </Switch>
    );
}
