import Link from "next/link";
import SignInForm from "./sign-in-form";

export const metadata = {
  title: "Admin Sign In",
  description: "Access the administrative dashboard.",
};

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-white/10 shadow-xl overflow-hidden">
          <div className="px-8 pt-10 pb-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-semibold">
                AD
              </span>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-[0.35rem]">
                  Admin Portal
                </p>
                <h1 className="text-2xl font-semibold leading-tight">
                  Welcome back
                </h1>
              </div>
            </div>
            <SignInForm />
          </div>

          <div className="px-8 py-6 bg-slate-900/60 border-t border-white/5">
            <p className="text-center text-sm text-white/60">
              Need access?{" "}
              <Link
                href="/contact"
                className="font-semibold text-blue-300 hover:text-blue-200 transition"
              >
                Contact the Super Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


