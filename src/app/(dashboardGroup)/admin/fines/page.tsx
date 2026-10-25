import { Suspense } from "react";
import AdminFineList from "@/components/modules/fine/admin-fine-list";

export default function AdminFinesPage() {
  // useSearchParams (used inside the list) needs a Suspense boundary.
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading fines...</div>}>
      <AdminFineList />
    </Suspense>
  );
}