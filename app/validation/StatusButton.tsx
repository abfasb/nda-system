"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StatusButtons({
  id,
}: {
  id: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: "passed" | "failed") {
    setLoading(true);

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        alert("Failed to update application.");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3">
      <button
        disabled={loading}
        onClick={() => updateStatus("passed")}
        className="rounded-lg bg-green-600 px-6 py-3 text-white"
      >
        Pass
      </button>

      <button
        disabled={loading}
        onClick={() => updateStatus("failed")}
        className="rounded-lg bg-red-600 px-6 py-3 text-white"
      >
        Fail
      </button>
    </div>
  );
}