![Logo](./public/logo/full.svg)

# Regla Platform Center V2

This project is dedicated to the Regla Project, aimed at addressing complex back-to-back requirements that can sometimes be challenging. The goal is to modernize and revamp this project as long as I remain part of the team.

## Optimization

> The project includes several improvements, such as enhanced performance, an improved user experience, and cleaner code architecture.

## Environment Variables

To run this project locally, you must include the following environment variables in your .env file

```
NEXT_PUBLIC_BASE_API=https://{branch}.{env}.regla.cloud/api
NEXT_PUBLIC_APP_ID={APP_ID}
```

## Tech Stack

**Client:** React + NextJS, Chakra UI

**Server:** NodeJS

## Features

- **Theme Mode**: Users can customize their theme preference, which is stored server-side.
- **Dynamic Routing**: The platform supports parallel, intercepting, and dynamic routes based on API responses.
- **Role-Based Access Control (RBAC)**: Pages and features are displayed based on user privileges.
- **Sticky Sidebar and Header**: These elements remain fixed for better user navigation.
- **Animated Routing**: Page transitions include slide-in and fade-in animations.
- **Realtime Notification**: Implement Websocket for realtime notification.
- **TBD**: Additional features will be added in future updates.

## To do

- **Password Rules**: Provides users with clear guidance on password strength and complexity requirements to enhance security.
- **Route Change Prevention**: Prevents users from navigating away from a page if there are unsaved changes, thereby safeguarding data integrity.

## Installation & Development

This project is intended for internal use only. To set up, you must first download WireGuard and request the necessary user credentials.

To ensure better performance, please use `bun` as the package manager.

Clone the repository and navigate to the project folder:

```bash
    $ git clone git@github.com:LangRizkie/regla-v2.git
    $ cd platform-center-v2-chakra-ui
    $ bun install
```

Run the development server:

```bash
    $ bun dev
```

## Project Structure

The directory structure is as follows:

```bash
├───.husky                                  (configuration git commits helper)
├───.vscode                                 (internal project settings.json)
├───public                                  (public folder to serve static assets)
└───src                                     (source folder containing main application code)
    ├───app                                 (application folder for main pages)
    ├───components                          (components folder)
    │   ├───pages                           (component for page UI)
    │   └───ui                              (component for reusable UI)
    ├───config                              (base configuration library)
    ├───hooks                               (reusable hook helper)
    ├───libraries                           (repeat usability library)
    │   ├───mutation                        (mutation folder)
    │   └───schemas                         (schema validation folder)
    ├───stores                              (Zustand store management)
    ├───types                               (TypeScript type definitions)
    └───utilities                           (utility functions and constants)
```

## Developer

- [@langrizkie](https://github.com/LangRizkie)
