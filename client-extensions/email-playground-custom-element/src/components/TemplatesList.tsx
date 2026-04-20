import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Search, Edit, Trash2, Copy } from 'lucide-react';
import { NotificationTemplate } from 'liferay-headless-rest-client/notification-v1.0';
import { useNavigate } from '@tanstack/react-router';
import { useVariablesFlat } from '@/hooks/use-variables';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface TemplatesListProps {
    onDeleteTemplate: (templateId: string) => void;
    onDuplicateTemplate: (template: NotificationTemplate) => void;
    templates: NotificationTemplate[];
}

export const TemplatesList: React.FC<TemplatesListProps> = ({
    onDeleteTemplate,
    onDuplicateTemplate,
    templates,
}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(
        null,
    );
    const { hasVariables, allVariables, replaceVariables } = useVariablesFlat();
    const navigate = useNavigate();

    const filteredTemplates = templates.filter(
        (template) =>
            template.name!.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template
                .subject!.en_US.toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const handleDelete = (templateId: string) => {
        setTemplateToDelete(templateId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (templateToDelete) {
            onDeleteTemplate(templateToDelete);
            setDeleteDialogOpen(false);
            setTemplateToDelete(null);
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center mb-4 justify-between">
                    <CardTitle>Email Templates</CardTitle>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 transform -translate-y-3 text-gray-400 w- h-4" />
                    <Input
                        className="pl-10"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search templates..."
                        value={searchTerm}
                    />
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Template Name</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Recipients</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTemplates.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        {searchTerm
                                            ? 'No templates found matching your search.'
                                            : 'No templates created yet.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTemplates.map((template) => (
                                    <TableRow
                                        key={template.id}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            navigate({
                                                to: `/templates/${template.externalReferenceCode}`,
                                            })
                                        }
                                    >
                                        <TableCell className="font-medium">
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {template.id}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {hasVariables(
                                                    template.externalReferenceCode ??
                                                        '',
                                                ) && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span
                                                                className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0"
                                                                aria-label="Has saved variables"
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {
                                                                Object.keys(
                                                                    allVariables[
                                                                        template
                                                                            .externalReferenceCode ??
                                                                            ''
                                                                    ] ?? {},
                                                                ).length
                                                            }{' '}
                                                            saved variable
                                                            {Object.keys(
                                                                allVariables[
                                                                    template
                                                                        .externalReferenceCode ??
                                                                        ''
                                                                ] ?? {},
                                                            ).length === 1
                                                                ? ''
                                                                : 's'}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                                {template.name}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            className="max-w-xs truncate"
                                            dangerouslySetInnerHTML={{
                                                __html: replaceVariables(
                                                    template.subject!.en_US,
                                                    template.externalReferenceCode ??
                                                        '',
                                                ),
                                            }}
                                        ></TableCell>
                                        <TableCell>
                                            {(() => {
                                                const recipients = template
                                                    .recipients!.flatMap(
                                                        ({ to }: any) =>
                                                            (to?.en_US ?? '')
                                                                .split(',')
                                                                .map((value: string) =>
                                                                    value.trim(),
                                                                ),
                                                    )
                                                    .filter(Boolean);
                                                const count = recipients.length;

                                                return (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="secondary">
                                                                {count} recipient
                                                                {count !== 1
                                                                    ? 's'
                                                                    : ''}
                                                            </Badge>
                                                        </TooltipTrigger>

                                                        {count > 0 && (
                                                            <TooltipContent className="max-w-xs">
                                                                <ul className="space-y-0.5 font-mono text-xs">
                                                                    {recipients.map(
                                                                        (email) => (
                                                                            <li
                                                                                key={
                                                                                    email
                                                                                }
                                                                            >
                                                                                {email}
                                                                            </li>
                                                                        ),
                                                                    )}
                                                                </ul>
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                );
                                            })()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div
                                                className="flex items-center justify-end gap-2"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate({
                                                            to: `/templates/${template.externalReferenceCode}`,
                                                        })
                                                    }
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onDuplicateTemplate(
                                                            template,
                                                        )
                                                    }
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            String(template.id),
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Template</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this template?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};
