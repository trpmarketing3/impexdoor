import { Bell, LogOut, UserCircle } from "lucide-react";
import { logout } from "../actions/logout";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white pl-16 lg:pl-6 pr-4 sm:px-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
          Manage contact leads and buyers data.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-0">
        <button
          type="button"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200 bg-white px-2 sm:px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          aria-label="Admin profile"
        >
          <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden md:inline">Admin</span>
        </button>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200 bg-white px-2 sm:px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
