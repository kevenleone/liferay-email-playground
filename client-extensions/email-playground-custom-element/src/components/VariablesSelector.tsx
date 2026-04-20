import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, Edit3, Trash2, Copy, Sparkles, Wand2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVariables } from '@/hooks/use-variables';
import {
    PRESET_VARIABLES,
    VariablePreset,
    extractVariables,
    guessPreset,
} from '@/lib/variable-presets';

type VariableSelectorProps = {
    templateText?: string;
};

export const VariableSelector = ({ templateText }: VariableSelectorProps) => {
    const { variables, setVariables } = useVariables();
    const { toast } = useToast();
    const [newVarName, setNewVarName] = useState('');
    const [newVarValue, setNewVarValue] = useState('');
    const [editingVar, setEditingVar] = useState<string | null>(null);
    const [customizingPreset, setCustomizingPreset] = useState<
        VariablePreset | null
    >(null);
    const [customPresetName, setCustomPresetName] = useState('');

    const addVariable = () => {
        if (!newVarName.trim()) return;

        const upperName = newVarName.toUpperCase().replace(/\s+/g, '_');

        setNewVarName('');
        setNewVarValue('');

        setVariables({
            ...variables,
            [upperName]: newVarValue,
        });

        toast({
            title: 'Variable Added',
            description: `Variable ${upperName} has been added.`,
        });
    };

    const addPresetVariable = (
        preset: VariablePreset,
        customName?: string,
    ) => {
        const generatedValue = preset.value();
        const variableName = customName || preset.name;

        setVariables({
            ...variables,
            [variableName]: generatedValue,
        });

        toast({
            title: 'Preset Variable Added',
            description: `Variable ${variableName} has been added with sample data.`,
        });
    };

    const handlePresetClick = (preset: VariablePreset) => {
        setCustomizingPreset(preset);
        setCustomPresetName(preset.name);
    };

    const discoveredVariables = useMemo(() => {
        return extractVariables(templateText).filter(
            (name) => !(name in variables),
        );
    }, [templateText, variables]);

    const fillAllWithPresets = () => {
        if (discoveredVariables.length === 0) return;

        const additions: Record<string, string> = {};
        let filled = 0;

        for (const name of discoveredVariables) {
            const preset = guessPreset(name) ?? PRESET_VARIABLES[0];
            additions[name] = preset.value();
            filled += 1;
        }

        setVariables({ ...variables, ...additions });

        toast({
            title: 'Variables Filled',
            description: `Auto-filled ${filled} variable${filled === 1 ? '' : 's'} with sample data.`,
        });
    };

    const handleCustomPresetAdd = () => {
        if (!customizingPreset || !customPresetName.trim()) return;

        const upperName = customPresetName.toUpperCase().replace(/\s+/g, '_');
        addPresetVariable(customizingPreset, upperName);

        setCustomizingPreset(null);
        setCustomPresetName('');
    };

    const cancelCustomPreset = () => {
        setCustomizingPreset(null);
        setCustomPresetName('');
    };

    const updateVariable = (name: string, value: string) => {
        setVariables({
            ...variables,
            [name]: value,
        });
        setEditingVar(null);
    };

    const deleteVariable = (name: string) => {
        const newVars = { ...variables } as any;

        delete newVars[name];

        setVariables(newVars);

        toast({
            title: 'Variable Deleted',
            description: `Variable ${name} has been removed.`,
        });
    };

    const copyVariable = (name: string) => {
        navigator.clipboard.writeText(name);

        toast({
            title: 'Copied to Clipboard',
            description: `${name} copied to clipboard.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Template Variables
                </CardTitle>

                <p className="text-sm text-gray-600">
                    Manage dynamic content replacements
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                {discoveredVariables.length > 0 && (
                    <div className="space-y-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-amber-900 flex items-center gap-1.5">
                                <Search className="w-3.5 h-3.5" />
                                Discovered in Template
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] ml-1"
                                >
                                    {discoveredVariables.length}
                                </Badge>
                            </Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fillAllWithPresets}
                                className="text-xs"
                                title="Auto-fill all discovered variables with matching presets"
                            >
                                <Wand2 className="w-3 h-3 mr-1" />
                                Fill all
                            </Button>
                        </div>

                        <p className="text-xs text-amber-800">
                            Found <code>[%VAR%]</code> tokens in the template
                            that aren't defined yet. Pick a preset to add one.
                        </p>

                        <div className="space-y-1.5">
                            {discoveredVariables.map((name) => {
                                const suggested = guessPreset(name);

                                return (
                                    <div
                                        key={name}
                                        className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-amber-100 min-w-0"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <Badge
                                                variant="outline"
                                                title={name}
                                                className="font-mono text-xs w-full max-w-full truncate justify-start"
                                            >
                                                {name}
                                            </Badge>
                                        </div>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs h-7 shrink-0 max-w-[45%]"
                                                    title={
                                                        suggested
                                                            ? `Add with preset ${suggested.name}`
                                                            : 'Add preset'
                                                    }
                                                >
                                                    <Plus className="w-3 h-3 mr-1 shrink-0" />
                                                    <span className="truncate">
                                                        {suggested
                                                            ? suggested.name
                                                            : 'Add preset'}
                                                    </span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                align="end"
                                                className="w-64"
                                            >
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">
                                                        Apply preset to{' '}
                                                        <code className="font-mono text-xs">
                                                            {name}
                                                        </code>
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                                                        {PRESET_VARIABLES.map(
                                                            (preset) => (
                                                                <Button
                                                                    key={
                                                                        preset.name
                                                                    }
                                                                    variant={
                                                                        suggested?.name ===
                                                                        preset.name
                                                                            ? 'secondary'
                                                                            : 'ghost'
                                                                    }
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        addPresetVariable(
                                                                            preset,
                                                                            name,
                                                                        )
                                                                    }
                                                                    className="justify-start text-xs h-8"
                                                                >
                                                                    <Plus className="w-3 h-3 mr-2" />
                                                                    {preset.name}
                                                                </Button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="varName"
                            className="text-sm font-medium"
                        >
                            Add New Variable
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Presets
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                {customizingPreset ? (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium">
                                            Customize Variable Name
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                            Adding preset:{' '}
                                            <strong>
                                                {customizingPreset.name}
                                            </strong>
                                        </p>
                                        <Input
                                            placeholder="Enter custom variable name"
                                            value={customPresetName}
                                            onChange={(e) =>
                                                setCustomPresetName(
                                                    e.target.value,
                                                )
                                            }
                                            className="text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={handleCustomPresetAdd}
                                                disabled={
                                                    !customPresetName.trim()
                                                }
                                                className="flex-1"
                                            >
                                                Add Variable
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={cancelCustomPreset}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium">
                                            Quick Add Presets
                                        </h4>
                                        <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                                            {PRESET_VARIABLES.map((preset) => (
                                                <Button
                                                    key={preset.name}
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePresetClick(
                                                            preset,
                                                        )
                                                    }
                                                    className="justify-start text-xs h-8"
                                                >
                                                    <Plus className="w-3 h-3 mr-2" />
                                                    {preset.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Input
                        id="varName"
                        placeholder="Variable name"
                        value={newVarName}
                        onChange={(e) => setNewVarName(e.target.value)}
                        className="text-sm"
                    />
                    <Input
                        placeholder="Default value"
                        value={newVarValue}
                        onChange={(e) => setNewVarValue(e.target.value)}
                        className="text-sm"
                    />
                    <Button
                        onClick={addVariable}
                        size="sm"
                        className="w-full"
                        disabled={!newVarName.trim()}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variable
                    </Button>
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-medium">
                        Current Variables
                    </Label>

                    {Object.entries(variables).map(([name, value]) => (
                        <div
                            key={name}
                            className="p-3 border rounded-lg space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <Badge
                                    variant="outline"
                                    title={name}
                                    className="font-mono text-xs"
                                >
                                    {name.length > 25
                                        ? `${name.substring(0, 25)}...`
                                        : name}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyVariable(name)}
                                        title="Copy variable"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingVar(name)}
                                        title="Edit variable"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteVariable(name)}
                                        title="Delete variable"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {editingVar === name ? (
                                <div className="space-y-2">
                                    <Input
                                        value={value as string}
                                        onChange={(e) =>
                                            updateVariable(name, e.target.value)
                                        }
                                        className="text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => setEditingVar(null)}
                                            className="flex-1"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingVar(null)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    {(value as string) || '<empty>'}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Quick Reference */}
                <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Quick Reference
                    </h4>
                    <p className="text-xs text-blue-700">
                        Use variables in your email by typing VARIABLE_NAME.
                        They will be replaced with actual values when the email
                        is sent.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
