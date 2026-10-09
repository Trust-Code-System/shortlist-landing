import { notFound } from "next/navigation";
import ComingSoonPage from "@/components/pages/coming-soon-page";
import { REGIONS } from "@/data/companies";

function regionBySlug(slug: string) {
  return REGIONS.find((region) => region.slug === slug);
}

export function generateStaticParams() {
  return REGIONS.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `${regionBySlug(slug)?.label ?? "Market"} · Shortlist Admin`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = regionBySlug(slug);
  if (!region) notFound();
  return <ComingSoonPage title={`Markets · ${region.label}`} />;
}
