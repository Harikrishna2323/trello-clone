import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/info";
import { ActivityList } from "./_components/activity-list";
import { getAuditLogs } from "@/actions/auditLogs/get-audit-logs";

const ActivityPage = async () => {
  const { orgId } = auth();

  if (!orgId) redirect("/select-org");

  const auditLogs = await getAuditLogs({ orgId });

  return (
    <div className="w-full">
      <Info />
      <Separator />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList data={auditLogs?.data!} />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
