import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CommonDialog from './CommonDialog';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommonActionDialogProps } from '@/lib/types/common';

const CommonActionDialog: React.FC<CommonActionDialogProps> = ({
    open,
    onClose,
    onConfirm,
    isLoading,
    isArchive = true,
    title,
    description,
    itemName,
    supportText,
    iconType,
    iconColor
}) => {

    const renderIcon = () => {
        const size = 80;
        const color = iconColor || (isArchive ? '#CBA135' : '#4CAF50');

        switch (iconType) {
            case 'publish':
                return <PublishIcon sx={{ fontSize: size, color }} />;
            case 'delete':
                return <DeleteIcon sx={{ fontSize: size, color }} />;
            case 'unarchive':
                return <UnarchiveIcon sx={{ fontSize: size, color }} />;
            case 'archive':
            default:
                return <ArchiveIcon sx={{ fontSize: size, color }} />;
        }
    };

    const actionComponent = () => (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <LoadingButton
                loading={isLoading}
                loadingPosition="center"
                variant="contained"
                onClick={onConfirm}
                disabled={isLoading}
                color='error'
                sx={{px:1.2, py:1.2}}
            >
                Confirm
            </LoadingButton>
            <Button onClick={onClose}>
                Cancel
            </Button>
        </Box>
    );

    const dialogComponent = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {renderIcon()}
            {itemName && (
                <Typography
                    variant="body1"
                    sx={{
                        mt: 1,
                        textAlign: 'center',
                        textTransform: 'capitalize',
                        wordBreak: 'break-all',
                    }}
                >
                    Selected: {itemName}
                </Typography>
            )}
            {supportText && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mt: 2,
                        textAlign: 'center',
                        maxWidth: '80%',
                    }}
                >
                    {supportText}
                </Typography>
            )}
        </Box>
    );

    return (
        <CommonDialog
            open={open}
            onClose={onClose}
            Component={dialogComponent()}
            title={title || ''}
            ActionComponent={actionComponent()}
            description={description || ''}
        />
    );
};

export default CommonActionDialog;
