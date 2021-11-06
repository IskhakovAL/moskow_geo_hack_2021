import React from 'react';
import cn from 'classnames';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import ReactDOM from 'react-dom';
import styles from './reportModal.m.scss';
import useReactPortal from '../../hooks/useReactPortal';

const ReportModal = ({ classes = {}, title = 'Отчет', onCloseCallback, children, isFetching }) => {
    const modal = (
        <div className={styles.modal}>
            <div className={cn(classes.head, { [styles.head]: !classes.head })}>
                <Typography>{title}</Typography>
                <div
                    className={cn(classes.closeIcon, {
                        [styles.closeIcon]: !classes.closeIcon,
                    })}
                    onClick={onCloseCallback}
                >
                    <CloseIcon />
                </div>
            </div>
            <div className={cn(classes.content, { [styles.content]: !classes.content })}>
                {isFetching ? (
                    <div className={styles.loader}>
                        <CircularProgress />
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modal, useReactPortal('reportModal'));
};

export default ReportModal;
