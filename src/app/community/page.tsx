"use client";

import React, { useState } from "react";
import { FarmerSidebar } from "@/components/FarmerSidebar";
import { DEMO_COMMUNITY_POSTS } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Bot,
  X,
  Send,
} from "lucide-react";

export default function CommunityPage() {
  const { showToast, activeFarm } = useApp();
  const [posts, setPosts] = useState(DEMO_COMMUNITY_POSTS);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    crop: "Tomato",
    tag: "DiseaseManagement",
  });

  const handleUpvote = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          showToast("Helpful Upvote Recorded", "Thank you for supporting community peer knowledge!", "info");
          return { ...p, upvotes: p.upvotes + 1 };
        }
        return p;
      })
    );
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.content) return;

    const entry = {
      id: `post_${Date.now()}`,
      authorName: "Ramesh Gowda",
      village: `${activeFarm.village}, ${activeFarm.district}`,
      crop: newQuestion.crop,
      title: newQuestion.title,
      content: newQuestion.content,
      aiSuggestion: `AI Agronomist Note: For ${newQuestion.crop}, monitor relative humidity and soil moisture. Recommend Trichoderma soil drenching and balanced potassium supplementation.`,
      upvotes: 1,
      repliesCount: 0,
      tags: [newQuestion.crop, newQuestion.tag],
      timeAgo: "Just now",
    };

    setPosts([entry, ...posts]);
    setShowQuestionModal(false);
    setNewQuestion({ title: "", content: "", crop: "Tomato", tag: "DiseaseManagement" });
    showToast("Question Posted to Community", "Your inquiry was broadcast to local farmers and answered by KrishiMitra AI.", "success");
  };

  const handleAddReply = (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, repliesCount: p.repliesCount + 1 } : p))
    );

    setReplyInputs({ ...replyInputs, [postId]: "" });
    showToast("Reply Posted", "Your response was added to the farmer discussion thread.", "success");
  };

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-16 bottom-0 w-64">
          <FarmerSidebar />
        </div>
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/80 border border-brand-400/50 text-white flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white tracking-tight drop-shadow-sm">
                Farmer Community & Peer Knowledge Forum
              </h1>
              <p className="text-xs sm:text-sm text-neutral-200">
                Peer Q&A verified by AI Copilot and regional agriculture extension officers (Section 60).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowQuestionModal(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer w-fit shadow-lg border border-brand-400/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ask Question</span>
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-3xl border border-white/20 bg-black/45 backdrop-blur-xl shadow-2xl space-y-4 hover:border-brand-400/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-900/60 border border-brand-400/40 text-brand-300 font-bold text-sm flex items-center justify-center">
                    {post.authorName[0]}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-white">
                      {post.authorName} ({post.village})
                    </h4>
                    <span className="text-[10px] text-neutral-300 font-mono">
                      Crop: {post.crop} • {post.timeAgo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 border border-white/10 text-neutral-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-display font-bold text-base text-white">
                {post.title}
              </h3>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {post.content}
              </p>

              {/* AI Auto-Surfaced Suggestion */}
              <div className="p-3.5 rounded-2xl bg-brand-950/60 border border-brand-400/40 text-xs text-brand-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-300">
                  <Bot className="w-4 h-4" />
                  <span>AI Copilot Agronomic Note:</span>
                </div>
                <p className="leading-relaxed text-neutral-200">{post.aiSuggestion}</p>
              </div>

              {/* Upvotes & Replies Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-neutral-300">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 hover:text-brand-300 transition-colors font-semibold cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.upvotes} Helpful</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedCommentsPostId(
                        expandedCommentsPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-1.5 hover:text-brand-300 transition-colors font-semibold cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.repliesCount} Responses</span>
                  </button>
                </div>
              </div>

              {/* Expanded Replies Section */}
              {expandedCommentsPostId === post.id && (
                <div className="pt-3 border-t border-white/15 space-y-3 animate-fade-in">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/15 text-xs space-y-1">
                    <span className="font-bold text-brand-300">
                      Dr. K. N. Rao (KVK Kolar):
                    </span>
                    <p className="text-neutral-200">
                      Recommend 2.5 g/L Mancozeb foliar spray in morning hours. Ensure lower leaves are pruned to stop fungal spore spread.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write your farmer response..."
                      value={replyInputs[post.id] || ""}
                      onChange={(e) =>
                        setReplyInputs({ ...replyInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddReply(post.id);
                      }}
                      className="flex-1 p-2.5 rounded-xl border border-white/20 bg-black/50 text-xs text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                    <button
                      onClick={() => handleAddReply(post.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

      {/* Ask Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-black/85 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 border border-white/20 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Ask Community & AI Copilot
                </h3>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-neutral-200">Crop / Commodity:</label>
                <select
                  value={newQuestion.crop}
                  onChange={(e) => setNewQuestion({ ...newQuestion, crop: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/50 text-white"
                >
                  <option value="Tomato" className="bg-neutral-900 text-white">Tomato</option>
                  <option value="Groundnut" className="bg-neutral-900 text-white">Groundnut</option>
                  <option value="Sweet Corn" className="bg-neutral-900 text-white">Sweet Corn</option>
                  <option value="Capsicum" className="bg-neutral-900 text-white">Capsicum</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-neutral-200">Question Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yellow leaves on lower branches after rain?"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-neutral-200">Detailed Description:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain symptoms, watering schedule, or soil condition..."
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-white/20 bg-black/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-brand-950/60 border border-brand-400/40 text-[11px] text-brand-300">
                ✨ KrishiMitra AI Copilot will automatically analyze your question and suggest instant agronomic guidance.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 text-neutral-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 border border-brand-400/40 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
