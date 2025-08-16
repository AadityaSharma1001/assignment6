import { connectDB } from "@/lib/mongodb";
import Summary from "@/models/Summary";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    // Verify user session with JWT
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { summaryId } = req.body;
    console.log("Deleting summary with ID:", summaryId);

    if (!summaryId) {
      return res.status(400).json({ error: "Missing summaryId" });
    }

    // Delete only if it belongs to the logged-in user
    const deletedSummary = await Summary.findOneAndDelete({
      _id: summaryId,
      userEmail: token.email,
    });

    if (!deletedSummary) {
      return res
        .status(404)
        .json({ error: "Summary not found or not owned by you" });
    }

    res.status(200).json({ message: "Summary deleted successfully" });
  } catch (error) {
    console.error("Error deleting summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
