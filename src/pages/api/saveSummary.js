import { connectDB } from "@/lib/mongodb";
import Summary from "@/models/Summary";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    // Verify user session with JWT
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { summaryId, newSummary } = req.body;

    if (!summaryId || !newSummary) {
      return res.status(400).json({ error: "Missing summaryId or newSummary" });
    }

    // Update only if summary belongs to the logged-in user
    const updatedSummary = await Summary.findOneAndUpdate(
      { _id: summaryId, userEmail: token.email },
      { summary: newSummary, createdAt: new Date() },
      { new: true }
    );

    if (!updatedSummary) {
      return res.status(404).json({ error: "Summary not found or not owned by you" });
    }

    res.status(200).json({ message: "Summary updated", summary: updatedSummary.summary});
  } catch (error) {
    console.error("Error saving summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
