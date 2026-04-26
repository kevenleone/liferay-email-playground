import React, { useEffect, useMemo, useState } from 'react';
import {
    getNotificationQueueEntriesPage,
    NotificationQueueEntry,
} from 'liferay-headless-rest-client/notification-v1.0';
import { liferayClient } from '@/lib/liferay-headless';
import { EmailRender } from './EmailRender';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Mail,
    User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusMap: Record<
    number,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }
> = {
    0: { label: 'Unsent', variant: 'secondary', icon: Clock },
    1: { label: 'Sent', variant: 'default', icon: CheckCircle },
    2: { label: 'Failed', variant: 'destructive', icon: AlertCircle },
};

function getStatusInfo(status?: number) {
    return statusMap[status ?? 0] ?? statusMap[0];
}

function stripHtml(html?: string) {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

interface EmailQueueProps {
    onCountChange?: (count: number) => void;
}

export const EmailQueue: React.FC<EmailQueueProps> = ({ onCountChange }) => {
    const [entries, setEntries] = useState<NotificationQueueEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [previewTab, setPreviewTab] = useState('html');

    useEffect(() => {
        getNotificationQueueEntriesPage({
            client: liferayClient,
            query: { sort: 'sentDate:desc' },
        }).then(({ data }) => {
            const items = data?.items ?? [];
            setEntries(items);
            onCountChange?.(items.length);
            if (items.length) {
                setSelectedId(items[0].id);
            }
            setLoading(false);
        });
    }, [onCountChange]);

    const selectedEntry = useMemo(
        () => entries.find((e) => e.id === selectedId),
        [entries, selectedId],
    );

    if (loading) {
        return (
            <div className="flex h-[700px] gap-0 border rounded-lg overflow-hidden">
                <div className="w-[380px] border-r bg-muted/30 space-y-2 p-3">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="flex-1 p-4 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[700px] border rounded-lg overflow-hidden bg-card">
            {/* Sidebar */}
            <div className="w-[380px] border-r flex flex-col bg-muted/30">
                <div className="p-3 border-b bg-background flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Queue
                    </h3>
                    <Badge variant="outline">{entries.length}</Badge>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {entries.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No emails in the queue.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {entries.map((entry) => {
                                const status = getStatusInfo(entry.status);
                                const StatusIcon = status.icon;
                                const isSelected = entry.id === selectedId;
                                const bodyPreview = stripHtml(
                                    entry.body,
                                ).substring(0, 100);

                                return (
                                    <button
                                        key={entry.id}
                                        onClick={() => {
                                            setSelectedId(entry.id);
                                            setPreviewTab('html');
                                        }}
                                        className={cn(
                                            'w-full text-left p-3 transition-colors hover:bg-muted/80',
                                            isSelected
                                                ? 'bg-muted border-l-[3px] border-l-primary'
                                                : 'border-l-[3px] border-l-transparent',
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-sm truncate">
                                                        {entry.fromName ||
                                                            'Liferay Notifications'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                        {formatDate(
                                                            entry.sentDate,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="text-sm font-medium truncate mt-0.5">
                                                    {entry.subject ||
                                                        '(No subject)'}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate mt-1 line-clamp-2">
                                                    {bodyPreview ||
                                                        'No preview available'}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                                    <Badge
                                                        variant={status.variant}
                                                        className="text-[10px] px-1.5 py-0 h-5 gap-0.5"
                                                    >
                                                        <StatusIcon className="w-3 h-3" />
                                                        {status.label}
                                                    </Badge>
                                                    {entry.typeLabel && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] px-1.5 py-0 h-5"
                                                        >
                                                            {entry.typeLabel}
                                                        </Badge>
                                                    )}
                                                    {entry.triggerBy && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] px-1.5 py-0 h-5"
                                                        >
                                                            {entry.triggerBy}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex flex-col bg-background min-w-0">
                {selectedEntry ? (
                    <>
                        <div className="border-b px-5 py-4 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-lg font-semibold leading-tight">
                                    {selectedEntry.subject || '(No subject)'}
                                </h2>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {selectedEntry.typeLabel && (
                                        <Badge variant="outline">
                                            {selectedEntry.typeLabel}
                                        </Badge>
                                    )}
                                    {(() => {
                                        const s = getStatusInfo(
                                            selectedEntry.status,
                                        );
                                        const Icon = s.icon;
                                        return (
                                            <Badge
                                                variant={s.variant}
                                                className="gap-1"
                                            >
                                                <Icon className="w-3 h-3" />
                                                {s.label}
                                            </Badge>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">
                                        {selectedEntry.fromName ||
                                            'Liferay Notifications'}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        To:{' '}
                                        {selectedEntry.recipientsSummary ||
                                            'Unknown recipients'}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground shrink-0 text-right">
                                    {selectedEntry.sentDate
                                        ? new Date(
                                              selectedEntry.sentDate,
                                          ).toLocaleString()
                                        : 'Not sent yet'}
                                </div>
                            </div>

                            <Tabs
                                value={previewTab}
                                onValueChange={setPreviewTab}
                            >
                                <TabsList className="h-8">
                                    <TabsTrigger
                                        value="html"
                                        className="text-xs px-2.5"
                                    >
                                        HTML
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="text"
                                        className="text-xs px-2.5"
                                    >
                                        Text
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="raw"
                                        className="text-xs px-2.5"
                                    >
                                        Raw
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {previewTab === 'html' && (
                                <div className="h-full p-4">
                                    <EmailRender>
                                        {selectedEntry.body || ''}
                                    </EmailRender>
                                </div>
                            )}
                            {previewTab === 'text' && (
                                <div className="h-full p-5 overflow-y-auto">
                                    <pre className="text-sm whitespace-pre-wrap font-sans text-foreground">
                                        {stripHtml(selectedEntry.body) ||
                                            'No text content available.'}
                                    </pre>
                                </div>
                            )}
                            {previewTab === 'raw' && (
                                <div className="h-full p-5 overflow-y-auto bg-muted/30">
                                    <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                                        {selectedEntry.body ||
                                            'No raw content available.'}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Mail className="w-10 h-10 opacity-20" />
                        <p className="text-sm">
                            Select an email from the queue to preview
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
