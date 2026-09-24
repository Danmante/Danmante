"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PATIENT" });
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to create account.");
      }

      setStatus({ type: "success", message: "Account created. You can sign in now." });
      setForm({ name: "", email: "", password: "", role: "PATIENT" });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to create account." });
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="eyebrow">Create account</p>
          <h1>Join Danmante</h1>
          <p className="lede">Set up your healthcare workspace and access the platform with the right role.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
              </div>

              <div className="field">
                <label htmlFor="role">Role</label>
                <select id="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  <option value="PATIENT">Patient</option>
                  <option value="NURSE">Nurse</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="PHARMACY">Pharmacy</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            </div>

            <div className="form-actions">
              <button type="submit" className="button primary">Create account</button>
            </div>
          </form>

          {status ? <p className={`status-message ${status.type}`}>{status.message}</p> : null}

          <div className="auth-alternative">
            <span>Already have access?</span>
            <Link href="/login">Sign in</Link>
          </div>
        </section>

        <aside className="auth-panel">
          <p className="eyebrow">Access model</p>
          <h2>Role-aware operations</h2>
          <ul className="bullet-list">
            <li>Patients can coordinate care and access personal health information.</li>
            <li>Nurses and pharmacists can manage tasks and verify care workflows.</li>
            <li>Pharmacies and admins can operate the governance and policy layers.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
