import { startCase } from "lodash";
import { OrgControl } from "./_components/OrgControl";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "organozation"),
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="ml-5">
      <OrgControl />
      {children}
    </div>
  );
};

export default OrganizationIdLayout;
