import AdminComplaintList from "@/components/modules/complaint/admin-complaint-list";
import { Suspense } from "react";


export default function ComplaintsPage() {
  // useSearchParams (used inside the list) needs a Suspense boundary.
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading complaints...</div>}>
      <AdminComplaintList />
    </Suspense>
  );
}