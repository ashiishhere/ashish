import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AwardsTable } from '@/components/admin/AwardsTable';
import { db } from '@/lib/db';

async function getAwards() {
  return db.award.findMany({ orderBy: { createdAt: 'desc' } });
}

export default async function AdminAwardsPage() {
  const awards = await getAwards();

  return (
    <>
      <AdminHeader title="Awards" />
      <div className="p-6 lg:p-10">
        <div className="mb-6 flex justify-end">
          <Link href="/admin/awards/new" className="border border-accent bg-accent px-5 py-2.5 text-xs uppercase tracking-widest2 text-white">
            Add Award
          </Link>
        </div>

        <AwardsTable awards={awards} />
      </div>
    </>
  );
}
