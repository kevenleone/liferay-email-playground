import { List } from 'lucide-react';
import { Button } from './ui/button';

export default function TemplateNotFound() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    No Template Selected
                </h2>

                <Button>
                    <List className="w-4 h-4 mr-2" />
                    View Templates
                </Button>
            </div>
        </div>
    );
}
