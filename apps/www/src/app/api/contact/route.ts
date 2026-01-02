import type { NextRequest } from "next/server";
import { env } from "@/env";
import * as nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name: string;
      role: string;
      phone: string;
      email: string;
      message: string;
    };
    const { name, role, phone, email, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!env.SMTP_HOST || !env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER)
      return Response.json({ message: "ENV not set" }, { status: 404 });

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: true,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Instello Contact" <${env.SMTP_MAIL_FROM}>`,
      to: env.SMTP_MAIL_TO,
      replyTo: email,
      subject: `New Contact Form Submission - ${role}`,
      html: `
        <h3>New Contact Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Role:</b> ${role}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
