
import { useState } from "react";
import { Header } from "@/components/Header";
import { ContentWizard } from "@/components/ContentWizard";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Content Writer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate SEO-optimized content in 4 simple steps. From keyword research to final content creation.
            </p>
          </div>
          
          <Card className="p-8 shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <ContentWizard />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
