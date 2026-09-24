import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await request.json();

    if (!["passed", "failed"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status." },
        { status: 400 }
      );
    }

    await db.execute(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({
      message: `Application ${status}.`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update application." },
      { status: 500 }
    );
  }
}