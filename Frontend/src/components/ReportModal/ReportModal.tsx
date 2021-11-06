import React from 'react';
import cn from 'classnames';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import ReactDOM from 'react-dom';
import styles from './reportModal.m.scss';
import useReactPortal from '../../hooks/useReactPortal';

type TOnClick = () => void;

export interface IProps {
    title?: string;
    children: React.ReactNode;
    onYes?: TOnClick;
    onYesDisabled?: boolean;
    onNo?: TOnClick;
    onClose?: TOnClick;
    onYesText?: string;
    onNoText?: string;
    onBackdropClick?: TOnClick;
    disableBodyScroll?: boolean;
    withBackDrop?: boolean;
    isFetching?: boolean;
    classes?: {
        root?: string;
        head?: string;
        closeIcon?: string;
        content?: string;
    };
}

const ReportModal = ({
    classes = {},
    title = 'Отчет',
    onClose = () => {},
    children,
    isFetching = false,
}: IProps) => {
    const modal = (
        <div className={styles.modal}>
            <div className={cn(classes.head, { [styles.head]: !classes.head })}>
                <Typography>{title}</Typography>
                <div
                    className={cn(classes.closeIcon, {
                        [styles.closeIcon]: !classes.closeIcon,
                    })}
                    onClick={onClose}
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
