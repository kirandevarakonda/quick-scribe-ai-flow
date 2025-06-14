import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Search, FileText, Target, Zap } from 'lucide-react';
import { Header } from '@/components/Header';

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Create Engaging Content with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your ideas into compelling content with our AI-powered writing assistant.
              From keyword research to final content, we've got you covered.
            </p>
            <Link to="/workflow">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Writing
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Search className="h-5 w-5 text-blue-600" />
                  Keyword Research
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Discover high-performing keywords for your content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Target className="h-5 w-5 text-blue-600" />
                  Topic Selection
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose the perfect topic from AI-generated suggestions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Content Creation
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Generate high-quality, SEO-optimized content
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">
                Ready to Create Amazing Content?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Start your content creation journey with AI Content Writer
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/workflow">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                  <FileText className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
