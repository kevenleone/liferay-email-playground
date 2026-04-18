import { createRoot, Root } from 'react-dom/client';

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
    context: { shadowRoot: document },
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
                    <>
                        <Toaster />
                        <RouterProvider context={{ shadowRoot: this.shadowRoot }} router={router} />
                    </>
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
