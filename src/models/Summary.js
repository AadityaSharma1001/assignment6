import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, // identifies which user saved it
    transcript: { type: String, required: true },
    summary: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "summaries" }
);

export default mongoose.models.Summary || mongoose.model("Summary", SummarySchema);
