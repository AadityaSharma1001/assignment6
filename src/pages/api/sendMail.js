import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, summaries } = req.body;

  if (!email || !summaries || summaries.length === 0) {
    return res.status(400).json({ error: "Email and summaries are required" });
  }

  try {
    // Setup transporter (use your SMTP creds / Gmail app password)
    let transporter = nodemailer.createTransport({
      service: "gmail", // or "smtp"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Build email content
    let htmlContent = `
      <h2>Shared Summaries</h2>
      <ul>
        ${summaries.map((s) => `<li><p>${s}</p></li>`).join("")}
      </ul>
    `;

    await transporter.sendMail({
      from: `"Summary App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shared Summaries",
      html: htmlContent,
    });

    return res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
