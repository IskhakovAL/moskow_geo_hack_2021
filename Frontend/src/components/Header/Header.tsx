import React from 'react';
import cn from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import styles from './header.m.scss';
import { Routes } from '../Router/Router';
import Recommendation from '../Recommendation/Recommendation';

export default function Header() {
    const location = useLocation();
    const isSportsObject = location.pathname === Routes.MARKERS;

    return (
        <div className={styles.header}>
            <div className={styles.linkContainer}>
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
            {isSportsObject && (
                <div className={styles.recommendation}>
                    <Recommendation />
                </div>
            )}
        </div>
    );
}
