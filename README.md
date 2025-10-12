# Email Playground

A Liferay client extension application for creating, previewing, and managing email notification templates.

## Project Overview

Email Playground is a custom element application for Liferay DXP that provides a user-friendly interface for:

- Creating and managing email notification templates
- Previewing email templates with variable substitution
- Managing recipients for email notifications
- Testing email templates with sample data

## Technologies Used

This project is built using:

- **React 19**: Modern UI library for building interactive interfaces
- **TypeScript**: For type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library built on Radix UI primitives
- **TanStack Router**: Type-safe routing for React applications
- **Liferay Headless REST Client**: For interacting with Liferay's REST APIs

## Project Structure

```
email-playground/
├── client-extensions/
│   └── email-playground-custom-element/  # Main application
│       ├── src/
│       │   ├── components/               # React components
│       │   ├── context/                  # React context providers
│       │   ├── hooks/                    # Custom React hooks
│       │   ├── lib/                      # Utility functions and API clients
│       │   ├── routes/                   # Application routes
│       │   └── styles/                   # CSS styles
│       ├── client-extension.yaml         # Client extension configuration
│       └── package.json                  # Dependencies and scripts
└── configs/                              # Liferay configuration files
```

## Email Playground Custom Element

The `email-playground-custom-element` is a Liferay client extension that provides a custom UI for managing email templates.

### Features

- **Template Management**: Create, edit, duplicate, and delete email templates
- **Rich Text Editor**: Format email content with a WYSIWYG editor
- **Variable Substitution**: Insert dynamic content using variables
- **Email Preview**: See how emails will look with variables replaced
- **Recipient Management**: Configure email recipients

### Key Components

- `TemplatesList`: Displays and manages the list of email templates
- `EmailTemplateEditor`: Interface for editing email template content
- `EmailPreview`: Shows a preview of the email with variables substituted
- `RecipientManager`: Manages email recipients
- `VariablesSelector`: Allows selection of variables to insert into templates

## Development

### Prerequisites

- Node.js (v18+)
- Yarn or npm
- Liferay DXP 7.4+

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd email-playground
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   cd client-extensions/email-playground-custom-element
   yarn dev
   ```

4. The application will be available at `http://localhost:5173/`

## Deployment

### Building the Client Extension

1. Build the client extension:
   ```bash
   cd client-extensions/email-playground-custom-element
   yarn build
   ```

2. The build output will be in the `build/vite` directory.

### Deploying to Liferay

1. Package the client extension:
   ```bash
   cd email-playground
   ./gradlew buildClientExtension
   ```

2. Deploy the client extension to Liferay:
   ```bash
   ./gradlew deployClientExtension
   ```

3. Alternatively, you can deploy the generated `.jar` file from the `build/client-extensions` directory manually to your Liferay instance.

### Configuration

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

This configuration:
- Registers the custom element as `email-playground-custom-element`
- Places it in the Applications menu
- Makes it non-instanceable (only one instance per page)
- Uses ES modules for JavaScript loading

## Accessing the Application

After deployment, the Email Playground application can be accessed through:

1. Liferay Control Panel > Applications > Custom Apps > Email Playground
2. Or by adding it to a page as a widget
