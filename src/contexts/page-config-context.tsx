"use client";

import { createContext, useContext } from "react";
import type { AppConfig } from "@/lib/types";

interface PageConfigValue {
  config: AppConfig;
  allCards: string[];
  colorMap: Record<string, string>;
  cardColorMap: Record<string, string>;
  categoryNames: string[];
}

const PageConfigContext = createContext<PageConfigValue | null>(null);

export function usePageConfig(): PageConfigValue {
  const ctx = useContext(PageConfigContext);
  if (!ctx) throw new Error("usePageConfig must be used inside PageConfigProvider");
  return ctx;
}

interface ProviderProps extends PageConfigValue {
  children: React.ReactNode;
}

export function PageConfigProvider({
  config,
  allCards,
  colorMap,
  cardColorMap,
  categoryNames,
  children,
}: ProviderProps) {
  return (
    <PageConfigContext.Provider
      value={{ config, allCards, colorMap, cardColorMap, categoryNames }}
    >
      {children}
    </PageConfigContext.Provider>
  );
}
