export class LoginResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
    error: string;
    error_description: string;
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
