import CompaniesHeader from "./header/header";
import CompaniesToolbar from "./toolbar/toolbar";
import CompaniesTable from "./table/companies-table";

export default function Companies({ title }: { title: string }) {
  return (
    <section id="clients" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <CompaniesHeader title={title} />
      <CompaniesToolbar />
      <CompaniesTable />
    </section>
  );
}
