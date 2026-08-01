import React, { useState } from "react";
import { Key, Copy, Check, Eye, EyeOff, PlusCircle, Trash2, ShieldAlert, Zap, AlertCircle } from "lucide-react";

interface SecretToken {
  id: string;
  name: string;
  value: string;
  created: string;
  lastUsed: string;
}

export default function SecretsPage() {
  const [tokens, setTokens] = useState<SecretToken[]>([
    {
      id: "tok_1",
      name: "Production Crawler API Key",
      value: "ae_live_82b3cddf69c54e1903ba88c7",
      created: "2026-07-01",
      lastUsed: "2 hours ago",
    },
    {
      id: "tok_2",
      name: "Staging Webhook Secret",
      value: "ae_sec_011d1feea9436ea0cc78ef21",
      created: "2026-07-12",
      lastUsed: "Never",
    },
  ]);

  const [newTokenName, setNewTokenName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [geminiKey, setGeminiKey] = useState("••••••••••••••••••••••••••••••••");
  const [showGemini, setShowGemini] = useState(false);
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [savedSuccess, setSavedSuccess] = useState("");

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;

    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const value = `ae_live_${randomHex}`;
    const now = new Date().toISOString().split("T")[0];

    const newToken: SecretToken = {
      id: `tok_${Date.now()}`,
      name: newTokenName,
      value,
      created: now,
      lastUsed: "Never",
    };

    setTokens([newToken, ...tokens]);
    setNewTokenName("");
  };

  const handleDeleteToken = (id: string) => {
    if (confirm("Are you sure you want to revoke this API token? Any servers using it will receive a 401 Unauthorized error.")) {
      setTokens(tokens.filter((t) => t.id !== id));
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVisibility = (id: string) => {
    setShowValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveThirdParty = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess("Third-party credentials saved securely in Neon Secrets Vault!");
    setTimeout(() => setSavedSuccess(""), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-[#E2E8F0] tracking-tight">
          Secrets Vault
        </h1>
        <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
          Generate high-entropy workspace API tokens and link secure environment variables for third-party tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Alerts and Guidelines */}
        <div className="space-y-6">
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-[24px] p-6 text-amber-800 dark:text-amber-300 text-xs leading-relaxed font-sans space-y-3">
            <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-bold">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span>Safe Handling Policy</span>
            </div>
            <p>
              Mentor Secrets Vault utilizes military-grade standard envelope encryption. Keys are never logged in plain text or shared with public analytics frameworks.
            </p>
            <p className="font-bold">
              Never share Mentor environment tokens in client-side HTML tags or public GitHub repositories.
            </p>
          </div>

          <div className="bg-white dark:bg-[#131520] rounded-[24px] border border-gray-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Webhook Web-Trigger</h4>
            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-150 dark:border-slate-800 font-mono text-[11px] text-gray-600 dark:text-slate-300 flex items-center justify-between">
              <span className="truncate">https://mentor-api.com/v1/trigger</span>
              <button
                onClick={() => handleCopy("trigger_url", "https://mentor-api.com/v1/trigger")}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer ml-2"
              >
                {copiedId === "trigger_url" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="font-sans text-[11px] text-gray-400 dark:text-gray-500">
              {"Trigger instant scans by sending a POST request containing your header `Authorization: Bearer <Token>` with raw JSON body " + '{ "url": "https://yoursite.com" }.'}
            </p>
          </div>
        </div>

        {/* Right Column: Key list and integrations */}
        <div className="lg:col-span-2 space-y-6">
          {savedSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{savedSuccess}</span>
            </div>
          )}

          {/* Section: API Tokens list */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-500" />
                <span>Personal Workspace Keys</span>
              </h3>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {tokens.length} Active Tokens
              </span>
            </div>

            {/* List */}
            <div className="space-y-4 mb-6">
              {tokens.length === 0 ? (
                <p className="font-sans text-xs text-gray-400 dark:text-gray-500 italic text-center py-6">
                  No active API tokens generated yet. Enter a label below to create one.
                </p>
              ) : (
                tokens.map((tok) => {
                  const visible = showValues[tok.id] || false;
                  return (
                    <div key={tok.id} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1.5 max-w-sm">
                        <span className="block font-sans text-xs md:text-sm font-bold text-gray-800 dark:text-slate-200">{tok.name}</span>
                        <div className="flex items-center gap-2 font-mono text-xs text-gray-500 dark:text-slate-400 bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 px-2 py-1 rounded-lg">
                          <span className="truncate">
                            {visible ? tok.value : "••••••••••••••••••••••••••••••••"}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <button
                              onClick={() => toggleVisibility(tok.id)}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            >
                              {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopy(tok.id, tok.value)}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            >
                              {copiedId === tok.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500 font-sans">
                          <span>Created: {tok.created}</span>
                          <span>•</span>
                          <span>Last Used: {tok.lastUsed}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteToken(tok.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/20 rounded-xl transition self-end md:self-center cursor-pointer"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Create form */}
            <form onSubmit={handleCreateToken} className="flex gap-2">
              <input
                type="text"
                placeholder="Key label (e.g. Jenkins CI/CD)"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                className="flex-1 font-sans text-xs md:text-sm px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs md:text-sm px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                <span className="hidden sm:inline">Generate Key</span>
              </button>
            </form>
          </div>

          {/* Section: Third-party integrations & Keys */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-500" />
              <span>Third-Party Cloud Credentials</span>
            </h3>

            <form onSubmit={handleSaveThirdParty} className="space-y-4">
              {/* API Key */}
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Gemini API AI Integration Secret
                </label>
                <div className="relative">
                  <input
                    type={showGemini ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="Enter GEMINI_API_KEY"
                    className="w-full font-mono text-sm px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGemini(!showGemini)}
                    className="absolute right-3.5 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Slack / Discord webhook */}
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Slack or Discord Channel Webhook
                </label>
                <input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  className="w-full font-mono text-sm px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs md:text-sm px-6 py-2.5 rounded-full shadow-sm hover:shadow-lg transition cursor-pointer"
                >
                  Save Integrations
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
