import { TemplatesList } from '@/components/TemplatesList';
import { toast } from '@/hooks/use-toast';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import {
    deleteNotificationTemplate,
    getNotificationTemplatesPage,
    NotificationTemplate,
    PageNotificationTemplate,
    postNotificationTemplate,
} from 'liferay-headless-rest-client/notification-v1.0';
import { liferayClient } from '@/lib/liferay-headless';

export const Route = createFileRoute('/')({
    component: Index,
    loader: async () => {
        const { data } = await getNotificationTemplatesPage({
            query: { sort: 'name:asc' },
            client: liferayClient,
        });

        return data as PageNotificationTemplate;
    },
});

function Index() {
    const pageNotificationTemplate = Route.useLoaderData();
    const { invalidate } = useRouter();

    const handleDeleteTemplate = async (notificationTemplateId: string) => {
        const { error } = await deleteNotificationTemplate({
            client: liferayClient,
            path: { notificationTemplateId },
        });

        if (error) {
            return console.error(error);
        }

        invalidate();

        toast({
            title: 'Template Deleted',
            description: 'Template has been deleted successfully.',
        });
    };

    const handleDuplicateTemplate = async (
        notificationTemplate: NotificationTemplate,
    ) => {
        const { error } = await postNotificationTemplate({
            body: {
                ...notificationTemplate,
                externalReferenceCode: `${notificationTemplate.externalReferenceCode}_COPY`,
                name: `${notificationTemplate.name} (Copy)`,
            },
            client: liferayClient,
        });

        if (error) {
            return toast({
                className: 'text-white',
                description: (error as any).title,
                title: 'Unable to duplicate template',
                variant: 'destructive',
            });
        }

        invalidate();

        toast({
            title: 'Template Duplicated',
            description: `Template "${notificationTemplate.name}" has been duplicated.`,
        });
    };

    return (
        <TemplatesList
            templates={pageNotificationTemplate.items ?? []}
            onDeleteTemplate={handleDeleteTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
        />
    );
}
