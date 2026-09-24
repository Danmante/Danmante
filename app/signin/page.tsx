import Link from "next/link";
import { PageFrame } from "../components/page-frame";

export default function SignInPage() {
  return <PageFrame><main className="content-shell"><section className="page-hero"><p className="eyebrow">Account access</p><h1>Start with the right workspace.</h1><p className="lede">Authentication is prepared as a role-aware entry point. Live sign-in, MFA, sessions, and account recovery require the backend identity service.</p></section><section className="audience-grid"><Link href="/patient" className="audience-card patient-card"><span className="card-kicker">Patient</span><h3>Find care and manage your journey.</h3><span className="card-arrow" aria-hidden="true">-&gt;</span></Link><Link href="/nurse" className="audience-card nurse-card"><span className="card-kicker">Nurse</span><h3>Prepare for professional access.</h3><span className="card-arrow" aria-hidden="true">-&gt;</span></Link><Link href="/pharmacy" className="audience-card pharmacy-card"><span className="card-kicker">Pharmacy</span><h3>Prepare for verified fulfillment.</h3><span className="card-arrow" aria-hidden="true">-&gt;</span></Link></section></main></PageFrame>;
}
