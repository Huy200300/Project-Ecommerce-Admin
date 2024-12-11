import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const GenericModal = ({ isOpen, title, children, onClose, footer, classNameCus }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            className={classNameCus}
        >
            <DialogTitle>
                <div className='flex items-center justify-between'>
                    <span className="text-xl font-bold uppercase">{title}</span>
                    <IconButton onClick={onClose}>
                        <FaTimes className="text-red-500" />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            {footer && (
                <DialogActions>
                    {footer}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default GenericModal;
