import { OrgControl } from "./_components/OrgControl";

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="ml-5">
      <OrgControl />
      {children}
    </div>
  );
};

export default OrganizationIdLayout;
