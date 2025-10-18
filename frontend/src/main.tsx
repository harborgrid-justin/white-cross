/**
 * WF-MAIN-149 | main.tsx - Application entry point and React DOM rendering
 * Purpose: application entry point and react dom rendering
 * Upstream: ./App.tsx | Dependencies: react, react-dom/client, ./App.tsx
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: React components/utilities | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: application entry point and react dom rendering, part of React frontend architecture
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)