import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { db } from "@/lib/db";


const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const businessName = formData.get("business_name") as string;
    const businessOwner = formData.get("business_owner") as string;
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contact_number") as string;

    const secExpiration = formData.get("sec_expiration") as string;
    const mayorExpiration = formData.get(
      "mayor_permit_expiration"
    ) as string;

    const secFile = formData.get("sec_file") as File;
    const mayorFile = formData.get("mayor_permit_file") as File;

    // Required fields
    if (
      !businessName ||
      !businessOwner ||
      !email ||
      !contactNumber ||
      !secExpiration ||
      !mayorExpiration ||
      !secFile ||
      !mayorFile
    ) {
      return NextResponse.json(
        { message: "All required fields must be completed." },
        { status: 400 }
      );
    }

    // PDF validation
    if (
      secFile.type !== "application/pdf" ||
      mayorFile.type !== "application/pdf"
    ) {
      return NextResponse.json(
        { message: "SEC and Mayor's Permit must be PDF files." },
        { status: 400 }
      );
    }

    // Under 2 MB
    if (
      secFile.size >= MAX_FILE_SIZE ||
      mayorFile.size >= MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        { message: "Each PDF must be under 2 MB." },
        { status: 400 }
      );
    }

    // Expiration validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const secDate = new Date(`${secExpiration}T00:00:00`);
    const mayorDate = new Date(`${mayorExpiration}T00:00:00`);

    if (secDate < today) {
      return NextResponse.json(
        { message: "SEC certificate is expired." },
        { status: 400 }
      );
    }

    if (mayorDate < today) {
      return NextResponse.json(
        { message: "Mayor's Permit is expired." },
        { status: 400 }
      );
    }

    // Unique email
    const [existing]: any = await db.execute(
      "SELECT id FROM applications WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "This email has already submitted an application." },
        { status: 409 }
      );
    }

    // Create uploads directory
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await fs.mkdir(uploadDirectory, { recursive: true });

    // Generate safe filenames
    const uniqueId = `${Date.now()}-${crypto.randomUUID()}`;

    const secFileName = `${uniqueId}-sec.pdf`;
    const mayorFileName = `${uniqueId}-mayor.pdf`;

    // Convert files to buffers
    const secBuffer = Buffer.from(await secFile.arrayBuffer());
    const mayorBuffer = Buffer.from(await mayorFile.arrayBuffer());

    // Save PDFs
    await fs.writeFile(
      path.join(uploadDirectory, secFileName),
      secBuffer
    );

    await fs.writeFile(
      path.join(uploadDirectory, mayorFileName),
      mayorBuffer
    );

    const secPath = `/uploads/${secFileName}`;
    const mayorPath = `/uploads/${mayorFileName}`;

    // Save application
    await db.execute(
      `INSERT INTO applications
      (
        business_name,
        business_owner,
        email,
        contact_number,
        sec_file,
        sec_expiration,
        mayor_permit_file,
        mayor_permit_expiration,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        businessName,
        businessOwner,
        email,
        contactNumber,
        secPath,
        secExpiration,
        mayorPath,
        mayorExpiration,
      ]
    );

    return NextResponse.json(
      {
        message: "Business application submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to submit application." },
      { status: 500 }
    );
  }
}