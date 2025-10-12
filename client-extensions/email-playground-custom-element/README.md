# Email Playground Custom Element

A Liferay client extension for creating, previewing, and managing email notification templates.

## Overview

This custom element provides a user-friendly interface for managing email templates in Liferay DXP. It allows users to create, edit, preview, and send email templates with dynamic content using variable substitution.

## Features

- **Template Management**: Create, edit, duplicate, and delete email templates
- **Rich Text Editor**: Format email content with a WYSIWYG editor
- **Variable Substitution**: Insert dynamic content using variables
- **Email Preview**: See how emails will look with variables replaced
- **Recipient Management**: Configure email recipients

## Technologies

- **React 19**: Modern UI library for building interactive interfaces
- **TypeScript**: For type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library built on Radix UI primitives
- **TanStack Router**: Type-safe routing for React applications
- **Liferay Headless REST Client**: For interacting with Liferay's REST APIs

## Project Structure

```
email-playground-custom-element/
├── src/
│   ├── components/               # React components
│   │   ├── EmailPreview.tsx      # Email preview component
│   │   ├── EmailTemplateEditor.tsx # Template editor component
│   │   ├── RecipientManager.tsx  # Recipient management component
│   │   ├── TemplatesList.tsx     # Templates list component
│   │   └── VariablesSelector.tsx # Variables selection component
│   ├── context/                  # React context providers
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions and API clients
│   ├── routes/                   # Application routes
│   └── styles/                   # CSS styles
├── client-extension.yaml         # Client extension configuration
└── package.json                  # Dependencies and scripts
```

## Development

### Prerequisites

- Node.js (v18+)
- Yarn or npm
- Liferay DXP 7.4+

### Local Development

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn dev
   ```

3. The application will be available at `http://localhost:5173/`

## Building

Build the client extension:
```bash
yarn build
```

The build output will be in the `build/vite` directory.

## Deployment

### Using Gradle

From the root project directory:
```bash
./gradlew buildClientExtension
./gradlew deployClientExtension
```

### Manual Deployment

1. Build the client extension as described above
2. Deploy the generated `.jar` file from the root project's `build/client-extensions` directory to your Liferay instance

## Configuration

The client extension is configured in the `client-extension.yaml` file:

```yaml
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
        - "main.js"
    useESM: true
```

## Accessing the Application

After deployment, the Email Playground application can be accessed through:

1. Liferay Control Panel > Applications > Custom Apps > Email Playground
2. Or by adding it to a page as a widget
