"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setIsSuccess(response.ok);
      setMessage(
        data.message ||
          (response.ok
            ? "Application submitted successfully!"
            : "Failed to submit application.")
      );

      if (response.ok) {
        form.reset();
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const fileClass =
    "w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-slate-900">
                Business Registration
              </h1>
              <p className="text-xs text-slate-500">
                Application Management System
              </p>
            </div>
          </div>

          <Link
            href="/validation"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            View Applications
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-600">
            New Application
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Business Registration
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            Provide your business information and upload the required
            documents to submit your registration application.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-xl border px-5 py-4 ${
              isSuccess
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <p className="font-semibold">
              {isSuccess ? "Success" : "Submission Error"}
            </p>
            <p className="mt-1 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    Enter the basic details of the business.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="business_name"
                  type="text"
                  required
                  className={inputClass}
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business Owner
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="business_owner"
                  type="text"
                  required
                  className={inputClass}
                  placeholder="Enter owner's full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                  placeholder="example@email.com"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Email address must be unique.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Number
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  name="contact_number"
                  type="text"
                  required
                  className={inputClass}
                  placeholder="09XXXXXXXXX"
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                  02
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Required Documents
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload valid PDF documents. Each file must be under 2 MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="mb-5">
                  <h4 className="font-bold text-slate-900">
                    SEC Certificate
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload the SEC certificate and provide its expiration date.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      SEC Certificate
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      name="sec_file"
                      type="file"
                      accept=".pdf,application/pdf"
                      required
                      className={fileClass}
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      PDF only • File must be under 2 MB
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      SEC Expiration Date
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      name="sec_expiration"
                      type="date"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="mb-5">
                  <h4 className="font-bold text-slate-900">
                    Mayor&apos;s Permit
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload the Mayor&apos;s Permit and provide its expiration
                    date.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Mayor&apos;s Permit
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      name="mayor_permit_file"
                      type="file"
                      accept=".pdf,application/pdf"
                      required
                      className={fileClass}
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      PDF only • File must be under 2 MB
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Permit Expiration Date
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      name="mayor_permit_expiration"
                      type="date"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Submit Application
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Make sure all information and documents are correct.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}