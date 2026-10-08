import Companies from "@/components/companies/companies";
import MarketScope from "@/components/companies/market-scope";

export default function Home() {
  return (
    <>
      <MarketScope market="all" />
      <Companies title="Clients" />
    </>
  );
}
