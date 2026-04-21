import { useParams } from '@tanstack/react-router';
import { useSelector } from '@xstate/store/react';
import { variablesStore } from '@/store/VariablesStore';
import { useCallback, useMemo } from 'react';

function escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replace(text: string, variables: object, customMarkup = true) {
    const source = text || '';
    const vars = variables as Record<string, string>;

    return Object.entries(vars).reduce((result, [key, value]) => {
        if (!customMarkup) {
            return result.split(key).join(value);
        }

        return result.replace(new RegExp(escapeRegex(key), 'g'), (match, offset) => {
            const lastOpen = result.lastIndexOf('<', offset);
            const lastClose = result.lastIndexOf('>', offset);
            const insideTag = lastOpen > lastClose;

            if (insideTag) return value;

            return `<mark class="variable-highlight" title="${key}">${value}</mark>`;
        });
    }, source);
}

export function useVariablesFlat() {
    const allVariables = useSelector(
        variablesStore,
        ({ context }) => context.variables,
    );

    const replaceVariables = useCallback(
        (text: string, variable: string, customMarkup = true): string => {
            return replace(text, allVariables[variable] ?? {}, customMarkup);
        },
        [allVariables],
    );

    const hasVariables = useCallback(
        (externalReferenceCode: string): boolean => {
            const stored = allVariables[externalReferenceCode];
            return !!stored && Object.keys(stored).length > 0;
        },
        [allVariables],
    );

    return { allVariables, hasVariables, replaceVariables };
}

export function useVariables() {
    const { externalReferenceCode } = useParams({
        from: '/templates/$externalReferenceCode',
    });

    const allVariables = useSelector(
        variablesStore,
        ({ context }) => context.variables,
    );

    const variables = useMemo(() => {
        return allVariables[externalReferenceCode] || {};
    }, [allVariables, externalReferenceCode]);

    const replaceVariables = useCallback(
        (text: string, customMarkup = true): string => {
            return replace(text, variables, customMarkup);
        },
        [variables],
    );

    return {
        replaceVariables,
        variables,
        setVariables: (newValues: Record<string, string>) => {
            const values = {
                ...newValues,
            };

            variablesStore.send({
                externalReferenceCode,
                values,
                type: 'setVariables',
            });
        },
    };
}
