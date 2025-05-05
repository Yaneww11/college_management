# College Management System

A web application for managing college-related operations.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (comes with Node.js)

## Setup Instructions

### If You Already Have Vite and React

Simply run:

```bash
npm install && npm run dev
```

### If You Don't Have Vite or React

1. **Install Node.js and npm**
   
   If you don't have Node.js installed, download and install it from [nodejs.org](https://nodejs.org/).
   Verify the installation:
   
   ```bash
   node --version
   npm --version
   ```

2. **Create a Vite + React Project**

   If you're setting up from scratch:

   ```bash
   npm create vite@latest college_management -- --template react
   cd college_management
   ```

3. **Install Project Dependencies**

   ```bash
   npm install
   ```

4. **Running the Development Server**

   ```bash
   npm run dev
   ```
   
   This will start the development server. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173/).

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory which can be deployed to a web server.

## Preview Production Build

After building, you can preview the production build locally:

```bash
npm run preview
```
