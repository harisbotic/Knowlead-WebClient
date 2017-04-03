import { P2PModel } from './dto';
export class LoginResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
    error: string;
    error_description: string;
    refresh_token: string;
}
export interface LoginUserModel {
    email: string;
    password: string;
}
type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface PopupNotificationModel {
    type: NotificationType;
    title: string;
    subtitle: string;
}

export interface DropdownValueInterface<T> {
    label: string;
    value: T;
}

export interface P2pModelExtended extends P2PModel {
    canCall: boolean;
    canDelete: boolean;
    canLeaveFeedback: boolean;
    actualPrice: number; // if p2p is scheduled this is price agreed, else it is initial actual
    isMy: boolean;
}
