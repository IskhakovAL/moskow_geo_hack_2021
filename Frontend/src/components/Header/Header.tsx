import React from 'react';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import styles from './header.m.scss';
import { Routes } from '../Router/Router';

export default function Header() {
    return (
        <div className={styles.header}>
            <NavLink className={styles.link} to={Routes.MARKERS}>
                <Typography>Маркеры</Typography>
            </NavLink>
            <NavLink className={styles.link} to={Routes.POLYGONS}>
                <Typography>Полигоны</Typography>
            </NavLink>
            <NavLink className={styles.link} to={Routes.CIRCLES}>
                <Typography>Круги</Typography>
            </NavLink>
        </div>
    );
}
