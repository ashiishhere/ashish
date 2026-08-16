import { notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AwardForm } from '@/components/admin/AwardForm';
import { db } from '@/lib/db';

export default async function EditAwardPage({ params }: { params: { id: string } }) {
  const award = await db.award.findUnique({ where: { id: params.id }, include: { galleryImages: { orderBy: { sortOrder: 'asc' } } } });
  if (!award) notFound();

  return (
    <>
      <AdminHeader title="Edit Award" />
      <div className="p-6 lg:p-10">
        <AwardForm initialAward={award} />
      </div>
    </>
  );
}
