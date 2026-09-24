"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/v1/auth/me", { credentials: "include" });
        if (!response.ok) {
          router.push("/login");
          return;
        }

        const payload = await response.json();
        setUser(payload.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  }

  if (loading) {
    return <main className="dashboard-shell"><p className="lede">Loading your dashboard…</p></main>;
  }

  if (!user) {
    return null;
  }

  const roleLabel = user.role.toLowerCase();

  return (
    <main className="dashboard-shell">
      <div className="auth-panel" style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Welcome, {user.name}</h1>
          </div>
          <button type="button" className="button secondary" onClick={handleLogout}>Log out</button>
        </div>

        <p className="lede">Role: {user.role}. You are accessing the {roleLabel} workspace within Danmante.</p>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <h3>Care overview</h3>
          <p>Track care coordination, status updates, and patient workflows using the secure Danmante operational model.</p>
        </article>
        <article className="dashboard-card">
          <h3>Verification</h3>
          <p>Monitor credential checks, safety validations, and jurisdiction controls before actions are processed.</p>
        </article>
        <article className="dashboard-card">
          <h3>Operations</h3>
          <p>Use the role-based workspace to complete tasks, review alerts, and coordinate next actions.</p>
        </article>
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/" className="button secondary">Back to home</Link>
        <Link href="/register" className="button secondary">Create another account</Link>
      </div>
    </main>
  );
}
