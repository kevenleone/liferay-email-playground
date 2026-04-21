# Email Playground Custom Element

A Liferay client extension for composing, previewing, and testing email notification templates with dynamic variable substitution.

## Overview

Email Playground provides a UI on top of Liferay's notification template system. It lets you author HTML email templates, fill in `[%VARIABLE%]` tokens with realistic sample data, preview the rendered result in a live iframe, and queue a test send — all without leaving the browser.

The app runs as a custom web component (`<email-playground-custom-element>`) in an isolated shadow DOM and is accessible from the Liferay admin panel under **Applications > Custom Apps > Email Playground**.

## Features

- **Template list** — searchable table of all notification templates with edit, duplicate, and delete actions; indicators show which templates have saved variables
- **HTML editor** — rich text toolbar (bold, italic, underline, heading, lists, code) with compose/preview tabs
- **Variable system** — `[%TOKEN%]` syntax with full-token matching so any delimiter format works; variables are stored per-template in `localStorage`
- **Variable discovery** — scans the template body/subject for unknown tokens and surfaces them for quick setup
- **Preset variables** — 16 built-in presets (name, email, company, order ID, amount, image URL, …) backed by Faker.js; smart-guessing maps token names to the right preset automatically
- **Live preview** — sandboxed iframe rendering with responsive image/table styles and `[%TOKEN%]` highlights
- **Recipient management** — email validation, badge list, quick-add shortcuts
- **Send test email** — queues an entry via `postNotificationQueueEntry` with all variables resolved

## Tech stack

| Concern | Library |
|---|---|
| UI framework | React 19 |
| Routing | TanStack Router (file-based) |
| State | XState Store 3 |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Build | Vite 8 + TypeScript |
| Sample data | Faker.js |
| Liferay API | `@liferay/headless-rest-client` |

## Project structure

```
src/
├── components/
│   ├── EmailTemplateEditor.tsx   # main editor (subject, body, recipients, send)
│   ├── EmailPreview.tsx          # live preview with variable replacement
│   ├── EmailRender.tsx           # sandboxed iframe renderer
│   ├── RichTextEditor.tsx        # HTML toolbar editor
│   ├── RecipientManager.tsx      # recipient input & badge list
│   ├── TemplatesList.tsx         # home screen table
│   ├── TemplateNotFound.tsx      # 404 state
│   ├── VariablesSelector.tsx     # variable manager sidebar
│   └── ui/                       # shadcn primitives
├── context/
│   └── ShadcnContextProvider.tsx # shadow DOM root context
├── hooks/
│   ├── use-variables.ts          # variable read/write/replace hooks
│   ├── use-toast.ts              # toast notification system
│   └── use-scroll-unlock.ts      # shadow DOM scroll isolation
├── lib/
│   ├── liferay-headless.ts       # Liferay API client (CSRF injection)
│   ├── liferay.ts                # Liferay global types & fallbacks
│   ├── variable-presets.ts       # PRESET_VARIABLES, extractVariables, guessPreset
│   └── utils.ts                  # cn() class utility
├── routes/
│   ├── __root.tsx                # root layout + breadcrumb
│   ├── index.tsx                 # / — template list
│   └── templates/
│       └── $externalReferenceCode.tsx  # /templates/:erc — editor
└── store/
    └── VariablesStore.ts         # xstate store, persists to localStorage
```

## Variable system

Variables follow the `[%TOKEN%]` convention used by Liferay notification templates. The full token (including delimiters) is used as the key in storage, so the replacement is delimiter-agnostic — any wrapper format works as long as the stored key matches what appears in the template.

**How replacement works:**

1. `extractVariables()` scans template text and collects every `[%TOKEN%]` full match.
2. Unknown tokens appear in the "Discovered in Template" panel so you can assign a value or preset.
3. On preview and send, `replace()` iterates stored keys and does a literal `replaceAll` — no regex capture, so keys with any prefix/suffix are handled correctly.
4. In the preview, replaced values are wrapped in `<mark class="variable-highlight">` for visibility. On send, plain values are used.

## Development

**Prerequisites:** Node.js 18+, Bun (or npm/yarn), Liferay DXP 7.4+

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:5173)
bun dev

# Type-check + build
bun run build

# Lint
bun run lint
```

## Building & deployment

```bash
# Build the client extension
bun run build
```

Output lands in `build/vite/`.

**Via Gradle (from the repo root):**

```bash
./gradlew buildClientExtension
./gradlew deployClientExtension
```

This produces a `.jar` in the root `build/client-extensions/` directory that you drop into your Liferay instance.

## Client extension configuration

```yaml
# client-extension.yaml
assemble:
  - from: build/vite
    into: static

email-playground-custom-element:
  friendlyURLMapping: email-playground-custom-element
  htmlElementName: email-playground-custom-element
  instanceable: false
  name: Email Playground
  panelAppOrder: 700
  panelCategoryKey: applications_menu.applications.custom.apps
  portletCategoryName: category.client-extensions
  type: customElement
  urls:
    - main.js
  useESM: true
```

## Accessing the application

After deployment, open **Liferay Control Panel → Applications → Custom Apps → Email Playground**, or add the widget to any page.
