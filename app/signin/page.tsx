import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="eyebrow">Account access</p>
          <h1>Start with the right workspace.</h1>
          <p className="lede">Use Danmante to sign in, create an account, or recover access to your role-based healthcare portal.</p>

          <div className="cta-row" style={{ marginTop: 28 }}>
            <Link href="/login" className="button primary">Sign in</Link>
            <Link href="/register" className="button secondary">Create account</Link>
          </div>

          <div className="auth-alternative" style={{ justifyContent: "flex-start" }}>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
        </section>

        <aside className="auth-panel">
          <p className="eyebrow">Role selection</p>
          <h2>Choose your path</h2>
          <div className="audience-grid" style={{ gridTemplateColumns: "1fr", gap: 14, marginTop: 18 }}>
            <Link href="/dashboard" className="audience-card patient-card" style={{ minHeight: 120, padding: 20 }}>
              <span className="card-kicker">Patient</span>
              <h3 style={{ marginTop: 18 }}>Access your care dashboard.</h3>
            </Link>
            <Link href="/dashboard" className="audience-card nurse-card" style={{ minHeight: 120, padding: 20 }}>
              <span className="card-kicker">Nurse</span>
              <h3 style={{ marginTop: 18 }}>Access clinical operations.</h3>
            </Link>
            <Link href="/dashboard" className="audience-card pharmacy-card" style={{ minHeight: 120, padding: 20 }}>
              <span className="card-kicker">Pharmacy</span>
              <h3 style={{ marginTop: 18 }}>Access fulfillment and verification.</h3>
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
