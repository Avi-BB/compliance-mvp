import { ReactNode } from "react";
import { DialogProps } from "@mui/material";

export type DateType = Date | null | undefined

export type idAndNameType = {
    id: string;
    name: string;
}

export type handleGetAllQueryParamType = {
    [key: string]: number | string | boolean | string[] | number[] | DateType | idAndNameType
};

export type CommonDialogProps = {
    open: boolean;
    onClose: any;
    Component?: ReactNode;
    ActionComponent: ReactNode;
    title: string;
    description: string;
    dialogWidth?: DialogProps['maxWidth'];
    isFullWidth?: boolean;
};

export interface CommonActionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading?: boolean;
    isArchive?: boolean | undefined;
    title: string;
    description?: string;
    itemName?: string;
    supportText?: string;
    icon?: string;
    isPublish?: boolean;
    iconColor?: string;
    iconType?: 'archive' | 'unarchive' | 'publish' | 'delete';
}
