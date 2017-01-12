type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface NotificationModel {
    type: NotificationType;
    title: string;
    subtitle: string;
}
