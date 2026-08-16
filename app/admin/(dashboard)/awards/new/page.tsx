import { AdminHeader } from '@/components/admin/AdminHeader';
import { AwardForm } from '@/components/admin/AwardForm';

export default function NewAwardPage() {
  return (
    <>
      <AdminHeader title="Add Award" />
      <div className="p-6 lg:p-10">
        <AwardForm />
      </div>
    </>
  );
}
