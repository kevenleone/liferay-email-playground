import styles from '../styles/index.css?inline';

function apply(style: string) {
    return style.replaceAll(':root', ':host');
}

const sheet = new CSSStyleSheet();

sheet.replaceSync(apply(styles));

if (import.meta.hot) {
    import.meta.hot.accept('../styles/index.css?inline', (newModule) => {
        const _styles = newModule!.default;
        sheet.replaceSync(apply(_styles));
    });
}

export default sheet;
