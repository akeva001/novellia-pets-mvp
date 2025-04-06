# Novellia Pets MVP

A React Native mobile application for managing pet medical records, built as a takehome project. The app allows pet owners to track their pets' medical history, including vaccines, allergies, and lab results.

## Features

- Pet profile management (add, edit, delete pets)
- Medical record tracking:
  - Vaccines with dates
  - Allergies with reactions and severity
  - Lab results with dosage and instructions
- Document attachments support for medical records
- Intuitive UI with gradient buttons and animated dropdowns
- Secure user authentication

## Quick Start

Prerequisites:

- Node.js (v14 or higher)
- Xcode (for iOS simulator)
- Watchman (`brew install watchman`)
- Expo CLI (`npm install -g expo-cli`)

Run the app:

```bash
# Clone the repository
git clone [repository-url]
cd novellia-pets-mvp

# ✨ Run everything with a single command ✨
make start-all
```

Alternative iOS-specific setup:

```bash
make ios
```

> **Note**: `make start-all` handles everything - it cleans the project, installs dependencies, and launches both the backend server and frontend Expo app in one command.

## Available Make Commands

- `make start-all` - ⭐️ Setup and start both frontend and backend servers (recommended)
- `make ios` - Launch iOS simulator and start Expo
- `make start-server` - Start only the backend server
- `make start-ios` - Start only the Expo server for iOS
- `make setup` - Clean and reinstall all dependencies
- `make clean` - Clean project (remove node_modules, pods, etc.)
- `make help` - Show all available commands

## Technical Choices & Architecture

- **React Native + Expo**: For rapid iOS development and easy setup
- **TypeScript**: For type safety and better developer experience
- **Redux Toolkit**: For state management and data persistence
- **React Navigation**: For screen navigation and routing
- **React Native Elements**: For consistent UI components
- **Express.js**: For the backend server
