/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { Layout } from './components/layout/Layout'

// Main Pages
import Dashboard from './pages/Dashboard'
import Academy from './pages/Academy'
import Marketplace from './pages/Marketplace'
import Enterprise from './pages/Enterprise'
import Compliance from './pages/Compliance'
import CloudServices from './pages/CloudServices'
import Development from './pages/Development'
import Learning from './pages/Learning'
import Atlas from './pages/Atlas'
import Council from './pages/Council'
import Pulse from './pages/Pulse'
import Signal from './pages/Signal'
import Vault from './pages/Vault'
import Vigil from './pages/Vigil'
import Mint from './pages/Mint'
import Aegis from './pages/Aegis'
import Forge from './pages/Forge'
import Nexus from './pages/Nexus'
import Scriptorium from './pages/Scriptorium'
import Synapse from './pages/Synapse'

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/cloud" element={<CloudServices />} />
          <Route path="/development" element={<Development />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/council" element={<Council />} />
          <Route path="/pulse" element={<Pulse />} />
          <Route path="/signal" element={<Signal />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/vigil" element={<Vigil />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/aegis" element={<Aegis />} />
          <Route path="/forge" element={<Forge />} />
          <Route path="/nexus" element={<Nexus />} />
          <Route path="/scriptorium" element={<Scriptorium />} />
          <Route path="/synapse" element={<Synapse />} />
        </Routes>
      </Layout>
      <Toaster />
    </div>
  )
}

export default App
