import {db} from "@/lib/db";
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

export default async function ValidationPage() {
  const [rows] = await db.query(
    "SELECT * FROM applications ORDER BY created_at DESC"
  );

  const applications = rows as Application[];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Business Applications
            </h1>

            <p className="text-gray-500">
              Review submitted registrations.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            New Application
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white text-yellow-900 shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Business</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {application.business_name}
                  </td>

                  <td className="p-4">
                    {application.business_owner}
                  </td>

                  <td className="p-4">
                    {application.email}
                  </td>

                  <td className="p-4 capitalize">
                    {application.STATUS}
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/validation/${application.id}`}
                      className="font-medium underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}

              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500"
                  >
                    No applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}