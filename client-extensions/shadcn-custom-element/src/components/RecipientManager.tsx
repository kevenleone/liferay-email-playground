import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Mail, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecipientManagerProps {
    recipients: string[];
    onChange: (recipients: string[]) => void;
}

export const RecipientManager: React.FC<RecipientManagerProps> = ({
    recipients,
    onChange,
}) => {
    const { toast } = useToast();
    const [newRecipient, setNewRecipient] = useState('');

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const addRecipient = () => {
        const email = newRecipient.trim();

        if (!email) return;

        if (!isValidEmail(email)) {
            toast({
                title: 'Invalid Email',
                description: 'Please enter a valid email address.',
                variant: 'destructive',
            });
            return;
        }

        if (recipients.includes(email)) {
            toast({
                title: 'Duplicate Email',
                description: 'This email is already in the recipient list.',
                variant: 'destructive',
            });
            return;
        }

        onChange([...recipients, email]);
        setNewRecipient('');

        toast({
            title: 'Recipient Added',
            description: `${email} has been added to the recipient list.`,
        });
    };

    const removeRecipient = (email: string) => {
        onChange(recipients.filter((r) => r !== email));
        toast({
            title: 'Recipient Removed',
            description: `${email} has been removed from the recipient list.`,
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRecipient();
        }
    };

    return (
        <div className="space-y-3">
            <Label htmlFor="recipients" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Recipients ({recipients.length})
            </Label>

            {/* Add Recipient */}
            <div className="flex gap-2">
                <Input
                    id="recipients"
                    type="email"
                    placeholder="Enter email address..."
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                />
                <Button
                    onClick={addRecipient}
                    disabled={!newRecipient.trim()}
                    className="px-3"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {/* Recipients List */}
            {recipients.length > 0 && (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {recipients.map((email, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-2 pr-1 py-1"
                            >
                                <Mail className="w-3 h-3" />
                                {email}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRecipient(email)}
                                    className="h-4 w-4 p-0 hover:bg-red-100"
                                >
                                    <X className="w-3 h-3 text-red-600" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Add Common Recipients */}
            <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-gray-600">Quick add:</span>
                {[
                    'admin@company.com',
                    'support@company.com',
                    'devops@company.com',
                ]
                    .filter((email) => !recipients.includes(email))
                    .map((email) => (
                        <Button
                            key={email}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onChange([...recipients, email]);
                                toast({
                                    title: 'Recipient Added',
                                    description: `${email} has been added.`,
                                });
                            }}
                            className="text-xs h-6"
                        >
                            + {email}
                        </Button>
                    ))}
            </div>
        </div>
    );
};
