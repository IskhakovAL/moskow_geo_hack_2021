import React from 'react';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import styles from './header.m.scss';
import { Routes } from '../Router/Router';

export default function Header() {
    return (
        <div className={styles.header}>
            <NavLink
                className={styles.link}
                activeClassName={styles.activeLink}
                to={Routes.MARKERS}
            >
                <Typography>Главная</Typography>
            </NavLink>
            <NavLink
                className={styles.link}
                activeClassName={styles.activeLink}
                to={Routes.DASHBORDS}
            >
                <Typography>ДАШБОРДЫ</Typography>
            </NavLink>
        </div>
    );
}
