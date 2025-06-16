import { createRoot, Root } from 'react-dom/client';

import styles from './index.css?inline';
import App from './App';
import ShadcnContextProvider from './context/ShadcnContextProvider.tsx';

function apply(style: string) {
    return style.replaceAll(':root', ':host');
}

const sheet = new CSSStyleSheet();

sheet.replaceSync(apply(styles));

if (import.meta.hot) {
    import.meta.hot.accept('./index.css?inline', (newModule) => {
        const _styles = newModule!.default;
        sheet.replaceSync(apply(_styles));
    });
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
                    <App />
                </ShadcnContextProvider>,
            );
        }
    }
}

customElements.define('shadcn-custom-element', ShadcnCustomElement);
