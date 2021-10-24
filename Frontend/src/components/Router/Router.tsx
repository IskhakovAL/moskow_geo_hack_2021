import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MarkerPage from '../MarkerPage/MarkerPage';

export const Routes = {
    MARKERS: '/sports-object',
};

export default function Router() {
    const routes = [
        {
            path: Routes.MARKERS,
            component: MarkerPage,
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
