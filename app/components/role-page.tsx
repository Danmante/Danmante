import Link from "next/link";
import type { ReactNode } from "react";
import { PageFrame } from "./page-frame";

export type RolePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  statusDetail: string;
  cta: string;
  ctaHref: string;
  children: ReactNode;
};

export function RolePage({ eyebrow, title, description, status, statusDetail, cta, ctaHref, children }: RolePageProps) {
  return (
    <PageFrame>
      <main className="content-shell">
        <section className="page-hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede">{description}</p>
          <div className="cta-row"><Link href={ctaHref} className="button primary">{cta}</Link><Link href="/safety" className="button secondary">Read the safety model</Link></div>
        </section>
        <section className="status-banner" aria-label="Implementation status">
          <div><span className="status-dot" aria-hidden="true" /><strong>{status}</strong></div>
          <p>{statusDetail}</p>
        </section>
        {children}
      </main>
    </PageFrame>
  );
}
