import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusButtons from "../StatusButton";

type Application = {
  id: number;
  business_name: string;
  business_owner: string;
  email: string;
  contact_number: string;
  sec_file: string;
  sec_expiration: string;
  mayor_permit_file: string;
  mayor_permit_expiration: string;
  STATUS: "pending" | "passed" | "failed";
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

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rows]: any = await db.execute(
    "SELECT * FROM applications WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    notFound();
  }

  const application = rows[0] as Application;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/validation"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.5 15L7.5 10l5-5" />
            </svg>
            Back to Applications
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                Business Registration
              </h1>
              <p className="text-xs text-slate-500">
                Application Management System
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Application Review
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold text-indigo-600">
                {initials(application.business_name) || "—"}
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  {application.business_name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Application ID: #{application.id}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 ring-inset ${
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
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                    01
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Business Information
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Registered contact details.
                    </p>
                  </div>
                </div>
              </div>

              <dl className="grid gap-6 p-6 sm:grid-cols-2">
                <Info
                  label="Business Owner"
                  value={application.business_owner}
                />
                <Info
                  label="Contact Number"
                  value={application.contact_number}
                />
                <div className="sm:col-span-2">
                  <Info label="Email Address" value={application.email} />
                </div>
              </dl>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                    02
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Submitted Documents
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Open the files to verify the submitted certificates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <DocumentCard
                  title="SEC Certificate"
                  expiration={application.sec_expiration}
                  fileUrl={application.sec_file}
                />
                <DocumentCard
                  title="Mayor's Permit"
                  expiration={application.mayor_permit_expiration}
                  fileUrl={application.mayor_permit_file}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h3 className="font-bold text-slate-900">Review Action</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Set the final status of this application.
                </p>
              </div>

              <div className="p-6">
                <StatusButtons id={application.id} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Current Status
              </h3>

              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    statusDot[application.STATUS] ?? statusDot.pending
                  }`}
                />
                <p className="text-2xl font-bold capitalize text-slate-900">
                  {application.STATUS}
                </p>
              </div>
            </section>
          </aside>
        </div>

      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function DocumentCard({
  title,
  expiration,
  fileUrl,
}: {
  title: string;
  expiration: string;
  fileUrl: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
            </svg>
          </div>

          <div>
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">
              Expires: {formatDate(expiration)}
            </p>
          </div>
        </div>

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          View File
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
        </a>
      </div>
    </div>
  );
}