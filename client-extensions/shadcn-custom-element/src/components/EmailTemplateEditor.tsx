import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Send, Eye, Save, Plus, X, ArrowLeft, List } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { EmailPreview } from './EmailPreview';
import { VariableSelector } from './VariablesSelector';
import { RecipientManager } from './RecipientManager';
import { TemplatesList } from './TemplatesList';
import { useToast } from '@/hooks/use-toast';

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    recipients: string[];
    body: string;
    variables: Record<string, string>;
}

const EmailTemplateEditor = () => {
    const { toast } = useToast();

    // Sample templates data - in a real app, this would come from an API
    const [templates, setTemplates] = useState<EmailTemplate[]>([
        {
            id: '39493',
            name: 'Notify Trial Error to Admins',
            subject:
                '[PROVISIONING ERROR] Trial Environment Failed for %CUSTOMER_NAME%',
            recipients: ['admin@company.com', 'support@company.com'],
            body: `
        <h2>🚨 Trial Environment Provisioning Failed</h2>
        
        <p><strong>Customer:</strong> %CUSTOMER_NAME%</p>
        <p><strong>Order ID:</strong> %ORDER_ID%</p>
        <p><strong>Timestamp:</strong> %TIMESTAMP%</p>
        <p><strong>Environment:</strong> Production</p>
        <p><strong>Initiated By:</strong> Marketplace</p>
        
        <h3>❌ Error Summary</h3>
        <div style="background-color: #fee2e2; padding: 12px; border-radius: 6px; margin: 12px 0;">
          %ERROR_SUMMARY%
        </div>
        
        <h3>📋 Logs / Trace</h3>
        <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 12px 0; font-family: monospace;">
          %ERROR_LOGS_OR_STACKTRACE%
        </div>
        
        <h3>📋 Next Steps</h3>
        <p>Please investigate the issue and take the necessary corrective action.</p>
        <p>If urgent, escalate to the on-call engineer.</p>
      `,
            variables: {
                CUSTOMER_NAME: 'Acme Corporation',
                ORDER_ID: 'ORD-12345',
                TIMESTAMP: new Date().toISOString(),
                ERROR_SUMMARY:
                    'Failed to provision database instance due to quota limits',
                ERROR_LOGS_OR_STACKTRACE:
                    'Error: Database quota exceeded\n  at ProvisioningService.createInstance()\n  at line 142',
            },
        },
        {
            id: '39494',
            name: 'Welcome New User',
            subject: 'Welcome to %COMPANY_NAME%, %USER_NAME%!',
            recipients: ['user@example.com'],
            body: `
        <h2>Welcome to %COMPANY_NAME%!</h2>
        
        <p>Hi %USER_NAME%,</p>
        <p>We're excited to have you on board! Your account has been successfully created.</p>
        
        <h3>Getting Started</h3>
        <p>Here are a few things you can do to get started:</p>
        <ul>
          <li>Complete your profile setup</li>
          <li>Explore our features</li>
          <li>Join our community</li>
        </ul>
        
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The %COMPANY_NAME% Team</p>
      `,
            variables: {
                USER_NAME: 'John Doe',
                COMPANY_NAME: 'Acme Corporation',
            },
        },
    ]);

    const [currentTemplate, setCurrentTemplate] =
        useState<EmailTemplate | null>(templates[0]);
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [activeTab, setActiveTab] = useState('compose');
    const [isSending, setIsSending] = useState(false);

    const handleSave = () => {
        if (!currentTemplate) return;

        const updatedTemplates = templates.map((t) =>
            t.id === currentTemplate.id ? currentTemplate : t
        );
        setTemplates(updatedTemplates);

        toast({
            title: 'Template Saved',
            description: `Template "${currentTemplate.name}" has been saved successfully.`,
        });
    };

    const handleSend = async () => {
        if (!currentTemplate) return;

        if (currentTemplate.recipients.length === 0) {
            toast({
                title: 'No Recipients',
                description:
                    'Please add at least one recipient before sending.',
                variant: 'destructive',
            });
            return;
        }

        setIsSending(true);

        // Simulate sending email
        setTimeout(() => {
            setIsSending(false);
            toast({
                title: 'Email Sent Successfully',
                description: `Email sent to ${currentTemplate.recipients.length} recipient(s).`,
            });
        }, 2000);
    };

    const updateTemplate = (updates: Partial<EmailTemplate>) => {
        if (!currentTemplate) return;
        setCurrentTemplate((prev) => (prev ? { ...prev, ...updates } : null));
    };

    const handleSelectTemplate = (template: EmailTemplate) => {
        setCurrentTemplate(template);
        setView('editor');
        setActiveTab('compose');
    };

    const handleCreateNew = () => {
        const newTemplate: EmailTemplate = {
            id: Date.now().toString(),
            name: 'New Template',
            subject: '',
            recipients: [],
            body: '<p>Enter your email content here...</p>',
            variables: {},
        };

        setTemplates((prev) => [...prev, newTemplate]);
        setCurrentTemplate(newTemplate);
        setView('editor');
        setActiveTab('compose');
    };

    const handleDeleteTemplate = (templateId: string) => {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));

        if (currentTemplate?.id === templateId) {
            setCurrentTemplate(templates.length > 1 ? templates[0] : null);
            if (templates.length <= 1) {
                setView('list');
            }
        }

        toast({
            title: 'Template Deleted',
            description: 'Template has been deleted successfully.',
        });
    };

    const handleDuplicateTemplate = (template: EmailTemplate) => {
        const duplicatedTemplate: EmailTemplate = {
            ...template,
            id: Date.now().toString(),
            name: `${template.name} (Copy)`,
        };

        setTemplates((prev) => [...prev, duplicatedTemplate]);

        toast({
            title: 'Template Duplicated',
            description: `Template "${template.name}" has been duplicated.`,
        });
    };

    if (view === 'list') {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb Navigation */}
                    <div className="mb-6">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Templates</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <TemplatesList
                        templates={templates}
                        onSelectTemplate={handleSelectTemplate}
                        onCreateNew={handleCreateNew}
                        onDeleteTemplate={handleDeleteTemplate}
                        onDuplicateTemplate={handleDuplicateTemplate}
                    />
                </div>
            </div>
        );
    }

    if (!currentTemplate) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        No Template Selected
                    </h2>
                    <Button onClick={() => setView('list')}>
                        <List className="w-4 h-4 mr-2" />
                        View Templates
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Breadcrumb Navigation */}
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setView('list');
                                    }}
                                    className="cursor-pointer"
                                >
                                    Templates
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {currentTemplate.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('list')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Templates
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Email Template Editor
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Create and manage notification templates
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-200"
                        >
                            ID: {currentTemplate.id}
                        </Badge>
                        <Button variant="outline" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Template
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={isSending}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {isSending ? 'Sending...' : 'Send Email'}
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Template Configuration */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Template Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="templateName">
                                        Template Name
                                    </Label>
                                    <Input
                                        id="templateName"
                                        value={currentTemplate.name}
                                        onChange={(e) =>
                                            updateTemplate({
                                                name: e.target.value,
                                            })
                                        }
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="subject">
                                        Subject Line
                                    </Label>
                                    <Input
                                        id="subject"
                                        value={currentTemplate.subject}
                                        onChange={(e) =>
                                            updateTemplate({
                                                subject: e.target.value,
                                            })
                                        }
                                        className="mt-1"
                                        placeholder="Enter email subject..."
                                    />
                                </div>

                                <RecipientManager
                                    recipients={currentTemplate.recipients}
                                    onChange={(recipients) =>
                                        updateTemplate({ recipients })
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="compose">
                                    Compose Email
                                </TabsTrigger>
                                <TabsTrigger value="preview">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="compose" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Email Body</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RichTextEditor
                                            value={currentTemplate.body}
                                            onChange={(body) =>
                                                updateTemplate({ body })
                                            }
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="preview">
                                <EmailPreview template={currentTemplate} />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Panel - Variables */}
                    <div className="space-y-6">
                        <VariableSelector
                            variables={currentTemplate.variables}
                            onChange={(variables) =>
                                updateTemplate({ variables })
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateEditor;
