import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Code,
    Type,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
}) => {
    const [isPreview, setIsPreview] = useState(false);

    const insertVariable = (variable: string) => {
        const textarea = document.getElementById(
            'email-body'
        ) as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue =
                value.substring(0, start) +
                `%${variable}%` +
                value.substring(end);
            onChange(newValue);
        }
    };

    const wrapSelection = (prefix: string, suffix: string = prefix) => {
        const textarea = document.getElementById(
            'email-body'
        ) as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = value.substring(start, end);
            const newValue =
                value.substring(0, start) +
                prefix +
                selectedText +
                suffix +
                value.substring(end);
            onChange(newValue);
        }
    };

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrapSelection('<strong>', '</strong>')}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrapSelection('<em>', '</em>')}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrapSelection('<u>', '</u>')}
                    title="Underline"
                >
                    <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrapSelection('<h2>', '</h2>')}
                    title="Heading"
                >
                    <Type className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrapSelection('<ul><li>', '</li></ul>')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrapSelection('<ol><li>', '</li></ol>')}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => wrapSelection('<code>', '</code>')}
                    title="Code"
                >
                    <Code className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                    className={isPreview ? 'bg-blue-100 text-blue-700' : ''}
                >
                    {isPreview ? 'Edit' : 'Preview'}
                </Button>
            </div>

            {/* Editor/Preview */}
            {isPreview ? (
                <div
                    className="min-h-[400px] p-4 border rounded-lg bg-white"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            ) : (
                <Textarea
                    id="email-body"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Enter your email content here. Use %VARIABLE_NAME% for dynamic content..."
                />
            )}

            {/* Quick Variables */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Quick insert:</span>
                {[
                    'CUSTOMER_NAME',
                    'ORDER_ID',
                    'TIMESTAMP',
                    'ERROR_SUMMARY',
                ].map((variable) => (
                    <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable)}
                        className="text-xs"
                    >
                        %{variable}%
                    </Button>
                ))}
            </div>
        </div>
    );
};
