"use client";

import PageHeader from "@/components/_common/page/page-header";
import { CLIENT_VIEWS, inScope } from "@/lib/companies";
import { useCompaniesStore } from "@/stores/companies-store";

export default function CompaniesHeader({ title }: { title: string }) {
  const companies = useCompaniesStore((state) => state.companies);
  const market = useCompaniesStore((state) => state.market);
  const activeTab = useCompaniesStore((state) => state.activeTab);
  const setActiveTab = useCompaniesStore((state) => state.setActiveTab);

  const tabs = CLIENT_VIEWS.map((view) => ({
    value: view.value,
    label: view.label,
    count: companies.filter((company) =>
      inScope(company, { market, view: view.value }),
    ).length,
  }));

  return (
    <PageHeader
      title={title}
      status="Active"
      tabs={tabs}
      tab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}
