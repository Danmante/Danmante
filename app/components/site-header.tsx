"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Find Care", "/patient"],
  ["For Nurses", "/nurse"],
  ["For Pharmacies", "/pharmacy"],
  ["Safety", "/safety"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" onClick={closeMenu} aria-label="Danmante home">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span>
            <strong>Danmante</strong>
            <small>Healthcare access, connected.</small>
          </span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close" : "Open"} navigation</span>
          <span aria-hidden="true">{open ? "x" : "☰"}</span>
        </button>
        <nav id="site-navigation" className={`site-nav${open ? " is-open" : ""}`} aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={closeMenu}>{label}</Link>
          ))}
          <Link href="/signin" onClick={closeMenu}>Sign in</Link>
          <Link href="/patient" className="nav-cta" onClick={closeMenu}>Get started</Link>
        </nav>
      </div>
    </header>
  );
}
