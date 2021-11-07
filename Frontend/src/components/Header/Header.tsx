import React from 'react';
import cn from 'classnames';
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
                <Typography>ГЛАВНАЯ</Typography>
            </NavLink>
            <NavLink
                className={cn(styles.link, styles.ml30)}
                activeClassName={styles.activeLink}
                to={Routes.DASHBORDS}
            >
                <Typography>СТАТИСТИКА</Typography>
            </NavLink>
        </div>
    );
}
