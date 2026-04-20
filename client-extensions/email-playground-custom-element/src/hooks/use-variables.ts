import { useParams } from '@tanstack/react-router';
import { useSelector } from '@xstate/store/react';
import { variablesStore } from '@/store/VariablesStore';
import { useCallback, useMemo } from 'react';

function replace(text: string, variables: object, customMarkup = true) {
    const source = text || '';
    const vars = variables as Record<string, string>;

    return source.replace(/\[%(\w+)%\]/g, (match, key: string, offset: number) => {
        if (!(key in vars)) return match;

        const value = vars[key];

        if (!customMarkup) return value;

        const lastOpen = source.lastIndexOf('<', offset);
        const lastClose = source.lastIndexOf('>', offset);
        const insideTag = lastOpen > lastClose;

        if (insideTag) return value;

        return `<mark class="variable-highlight" title="${key}">${value}</mark>`;
    });
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

    return { replaceVariables };
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
