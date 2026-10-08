import CompanyDetail from "@/components/companies/detail/company-detail";
import Profile from "@/components/companies/profile/profile";
import NewCompanyDialog from "@/components/companies/new-company/new-company-dialog";
import CommandMenu from "@/components/companies/command-menu/command-menu";

export default function Overlays() {
  return (
    <>
      <CompanyDetail />
      <Profile />
      <NewCompanyDialog />
      <CommandMenu />
    </>
  );
}
