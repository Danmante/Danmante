"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to process reset request.");
      }

      setStatus({ type: "success", message: "If an account exists, a reset link was created." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to process reset request." });
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="eyebrow">Account recovery</p>
          <h1>Forgot password</h1>
          <p className="lede">Enter the email linked to your Danmante account to begin a secure reset.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="form-actions">
              <button type="submit" className="button primary">Send reset link</button>
              <Link href="/login" className="text-link">Back to sign in</Link>
            </div>
          </form>

          {status ? <p className={`status-message ${status.type}`}>{status.message}</p> : null}
        </section>

        <aside className="auth-panel">
          <p className="eyebrow">Security</p>
          <h2>Protected recovery flow</h2>
          <ul className="bullet-list">
            <li>Reset tokens expire quickly.</li>
            <li>Passwords must meet secure health-platform policy.</li>
            <li>Session state remains separate from password recovery.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
