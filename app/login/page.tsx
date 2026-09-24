"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to sign in.");
      }

      setStatus({ type: "success", message: "Signed in successfully." });
      router.push("/dashboard");
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to sign in." });
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="eyebrow">Secure access</p>
          <h1>Welcome back</h1>
          <p className="lede">Sign in to manage your care journey, access clinical tools, and continue your work in the Danmante platform.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>

            <div className="form-actions">
              <button type="submit" className="button primary">Sign in</button>
              <Link href="/forgot-password" className="text-link">Reset password</Link>
            </div>
          </form>

          {status ? <p className={`status-message ${status.type}`}>{status.message}</p> : null}

          <div className="auth-alternative">
            <span>Need an account?</span>
            <Link href="/register">Create one</Link>
          </div>
        </section>

        <aside className="auth-panel">
          <p className="eyebrow">Why Danmante</p>
          <h2>Built for safer healthcare access</h2>
          <ul className="bullet-list">
            <li>Role-based access for patients, nurses, pharmacists, pharmacies, and administrators.</li>
            <li>Secure sessions and fail-closed governance checks.</li>
            <li>Designed to support the next phase of healthcare coordination and compliance.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
