import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // middleware.ts already protects /admin/*, this is a defense-in-depth check
  // for server components that render before middleware redirects complete.
  if (!session) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar className="hidden w-64 shrink-0 lg:flex" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
