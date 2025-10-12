import { createRoot, Root } from 'react-dom/client';

import ShadcnContextProvider from './context/ShadcnContextProvider.tsx';
import {
    createHashHistory,
    createRouter,
    RouterProvider,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import sheet from './core/tailwind-style.ts';
import { Toaster } from './components/ui/toaster.tsx';

import './styles/liferay.css';

const hashHistory = createHashHistory();

const router = createRouter({
    basepath: '/templates',
    history: hashHistory,
    routeTree,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

class ShadcnCustomElement extends HTMLElement {
    private root: Root | undefined;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!this.root) {
            const mountPoint = document.createElement('div');

            this.shadowRoot!.appendChild(mountPoint);
            this.shadowRoot!.adoptedStyleSheets = [sheet];

            this.root = createRoot(mountPoint);

            this.root.render(
                <ShadcnContextProvider shadowRoot={this.shadowRoot}>
                    <Toaster />
                    <RouterProvider router={router} />
                </ShadcnContextProvider>,
            );
        }
    }
}

if (!customElements.get('email-playground-custom-element')) {
    customElements.define(
        'email-playground-custom-element',
        ShadcnCustomElement,
    );
}
