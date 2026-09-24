import { PageFrame } from "./page-frame";

type Section = { title: string; body: string };

export function LegalPage({ title, eyebrow, intro, sections }: { title: string; eyebrow: string; intro: string; sections: Section[] }) {
  return <PageFrame><main className="content-shell legal-page"><section className="page-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{intro}</p></section><div className="legal-content">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div></main></PageFrame>;
}
