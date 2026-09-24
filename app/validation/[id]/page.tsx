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
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-yellow-800 shadow">
        <Link
          href="/validation"
          className="mb-6 inline-block underline"
        >
          ← Back to Applications
        </Link>

        <h1 className="mb-6 text-3xl font-bold">
          {application.business_name}
        </h1>

        <div className="space-y-5">
          <Info
            label="Business Owner"
            value={application.business_owner}
          />

          <Info
            label="Email"
            value={application.email}
          />

          <Info
            label="Contact Number"
            value={application.contact_number}
          />

          <Info
            label="SEC Expiration"
            value={String(application.sec_expiration)}
          />

          <a
            href={application.sec_file}
            target="_blank"
            className="block underline"
          >
            View SEC Certificate
          </a>

          <Info
            label="Mayor's Permit Expiration"
            value={String(application.mayor_permit_expiration)}
          />

          <a
            href={application.mayor_permit_file}
            target="_blank"
            className="block underline"
          >
            View Mayor&apos;s Permit
          </a>

          <div>
            <p className="text-sm text-gray-500">Status</p>

            <p className="text-xl font-bold capitalize">
              {application.STATUS}
            </p>
          </div>

          <hr />

          <StatusButtons id={application.id} />
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}