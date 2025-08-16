import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import NextAuth from "./auth/[...nextauth]";
import { connectDB } from "@/lib/mongodb";
import Summary from "@/models/Summary";

const groq = new Groq({ apiKey: process.env.AI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, NextAuth);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { transcript, prompt } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    // Connect to DB
    await connectDB();

    // Generate summary
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are an AI that summarizes transcripts clearly and concisely." },
        { role: "user", content: `Transcript: ${transcript}\n\nInstruction: ${prompt}` },
      ],
    });

    const summary = response.choices[0].message.content;

    // Save summary to DB
    const saved = await Summary.create({
      userEmail: session.user.email,
      transcript,
      summary,
    });

    return res.status(200).json({ summary: saved.summary, id: saved._id });
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
}
