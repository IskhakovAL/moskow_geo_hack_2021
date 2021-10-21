import React, { useLayoutEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import noop from 'lodash/noop';
import cn from 'classnames';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useReactPortal from '../../hooks/useReactPortal';
import styles from './modal.m.scss';

type TOnClick = () => void;

export interface IProps {
    title: string;
    children: React.ReactNode;
    onYes?: TOnClick;
    onYesDisabled?: boolean;
    onNo?: TOnClick;
    onClose?: TOnClick;
    onYesText?: string;
    onNoText?: string;
    onBackdropClick?: TOnClick;
    disableBodyScroll?: boolean;
    classes?: {
        root?: string;
        head?: string;
        closeIcon?: string;
        content?: string;
    };
}

const initialState = {
    isFetching: false,
};

export default function Modal(props: IProps) {
    const {
        title,
        children,
        onYesText = 'Ок',
        onYes,
        onClose = noop,
        onBackdropClick = onClose,
        disableBodyScroll = true,
        classes = {},
    } = props;

    const [state, setState] = useState(initialState);
    const { isFetching } = state;

    useLayoutEffect(() => {
        if (disableBodyScroll) {
            const scrollbarWidth = window.innerWidth - document.body.clientWidth;

            document.body.style.overflow = 'hidden';
            document.body.style.marginRight = `${scrollbarWidth}px`;
            return function cleanup() {
                document.body.style.overflow = 'visible';
                document.body.style.marginRight = '0px';
            };
        }
        return noop;
    }, [disableBodyScroll]);

    const onRootClickCallback = useCallback((e) => e.stopPropagation(), []);
    const onCloseCallback = useCallback(
        (e) => {
            e.stopPropagation();
            onClose();
        },
        [onClose],
    );
    const onBackdropClickCallback = useCallback(
        (e) => {
            e.stopPropagation();
            onBackdropClick();
        },
        [onBackdropClick],
    );
    const onYesCallback = useCallback(
        async (e) => {
            e.stopPropagation();
            setState({ ...state, isFetching: true });
            try {
                await (onYes || noop)();
            } finally {
                setState({ ...state, isFetching: false });
            }
        },
        [onYes],
    );

    const modal = (
        <>
            <div className={styles.backdrop} onClick={onBackdropClickCallback} />
            <div
                className={cn(classes.root, { [styles.root]: !classes.root })}
                onClick={onRootClickCallback}
            >
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
                    {children}
                </div>
                {onYes && (
                    <div className={styles.actions}>
                        {onYes ? (
                            <div className={styles.yesButton}>
                                <Button
                                    variant="contained"
                                    onClick={onYesCallback}
                                    disabled={isFetching}
                                >
                                    {onYesText}
                                </Button>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </>
    );

    return ReactDOM.createPortal(modal, useReactPortal('modalRoot'));
}
