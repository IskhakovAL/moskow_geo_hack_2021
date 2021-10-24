import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PolygonMap from '../PolygonMap/PolygonMap';
import MarkerPage from '../MarkerPage/MarkerPage';

export const Routes = {
    POLYGONS: '/population-density',
    MARKERS: '/sports-object',
};

export default function Router() {
    const routes = [
        {
            path: Routes.MARKERS,
            component: MarkerPage,
            exact: true,
        },
        {
            path: Routes.POLYGONS,
            component: PolygonMap,
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
