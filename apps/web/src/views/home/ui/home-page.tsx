import React from 'react';
import { Navbar } from '@/widgets/navbar/ui/navbar';
import { HeroSection } from '@/widgets/hero/ui/hero-section';
import { FeaturesGrid } from '@/widgets/features-grid/ui/features-grid';
import { TestHarness } from '@/widgets/test-harness/ui/test-harness';
import { ThemePlayground } from '@/widgets/theme-playground/ui/theme-playground';
import { CodeDocs } from '@/widgets/code-docs/ui/code-docs';
import { ApiTable } from '@/widgets/api-table/ui/api-table';
import { Footer } from '@/widgets/footer/ui/footer';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-dev-bg-200 text-dev-text-main flex min-h-screen flex-col font-sans transition-colors duration-200 selection:bg-neutral-800 selection:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-16 px-4 py-8 sm:space-y-24">
        {/* Hero Section */}
        <HeroSection />

        {/* 1. Core Feature Highlights */}
        <section id="features" className="scroll-mt-20">
          <FeaturesGrid />
        </section>

        {/* 2. Interactive Test Harness (Live Event Triggers) */}
        <section id="demo" className="scroll-mt-20">
          <TestHarness />
        </section>

        {/* 3. Live Props & Theme Customizer */}
        <section id="playground" className="scroll-mt-20">
          <ThemePlayground />
        </section>

        {/* 4. Quickstart & Framework Installation */}
        <section id="quickstart" className="scroll-mt-20">
          <CodeDocs />
        </section>

        {/* 5. Complete API Reference */}
        <section id="api" className="scroll-mt-20">
          <ApiTable />
        </section>
      </main>
      <Footer />
    </div>
  );
};
