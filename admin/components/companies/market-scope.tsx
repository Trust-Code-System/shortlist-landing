"use client";

import { useEffect } from "react";
import { useCompaniesStore } from "@/stores/companies-store";

export default function MarketScope({ market }: { market: string }) {
  const setMarket = useCompaniesStore((state) => state.setMarket);

  useEffect(() => {
    setMarket(market);
  }, [market, setMarket]);

  return null;
}
