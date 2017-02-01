type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface PopupNotificationModel {
    type: NotificationType;
    title: string;
    subtitle: string;
}
