import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { JobsWorkspaceClient } from '../../components/jobs/JobsWorkspaceClient';

export default function JobsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <JobsWorkspaceClient />
      </div>
      <Footer />
    </div>
  );
}
