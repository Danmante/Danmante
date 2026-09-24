import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand footer-logo"><span className="brand-mark" aria-hidden="true">D</span><strong>Danmante</strong></div>
          <p>Healthcare access, connected.</p>
          <p className="footer-note">A jurisdiction-aware digital health foundation for safer access and professional workflows.</p>
        </div>
        <div>
          <h2>Platform</h2>
          <Link href="/patient">Find Care</Link>
          <Link href="/nurse">For Nurses</Link>
          <Link href="/pharmacy">For Pharmacies</Link>
          <Link href="/safety">Safety</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link href="/about">About Danmante</Link>
          <a href="mailto:hello@danmante.org">Contact</a>
          <Link href="/about#careers">Careers</Link>
        </div>
        <div>
          <h2>Legal</h2>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/accessibility">Accessibility</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Danmante. Draft platform materials require review before regulated deployment.</span>
        <span className="emergency-inline">Medical emergency? Contact local emergency services immediately.</span>
      </div>
    </footer>
  );
}
