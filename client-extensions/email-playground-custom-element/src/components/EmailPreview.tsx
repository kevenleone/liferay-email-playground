import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Users } from 'lucide-react';
import type { EmailTemplate } from './EmailTemplateEditor';

interface EmailPreviewProps {
    template: EmailTemplate;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ template }) => {
    const replaceVariables = (text: string): string => {
        let result = text;
        Object.entries(template.variables).forEach(([key, value]) => {
            result = result.replace(new RegExp(`%${key}%`, 'g'), value);
        });
        return result;
    };

    const processedSubject = replaceVariables(template.subject);
    const processedBody = replaceVariables(template.body);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Email Preview
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {template.recipients.length} recipients
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Email Header */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                                From:
                            </span>
                            <span className="text-sm text-gray-600">
                                noreply@company.com
                            </span>
                        </div>
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-gray-700">
                                To:
                            </span>
                            <div className="text-right">
                                {template.recipients.map((recipient, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="ml-1 mb-1"
                                    >
                                        {recipient}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                                Subject:
                            </span>
                            <span className="text-sm text-gray-900 font-medium">
                                {processedSubject}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Email Body */}
                <div className="bg-white border rounded-lg">
                    <div className="p-6">
                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: processedBody }}
                            style={{
                                fontFamily:
                                    'system-ui, -apple-system, sans-serif',
                                lineHeight: '1.6',
                                color: '#374151',
                            }}
                        />
                    </div>

                    {/* Email Footer */}
                    <div className="border-t bg-gray-50 p-4 text-center">
                        <p className="text-xs text-gray-500">
                            This is an automated notification from your system.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Please do not reply to this email.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
