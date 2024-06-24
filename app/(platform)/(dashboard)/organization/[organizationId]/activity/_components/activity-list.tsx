"use server";
import { getAuditLogs } from "@/actions/auditLogs/get-audit-logs";
import { Activityitem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLogType } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

interface ActivityListProps {
  data: AuditLogType[];
}

export const ActivityList = ({ data }: ActivityListProps) => {
  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {data?.map((log) => (
        <Activityitem key={log._id} data={log} />
      ))}
    </ol>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[75%] h-14" />
    </ol>
  );
};
