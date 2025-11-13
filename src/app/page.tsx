'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CircularSankeyHomepage } from '@/components/d3/CircularSankeyHomepage';
import { TitleDropdown } from '@/components/ui/TitleDropdown';

// Import the diagram data
import currentSystemData from '@/data/diagrams/system-overview-current.json';
import proposedSystemData from '@/data/diagrams/system-overview-proposed.json';

export default function HomePage() {
  const [showProposed, setShowProposed] = useState(false);

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
              <Link
                href="/oldpage"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                📄 Old Homepage
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="relative h-[400px] rounded-2xl shadow-2xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/hero-biochar.jpg"
                alt="The Biochar Revolution"
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
                <h1 className="text-5xl font-bold mb-4 text-white leading-tight">
                  THE BIOCHAR
                  <br />
                  REVOLUTION
                </h1>
                <p className="text-xl text-white mb-6">
                  Nourishing Chickens, Enriching Earth
                </p>
              </div>
            </div>

            {/* Biochar Innovations Inc. watermark */}
            <div className="absolute bottom-4 right-6 text-white text-sm">
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
              The poultry industry generates <strong>40+ million tonnes of waste annually</strong>, creating environmental challenges and disposal costs. Our integrated system transforms <strong>100% of poultry litter</strong> into biochar, renewable energy, and organic fertilizer—delivering <strong>net-negative carbon emissions</strong> while creating multiple revenue streams.
            </p>
            
            <p className="text-base text-gray-600 mb-6">
              Use the toggle below to compare current practices with our proposed circular system. <strong>Click components</strong> to explore detailed breakdowns (coming soon).
            </p>
          </div>
        </section>

        {/* System Toggle & Diagram */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Toggle Controls */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {showProposed ? 'Proposed Biochar System' : 'Current System'}
                </h2>
                <p className="text-sm text-gray-600">
                  {showProposed 
                    ? 'Circular economy with biochar, renewable energy, and zero waste'
                    : 'Traditional linear system with waste disposal challenges'
                  }
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setShowProposed(!showProposed)}
                className={`relative inline-flex h-12 w-56 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  showProposed
                    ? 'bg-green-600 focus:ring-green-500'
                    : 'bg-red-500 focus:ring-red-500'
                }`}
                aria-label="Toggle between current and proposed system"
              >
                <span
                  className={`inline-block h-10 w-24 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                    showProposed ? 'translate-x-[128px]' : 'translate-x-1'
                  }`}
                />
                <span className="absolute left-3 text-xs font-semibold text-white">
                  CURRENT
                </span>
                <span className="absolute right-3 text-xs font-semibold text-white">
                  PROPOSED
                </span>
              </button>
            </div>

            {/* Status Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Current System Card */}
              <div className={`p-4 rounded-lg border-2 transition-all ${
                !showProposed 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}>
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  Current Practice
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• High ammonia emissions (90% more)</li>
                  <li>• Expensive waste disposal</li>
                  <li>• Water pollution from runoff</li>
                  <li>• 100% fossil fuel dependency</li>
                </ul>
              </div>
              
              {/* Proposed System Card */}
              <div className={`p-4 rounded-lg border-2 transition-all ${
                showProposed 
                  ? 'border-green-600 bg-green-50' 
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}>
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <span>✓</span>
                  Proposed System
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 90% ammonia reduction with biochar</li>
                  <li>• Multiple revenue streams (biochar, energy)</li>
                  <li>• 95% water pollution reduction</li>
                  <li>• 100% renewable energy self-sufficient</li>
                </ul>
              </div>
            </div>

            {/* Sankey Diagram */}
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Material Flow Diagram
                </h3>
                <p className="text-sm text-gray-600">
                  Interactive diagram showing material and energy flows. Hover over components for details.
                  {!showProposed && ' Click "PROPOSED" toggle to see the circular biochar system.'}
                </p>
              </div>

              {/* Diagram Container */}
              <div className="bg-white rounded-lg p-4 shadow-inner">
                <CircularSankeyHomepage
                  diagramData={showProposed ? proposedSystemData : currentSystemData}
                  width={850}
                  height={700}
                />
              </div>

              {/* Legend */}
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">How to Read This Diagram:</h4>
                <ul className="text-sm text-gray-700 space-y-1 grid md:grid-cols-2 gap-2">
                  <li>• <strong>Icons</strong> represent system components</li>
                  <li>• <strong>Curved lines</strong> show material flows</li>
                  <li>• <strong>Line width</strong> indicates flow volume</li>
                  <li>• <strong>Hover</strong> for detailed information</li>
                  <li>• <strong>Animated dots</strong> show flow direction</li>
                  <li>• <strong>Click components</strong> to drill down (coming soon)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        {showProposed && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Why Switch to the Biochar System?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Environmental */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold mb-3">Environmental Impact</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Net-negative carbon emissions</li>
                    <li>• 95% reduction in water pollution</li>
                    <li>• 90% less ammonia emissions</li>
                    <li>• Permanent carbon sequestration</li>
                  </ul>
                </div>

                {/* Economic */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-bold mb-3">Economic Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Carbon credits: $177/tonne CO₂</li>
                    <li>• 100% energy independence</li>
                    <li>• Premium biochar sales revenue</li>
                    <li>• Eliminate disposal costs</li>
                  </ul>
                </div>

                {/* Operational */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold mb-3">Operational Gains</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Lower bird mortality rates</li>
                    <li>• Improved feed conversion</li>
                    <li>• Better air quality in houses</li>
                    <li>• 25-37% more biogas production</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}
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
