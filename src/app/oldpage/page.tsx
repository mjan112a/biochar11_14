'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SystemDiagramWrapper } from '@/components/system/SystemDiagramWrapper';
import { CircularSankeyDiagramV2 } from '@/components/d3/CircularSankeyDiagramV2';
import { WelcomeModal } from '@/components/ui/WelcomeModal';
import { TitleDropdown } from '@/components/ui/TitleDropdown';
import { DiagramTabs } from '@/components/ui/DiagramTabs';
import DiagramManager from '@/components/homepage/DiagramManager';

export default function OldHomePage() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/images/wastehub-logo.png"
              alt="WasteHub"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
            <div className="h-8 w-px bg-gray-300" />
            <TitleDropdown />
          </div>
          
          {/* Navigation Links */}
          <nav className="flex items-center justify-between mt-4 border-t border-gray-200 pt-3">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                ← Back to New Homepage
              </Link>
              <Link
                href="/trial-results"
                className="text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                📊 Trial Results
              </Link>
              <Link
                href="/intellectual-property"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                🔒 Intellectual Property
              </Link>
            </div>
            
            {/* Edit Mode Toggle (Admin Only) */}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                editMode
                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle diagram card edit mode"
            >
              {editMode ? '✏️ Edit Mode: ON' : '✏️ Edit Mode'}
            </button>
          </nav>
        </div>
      </header>

      {/* Diagram Tabs Navigation */}
      <DiagramTabs />

      {/* Welcome Modal */}
      <WelcomeModal />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="relative h-[500px] rounded-2xl shadow-2xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/hero-biochar.jpg"
                alt="The Biochar Revolution - Chickens and Biochar"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center px-12">
              <div className="max-w-2xl">
                <h2 className="text-6xl font-bold mb-4 text-white leading-tight">
                  THE BIOCHAR
                  <br />
                  REVOLUTION
                </h2>
                <p className="text-2xl text-white mb-8">
                  Nourishing Chickens,
                  <br />
                  Enriching Earth
                </p>
                
                {/* Start Here Button */}
                <button
                  onClick={() => {
                    const element = document.getElementById('system-overview');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  SEE HOW IT WORKS
                </button>
              </div>
            </div>

            {/* Biochar Innovations Inc. watermark */}
            <div className="absolute bottom-6 right-6 text-white text-sm">
              Biochar Innovations Inc.
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-600">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Poultry Waste to Value: A Circular Solution
            </h2>
            
            <p className="text-lg text-gray-700 mb-4">
              The poultry industry generates <strong>40+ million tonnes of waste annually</strong>, creating environmental challenges and disposal costs. This integrated system transforms <strong>100% of poultry litter</strong> into biochar, renewable energy, and organic fertilizer—delivering <strong>net-negative carbon emissions</strong> while creating multiple revenue streams.
            </p>
            
            <p className="text-base text-gray-600 mb-4">
              Learn about the way this industry works below.  Use the toggle button to compare current practices with the our proposed circular system. <strong>Click each component</strong> to see detailed benefits for farms, processing plants, and the environment.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {/* Current Practice */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  Current Practice
                </h3>
                <p className="text-sm text-gray-700">
                  Litter disposal creates nutrient runoff, ammonia emissions, and waste management costs.
                </p>
              </div>
              
              {/* Proposed System */}
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <span>✓</span>
                  Proposed System
                </h3>
                <p className="text-sm text-gray-700">
                  Split-stream processing through anaerobic digestion and pyrolysis captures energy, produces biochar for carbon credits (<strong>$177/tonne CO₂</strong>), and recovers <strong>95% of nutrients</strong>—with <strong>25-37% more methane</strong> than digestion alone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Diagram */}
        <section id="system-overview">
          <SystemDiagramWrapper activeFilter={null} />
        </section>

        {/* Circular Sankey Flow Diagram */}
        <section className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Material Flow Visualization
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Watch the <strong>animated material flows</strong> as they move through the system.
              The moving dots show how materials, energy, and biochar circulate through the processes,
              with <strong>closed-loop flows</strong> highlighting the circular economy principles.
            </p>
            
            <CircularSankeyDiagramV2 />
            
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">Understanding the Visualization:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Moving dots</strong> represent material and energy flows</li>
                <li>• <strong>Dot speed</strong> indicates flow type (faster for energy, slower for materials)</li>
                <li>• <strong>Dot density</strong> shows flow volume (more dots = higher volume)</li>
                <li>• <strong>Dashed paths</strong> indicate circular/reuse flows</li>
                <li>• <strong>Hover over nodes</strong> to see connections and details</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dynamic Diagram Cards Section */}
        <DiagramManager editMode={editMode} />
      </main>

      {/* Call to Action Footer */}
      <footer className="relative mt-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/footer-background.jpg"
            alt="Footer Background"
            fill
            className="object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Waste Hub&apos;s Patent-Pending Poultry Bioloop™ Process
            </h2>
            <p className="text-xl text-green-50 mb-8 max-w-3xl mx-auto">
              Transform poultry waste into revenue. Our integrated biochar-energy system delivers measurable results: <strong>lower mortality</strong>, <strong>improved feed conversion</strong>, and <strong>multiple income streams</strong>—while eliminating disposal costs and environmental liabilities.
            </p>
            
            <p className="text-lg text-white mb-6 font-semibold">
              Ready to pilot this system at your operation?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-green-700 hover:bg-green-50 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]">
                Contact Us
              </button>
              <button className="bg-green-600 text-white hover:bg-green-500 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]">
                Request Trial Proposal
              </button>
              <button className="bg-blue-600 text-white hover:bg-blue-500 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]">
                Download Technical Brief
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-white/20 bg-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-white/80">
              © 2025 WasteHub. Converting waste into value through circular economy solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}