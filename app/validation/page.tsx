import { db } from "@/lib/db";
import Link from "next/link";

type Application = {
  id: number;
  business_name: string;
  business_owner: string;
  email: string;
  contact_number: string;
  STATUS: "pending" | "passed" | "failed";
  created_at: Date;
};

export const dynamic = "force-dynamic";

const statusStyles: Record<Application["STATUS"], string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  passed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const statusDot: Record<Application["STATUS"], string> = {
  pending: "bg-amber-500",
  passed: "bg-emerald-500",
  failed: "bg-rose-500",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function formatDate(value: Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ValidationPage() {
  const [rows] = await db.query(
    "SELECT * FROM applications ORDER BY created_at DESC"
  );

  const applications = rows as Application[];

  const counts = {
    total: applications.length,
    pending: applications.filter((a) => a.STATUS === "pending").length,
    passed: applications.filter((a) => a.STATUS === "passed").length,
    failed: applications.filter((a) => a.STATUS === "failed").length,
  };

  const stats = [
    {
      label: "Total Applications",
      value: counts.total,
      text: "text-slate-900",
    },
    {
      label: "Pending Review",
      value: counts.pending,
      text: "text-amber-600",
    },
    {
      label: "Passed",
      value: counts.passed,
      text: "text-emerald-600",
    },
    {
      label: "Failed",
      value: counts.failed,
      text: "text-rose-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                Business Registration
              </h1>
              <p className="text-xs text-slate-500">
                Application Management System
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M10 4.5v11M4.5 10h11" />
            </svg>
            New Application
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Admin Review
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Business Applications
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            Review submitted registrations, verify documents, and update the
            status of each application.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 `}
              />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${stat.text}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Applications</h3>
              <p className="mt-0.5 text-sm text-slate-500">
                {counts.total} record{counts.total === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5 font-semibold">Business</th>
                  <th className="px-6 py-3.5 font-semibold">Owner</th>
                  <th className="px-6 py-3.5 font-semibold">Email</th>
                  <th className="px-6 py-3.5 font-semibold">Submitted</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                          {initials(application.business_name) || "—"}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {application.business_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {application.business_owner}
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${application.email}`}
                        className="text-slate-600 transition hover:text-indigo-600 hover:underline"
                      >
                        {application.email}
                      </a>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(application.created_at)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                          statusStyles[application.STATUS] ??
                          statusStyles.pending
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            statusDot[application.STATUS] ?? statusDot.pending
                          }`}
                        />
                        {application.STATUS}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/validation/${application.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        Review
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7.5 5l5 5-5 5" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {applications.map((application) => (
              <div key={application.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                      {initials(application.business_name) || "—"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {application.business_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {application.business_owner}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${
                      statusStyles[application.STATUS] ?? statusStyles.pending
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        statusDot[application.STATUS] ?? statusDot.pending
                      }`}
                    />
                    {application.STATUS}
                  </span>
                </div>

                <dl className="mt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Email</dt>
                    <dd className="truncate text-slate-600">
                      {application.email}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Submitted</dt>
                    <dd className="text-slate-600">
                      {formatDate(application.created_at)}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/validation/${application.id}`}
                  className="mt-4 block rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Review Application
                </Link>
              </div>
            ))}
          </div>

          {applications.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <svg
                  className="h-6 w-6 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                  <path d="M9 7h6M9 11h6M9 15h3" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No applications yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Once a business submits a registration, it will appear here for
                review.
              </p>
              <Link
                href="/"
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-700"
              >
                Create New Application
              </Link>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}