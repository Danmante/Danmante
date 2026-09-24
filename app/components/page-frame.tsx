import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageFrame({ children }: { children: ReactNode }) {
  return <><SiteHeader />{children}<SiteFooter /></>;
}
