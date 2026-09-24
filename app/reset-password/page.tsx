"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to reset password.");
      }

      setStatus({ type: "success", message: "Password updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to reset password." });
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="eyebrow">Secure reset</p>
          <h1>Set a new password</h1>
          <p className="lede">Choose a strong password to protect your dashboard and care workflows.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="password">New password</label>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>

            <div className="form-actions">
              <button type="submit" className="button primary">Update password</button>
              <Link href="/login" className="text-link">Sign in</Link>
            </div>
          </form>

          {status ? <p className={`status-message ${status.type}`}>{status.message}</p> : null}
        </section>

        <aside className="auth-panel">
          <p className="eyebrow">Password guidance</p>
          <h2>Policy checks</h2>
          <ul className="bullet-list">
            <li>At least 8 characters long.</li>
            <li>Includes upper and lower case letters.</li>
            <li>Includes numbers and symbols.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="auth-shell"><p className="lede">Loading reset form…</p></main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
