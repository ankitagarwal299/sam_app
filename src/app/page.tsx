'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowRight, BarChart3, Upload, FileText, PieChart } from 'lucide-react';

interface ModuleData {
  id: string;
  moduleName: string;
  moduleDescription: string;
  moduleImagePath: string;
  moduleUri: string;
  moduleIsDisabled: boolean;
  moduleIsHeight: boolean;
  modulePositionSequence: number;
}

interface ApiResponse {
  moduleDataList: ModuleData[];
}

const fetchModules = async (): Promise<ApiResponse> => {
  const res = await fetch('/api/account/v1/accounts/accesslevels/user');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function LandingPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['modules'],
    queryFn: fetchModules,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome to SAM</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading modules</div>;
  }

  // Sort by sequence
  const modules = data?.moduleDataList.sort((a, b) => a.modulePositionSequence - b.modulePositionSequence);

  // Helper to get icon based on name (since we don't have real images)
  const getIcon = (name: string) => {
    if (name.includes('Bulk')) return <Upload className="h-8 w-8 text-blue-500" />;
    if (name.includes('Enterprise')) return <BarChart3 className="h-8 w-8 text-purple-500" />;
    if (name.includes('Purchase')) return <FileText className="h-8 w-8 text-green-500" />;
    if (name.includes('Financial')) return <PieChart className="h-8 w-8 text-orange-500" />;
    return <BarChart3 className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Software Asset Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your enterprise software portfolio, purchase orders, and financial data efficiently.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules?.map((module) => (
            <Link
              href={module.moduleUri}
              key={module.id}
              className={`block transition-transform hover:-translate-y-1 ${module.moduleIsDisabled ? 'pointer-events-none opacity-50' : ''}`}
            >
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group">
                <CardHeader className="pb-4">
                  <div className="mb-4 p-3 bg-gray-100 rounded-full w-fit group-hover:bg-blue-50 transition-colors">
                    {getIcon(module.moduleName)}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {module.moduleName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {module.moduleDescription}
                  </CardDescription>
                  <div className="mt-6 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Access Module <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
