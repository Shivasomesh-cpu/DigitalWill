import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="md:ml-60 w-full flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
