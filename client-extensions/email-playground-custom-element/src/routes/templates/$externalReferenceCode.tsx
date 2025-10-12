import EmailTemplateEditor from '@/components/EmailTemplateEditor';
import { liferayClient } from '@/lib/liferay-headless';
import { createFileRoute } from '@tanstack/react-router';
import {
    getNotificationTemplateByExternalReferenceCode,
    NotificationTemplate,
} from 'liferay-headless-rest-client/notification-v1.0';

export const Route = createFileRoute('/templates/$externalReferenceCode')({
    component: Template,
    loader: async ({ params: { externalReferenceCode } }) => {
        const { data, error } =
            await getNotificationTemplateByExternalReferenceCode({
                client: liferayClient,
                path: { externalReferenceCode },
            });

        if (error) {
            console.error(error);
        }

        return data;
    },
});

function Template() {
    const notificationTemplate = Route.useLoaderData();

    return (
        <EmailTemplateEditor
            notificationTemplate={
                notificationTemplate as Required<NotificationTemplate>
            }
        />
    );
}
