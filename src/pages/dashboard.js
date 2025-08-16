import { useEffect, useState } from "react";

export default function Dashboard() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const [selectedSummaries, setSelectedSummaries] = useState([]);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    const res = await fetch("/api/summaries");
    if (res.ok) {
      const data = await res.json();
      setSummaries(data);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedSummary("");

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, prompt }),
    });

    const data = await res.json();
    setGeneratedSummary(data.summary);
    setLoading(false);
    await fetchSummaries();
  };

  const handleSaveEdit = async (id) => {
    const res = await fetch("/api/saveSummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summaryId: id, newSummary: editedText }),
    });

    if (res.ok) {
      const updated = await res.json();
      setSummaries(
        summaries.map((s) => (s._id === id ? { ...s, ...updated.summary } : s))
      );
      window.location.reload();
      setEditingId(null);
      setEditedText("");
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/deleteSummary", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summaryId: id }),
    });

    if (res.ok) {
      setSummaries(summaries.filter((s) => s._id !== id));
    }
  };

  const toggleSelect = (id, summary) => {
    setSelectedSummaries((prev) => {
      const exists = prev.find((s) => s._id === id);
      if (exists) {
        return prev.filter((s) => s._id !== id);
      } else {
        return [...prev, { _id: id, summary }];
      }
    });
  };

  const sendEmail = async () => {
    if (!email || selectedSummaries.length === 0) {
      alert("Enter email and select summaries");
      return;
    }
    setSending(true);

    const res = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        summaries: selectedSummaries.map((s) => s.summary),
      }),
    });

    const data = await res.json();
    setSending(false);

    if (res.ok) {
      alert("Email sent successfully!");
      setEmail("");
      setSelectedSummaries([]);
    } else {
      alert("Failed to send email: " + data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Transform your meeting transcripts into actionable insights
          </p>
        </div>

        {/* Generate Summary Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Generate New Summary
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Meeting Transcript
              </label>
              <textarea
                className="w-full bg-slate-800/50 backdrop-blur border border-slate-600/50 rounded-2xl p-4 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none"
                rows="6"
                placeholder="Paste your meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Custom Instructions (Optional)
              </label>
              <input
                type="text"
                className="w-full bg-slate-800/50 backdrop-blur border border-slate-600/50 rounded-2xl p-4 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                placeholder="e.g., Focus on action items and decisions..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Summary...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                  Generate AI Summary
                </span>
              )}
            </button>

            {generatedSummary && (
              <div className="mt-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-300">
                    Generated Summary
                  </h3>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {generatedSummary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Summaries Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Your Saved Summaries
              </h2>
            </div>
            {summaries.length > 0 && (
              <div className="text-slate-400 text-sm">
                {summaries.length} summary{summaries.length !== 1 ? "ies" : ""}
              </div>
            )}
          </div>

          {summaries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <p className="text-slate-400 text-lg">No summaries yet</p>
              <p className="text-slate-500 text-sm mt-2">
                Generate your first AI summary to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {summaries.map((s, index) => (
                <div
                  key={s._id || index}
                  className="bg-slate-800/40 backdrop-blur border border-slate-600/30 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={
                        !!selectedSummaries.find((sel) => sel._id === s._id)
                      }
                      onChange={() => toggleSelect(s._id, s.summary)}
                      className="w-5 h-5 text-blue-500 bg-slate-700 border-slate-500 rounded focus:ring-blue-400 focus:ring-2 mt-1"
                    />
                    <div className="flex-1">
                      {editingId === s._id ? (
                        <textarea
                          className="w-full bg-slate-700/50 border border-slate-500 rounded-xl p-4 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none"
                          rows="4"
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                        />
                      ) : (
                        <ul className="list-disc list-inside text-slate-200 space-y-2">
                          {s.summary
                            .split(/[\n•]+/) // split by newline or bullet char
                            .filter((point) => point.trim() !== "")
                            .map((point, i) => (
                              <li key={i} className="leading-relaxed">
                                {point.trim()}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {new Date(s.createdAt).toLocaleString()}
                    </p>

                    {editingId === s._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(s._id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors duration-200 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(s._id);
                            setEditedText(s.summary);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors duration-200 font-medium flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors duration-200 font-medium flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Share via Email</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                className="w-full bg-slate-800/50 backdrop-blur border border-slate-600/50 rounded-2xl p-4 text-white placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                {selectedSummaries.length} summary
                {selectedSummaries.length !== 1 ? "" : ""} selected
              </span>
              {selectedSummaries.length > 0 && (
                <span className="text-green-400">✓ Ready to send</span>
              )}
            </div>

            <button
              onClick={sendEmail}
              disabled={sending}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Email...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                  Send Selected Summaries
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
