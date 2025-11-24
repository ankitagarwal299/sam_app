import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                S
                            </div>
                            SAM
                        </Link>
                    </div>
                    <nav>
                        <Link href="/">
                            <Button variant="ghost" className="gap-2">
                                <Home className="w-4 h-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto p-8">
                {children}
            </main>
        </div>
    );
}
