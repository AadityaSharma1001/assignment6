import { getServerSession } from "next-auth";
import NextAuth from "./auth/[...nextauth]";
import { connectDB } from "@/lib/mongodb";
import Summary from "@/models/Summary";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, NextAuth);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  await connectDB();

  if (req.method === "GET") {
    // Fetch all summaries of the user
    const summaries = await Summary.find({ userEmail: session.user.email }).sort({ createdAt: -1 });
    return res.status(200).json(summaries);
  }

  if (req.method === "PUT") {
    // Update existing summary
    const { id, summary } = req.body;
    if (!id || !summary) return res.status(400).json({ error: "Missing fields" });

    const updated = await Summary.findOneAndUpdate(
      { _id: id, userEmail: session.user.email },
      { summary },
      { new: true }
    );

    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    // Delete summary
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Missing ID" });

    await Summary.findOneAndDelete({ _id: id, userEmail: session.user.email });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
