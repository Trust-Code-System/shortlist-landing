import { notFound } from "next/navigation";
import Companies from "@/components/companies/companies";
import MarketScope from "@/components/companies/market-scope";

const MARKETS: Record<string, string> = {
  nigeria: "Nigeria",
  "uk-ireland": "UK & Ireland",
  "canada-remote": "Canada & remote",
};

export function generateStaticParams() {
  return Object.keys(MARKETS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${MARKETS[slug] ?? "Market"} · Shortlist Admin` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const market = MARKETS[slug];
  if (!market) notFound();
  return (
    <>
      <MarketScope market={market} />
      <Companies title={`Clients · ${market}`} />
    </>
  );
}
