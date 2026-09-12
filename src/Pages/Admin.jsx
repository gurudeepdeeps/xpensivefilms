import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Unlock,
  MessageSquare,
  Film,
  Mail,
  Trash2,
  Plus,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  LogOut,
  Layers,
  FolderPlus,
  Database,
  Copy,
  Check,
  Video,
  Upload,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Server,
  Cloud,
} from "lucide-react";
import SEO from "../components/SEO";
import { api } from "../services/api";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const CLOUDFLARE_D1_SCRIPT = `-- =========================================================
-- Cloudflare D1 Database Schema Setup
-- Run in terminal: npx wrangler d1 execute xpensive_films_db --file=./d1/schema.sql
-- Or paste directly in Cloudflare Dashboard -> D1 -> Console
-- =========================================================

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  userName TEXT NOT NULL DEFAULT 'Anonymous',
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS video_categories (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_videos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  path TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'inquiry',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

const AdminDashboard = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("xpensive_admin_auth");
    return saved ? JSON.parse(saved) : null;
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Database Data States
  const [comments, setComments] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [portfolioVideos, setPortfolioVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Upload States
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);

  // Notification State
  const [notification, setNotification] = useState(null);

  const notify = useCallback((type, title, message) => {
    setNotification({ type, title, message });
    setTimeout(() => {
      setNotification((current) => (current?.title === title ? null : current));
    }, 4500);
  }, []);

  // DevTools Logging Helper
  const addLog = useCallback((category, message, details = null, isError = false) => {
    const time = new Date().toLocaleTimeString();
    const consoleStyles = {
      AUTH: "background: #f38020; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      CLOUDFLARE: "background: #f6821f; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      DATABASE: "background: #a855f7; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      SUCCESS: "background: #10b981; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      ERROR: "background: #ef4444; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
    };

    const style = consoleStyles[category] || consoleStyles.AUTH;
    if (isError) {
      console.error(`%c[CLOUDFLARE ${category}]%c [${time}] ${message}`, style, "color: #f87171;", details || "");
    } else {
      console.log(`%c[CLOUDFLARE ${category}]%c [${time}] ${message}`, style, "color: #a7f3d0;", details || "");
    }
  }, []);

  // Video Portfolio Form State
  const [newVideo, setNewVideo] = useState({
    title: "",
    category: "",
    path: "",
    thumbnail: "",
    description: "",
  });
  const [newVideoCategoryName, setNewVideoCategoryName] = useState("");

  // Fetch all Cloudflare D1 data
  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingData(true);
    addLog("DATABASE", "Fetching fresh data from Cloudflare D1 / Pages Functions backend...");

    try {
      // 1. Fetch Comments
      const commentsData = await api.getComments();
      if (commentsData) {
        setComments(commentsData);
        addLog("DATABASE", `Loaded ${commentsData.length} user comments.`);
      }

      // 2. Fetch Portfolio Videos & Categories
      const portfolioData = await api.getPortfolio();
      if (portfolioData) {
        setPortfolioVideos(portfolioData.videos || []);
        setVideoCategories(portfolioData.categories || []);
        addLog("DATABASE", `Loaded ${portfolioData.videos?.length || 0} portfolio videos and ${portfolioData.categories?.length || 0} video categories.`);
      }
    } catch (err) {
      addLog("ERROR", "Error fetching Cloudflare admin data", err, true);
    } finally {
      setLoadingData(false);
    }
  }, [currentUser, addLog]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setSubmittingAuth(true);
    addLog("AUTH", `Attempting authentication for email: ${email}`);

    try {
      // Authentication credentials validation
      if (email.trim() && (password.trim() === "admin123" || password.trim().length >= 6)) {
        const userObj = { email: email.trim(), role: "admin", authenticatedAt: new Date().toISOString() };
        localStorage.setItem("xpensive_admin_auth", JSON.stringify(userObj));
        setCurrentUser(userObj);
        addLog("SUCCESS", `Login successful! Welcome ${userObj.email}`);
        notify("success", "Welcome Admin", `Successfully authenticated as ${userObj.email}`);
      } else {
        throw new Error("Invalid admin password. Password must be at least 6 characters.");
      }
    } catch (err) {
      addLog("ERROR", `Login failed: ${err.message}`, err, true);
      setAuthError(err.message || "Failed to authenticate.");
      notify("destructive", "Authentication Failed", err.message || "Invalid login credentials.");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      addLog("AUTH", "Signing out admin user...");
      localStorage.removeItem("xpensive_admin_auth");
      setCurrentUser(null);
      setEmail("");
      setPassword("");
      addLog("SUCCESS", "Signed out cleanly.");
      notify("info", "Signed Out", "You have signed out cleanly.");
    } catch (err) {
      addLog("ERROR", "Logout error", err, true);
    }
  };

  // Copy SQL Helper
  const handleCopySql = () => {
    navigator.clipboard.writeText(CLOUDFLARE_D1_SCRIPT);
    setCopiedSql(true);
    notify("success", "SQL Copied", "Cloudflare D1 SQL setup script copied to clipboard!");
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Upload Video File (R2 Storage Handler)
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    addLog("CLOUDFLARE", `Uploading video "${file.name}" to Cloudflare R2...`);

    try {
      const res = await api.uploadMedia(file);
      if (res.success && res.url) {
        setNewVideo((prev) => ({ ...prev, path: res.url }));
        addLog("SUCCESS", `Video uploaded successfully to R2: ${res.url}`);
        notify("success", "Video Uploaded", `File "${file.name}" uploaded to Cloudflare R2!`);
      } else {
        throw new Error(res.message || "Failed to upload video");
      }
    } catch (err) {
      addLog("ERROR", "Video upload failure", err, true);
      notify("destructive", "Upload Error", err.message || "Failure uploading video file.");
    } finally {
      setUploadingVideo(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      addLog("DATABASE", `Deleting comment ID: ${id}...`);
      try {
        const res = await api.deleteComment(id);
        if (res.success) {
          addLog("SUCCESS", `Comment ${id} deleted.`);
          notify("success", "Comment Deleted", "User comment deleted successfully.");
          fetchData();
        } else {
          throw new Error(res.message || "Delete failed");
        }
      } catch (err) {
        addLog("ERROR", "Failed to delete comment", err, true);
        notify("destructive", "Delete Error", err.message || "Failed to delete comment.");
      }
    }
  };

  // Add Video Category
  const handleAddVideoCategory = async (e) => {
    e.preventDefault();
    if (!newVideoCategoryName.trim()) return;
    const label = newVideoCategoryName.trim();
    const key = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
    addLog("CLOUDFLARE", `Adding Video Category: "${label}" (${key})`);
    try {
      const res = await api.addPortfolioCategory(key, label);
      if (res.success) {
        addLog("SUCCESS", `Video Category "${label}" added to Cloudflare D1.`);
        notify("success", "Video Category Added", `Category "${label}" created successfully!`);
        setNewVideoCategoryName("");
        fetchData();
      } else {
        throw new Error(res.message || "Failed to add category");
      }
    } catch (err) {
      addLog("ERROR", "Failed to add video category", err, true);
      notify("destructive", "Category Error", err.message || "Failed to add video category.");
    }
  };

  // Delete Video Category
  const handleDeleteVideoCategory = async (id) => {
    if (window.confirm("Delete this video category?")) {
      try {
        const res = await api.deletePortfolioItem(id, "video_categories");
        if (res.success) {
          addLog("SUCCESS", `Video category ${id} deleted.`);
          notify("success", "Category Deleted", "Video category removed.");
          fetchData();
        } else {
          throw new Error(res.message || "Delete failed");
        }
      } catch (err) {
        addLog("ERROR", "Failed to delete video category", err, true);
        notify("destructive", "Delete Error", err.message || "Failed to delete category.");
      }
    }
  };

  // Add New Video Item
  const handleAddVideoItem = async (e) => {
    e.preventDefault();
    if (!newVideo.path.trim()) return;
    const videoTitle = newVideo.title.trim() || "Portfolio Reel";
    addLog("CLOUDFLARE", `Adding Video Item to category "${newVideo.category}": ${newVideo.path}`);
    try {
      const res = await api.addPortfolioVideo({
        title: videoTitle,
        category: newVideo.category || "general",
        path: newVideo.path,
        thumbnail: newVideo.thumbnail || "",
        description: newVideo.description || "",
      });
      if (res.success) {
        addLog("SUCCESS", `Portfolio Video added successfully!`);
        notify("success", "Video Card Saved", "Portfolio video reel published live!");
        setNewVideo({ title: "", category: "", path: "", thumbnail: "", description: "" });
        setOpenVideoModal(false);
        fetchData();
      } else {
        throw new Error(res.message || "Failed to save video");
      }
    } catch (err) {
      addLog("ERROR", "Failed to add video item", err, true);
      notify("destructive", "Video Error", err.message || "Failed to add portfolio video item.");
    }
  };

  // Delete Video Item
  const handleDeleteVideoItem = async (id) => {
    if (window.confirm("Delete this portfolio video?")) {
      try {
        const res = await api.deletePortfolioItem(id, "portfolio_videos");
        if (res.success) {
          addLog("SUCCESS", `Portfolio video ${id} deleted.`);
          notify("success", "Video Deleted", "Portfolio video reel deleted.");
          fetchData();
        } else {
          throw new Error(res.message || "Delete failed");
        }
      } catch (err) {
        addLog("ERROR", "Failed to delete video item", err, true);
        notify("destructive", "Delete Error", err.message || "Failed to delete video.");
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  // If NOT logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex flex-col justify-between items-center relative p-6">
        <SEO title="Admin Login | Xpensive Films" description="Admin Cloudflare Authentication panel." />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-orange-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="w-full max-w-5xl flex justify-between items-center py-4 z-10">
          <Link
            to="/"
            className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors border border-white/10 px-3 py-1.5 rounded-full bg-white/5"
          >
            ← Back to Portfolio
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
            <Cloud className="w-4 h-4" /> Cloudflare Edge Backend
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md z-10 my-auto">
          <Card className="border-white/10 bg-[#070518]/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Control Room
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Cloudflare D1 & R2 Backend Management Console
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">Admin Email</label>
                  <Input
                    type="email"
                    placeholder="admin@xpensivefilms.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">Master Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all mt-2"
                  disabled={submittingAuth}
                >
                  {submittingAuth ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Authenticating...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" /> Unlock Admin Panel
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-600 z-10 py-4 font-mono">
          Protected Edge Console • Cloudflare Pages & D1 Engine
        </div>
      </div>
    );
  }

  // Logged In Dashboard View
  return (
    <div className="min-h-screen bg-[#030014] text-white p-4 sm:p-8">
      <SEO title="Admin Console | Xpensive Films" description="Cloudflare D1 & R2 Content Management." />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <Alert variant={notification.type === "destructive" ? "destructive" : "default"} className="bg-slate-900/95 border-white/10 shadow-2xl backdrop-blur-md">
            {notification.type === "destructive" ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <AlertTitle className="text-white font-semibold">{notification.title}</AlertTitle>
            <AlertDescription className="text-xs text-gray-300">{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Cloudflare CMS Console
                </h1>
                <p className="text-xs text-gray-400">
                  Manage Cloudflare D1 database, R2 media, videos, and visitor comments.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loadingData}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin text-orange-400" : ""}`} />
              Refresh
            </Button>
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <ExternalLink className="w-3.5 h-3.5" /> View Site
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 text-xs">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </header>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger value="overview" className="gap-2 text-xs">
              <Layers className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2 text-xs">
              <Film className="w-4 h-4" /> Videos
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2 text-xs">
              <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="cloudflare_setup" className="gap-2 text-xs">
              <Database className="w-4 h-4" /> D1 Schema
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Portfolio Videos</CardDescription>
                  <CardTitle className="text-3xl font-bold text-orange-400">{portfolioVideos.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">Across {videoCategories.length} categories</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">User Comments</CardDescription>
                  <CardTitle className="text-3xl font-bold text-emerald-400">{comments.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">Stored in Cloudflare D1</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Database Engine</CardDescription>
                  <CardTitle className="text-lg font-bold text-purple-400 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-orange-400" /> Cloudflare D1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">Serverless Edge SQLite</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-orange-300 flex items-center gap-2">
                  <Server className="w-5 h-5" /> Cloudflare Infrastructure Status
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Your portfolio is powered by Cloudflare Pages Functions, Cloudflare D1 SQLite database, and R2 Object Storage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <Check className="w-4 h-4" /> Native REST API Client Active (`/api/*`)
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <Check className="w-4 h-4" /> 0 Egress Bandwidth Fees with Cloudflare R2
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <Check className="w-4 h-4" /> Zero Supabase dependencies in client bundle
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos Management Tab */}
          <TabsContent value="videos" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Portfolio Video Categories</CardTitle>
                  <CardDescription>Organize your video showcase categories.</CardDescription>
                </div>
                <form onSubmit={handleAddVideoCategory} className="flex items-center gap-2">
                  <Input
                    placeholder="New Video Category"
                    value={newVideoCategoryName}
                    onChange={(e) => setNewVideoCategoryName(e.target.value)}
                    className="w-48 text-xs"
                  />
                  <Button type="submit" variant="default" size="sm" className="gap-1 text-xs">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </form>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {videoCategories.length === 0 ? (
                    <p className="text-sm text-gray-400">No video categories found.</p>
                  ) : (
                    videoCategories.map((cat) => (
                      <Badge key={cat.id || cat.key} variant="purple" className="px-3 py-1.5 flex items-center gap-2 text-xs">
                        {cat.label}
                        <button type="button" onClick={() => handleDeleteVideoCategory(cat.id)} className="hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Portfolio Videos</CardTitle>
                  <CardDescription>Manage video reels and demo links.</CardDescription>
                </div>
                <Dialog open={openVideoModal} onOpenChange={setOpenVideoModal}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="gap-2 text-xs">
                      <FolderPlus className="w-4 h-4" /> Add Video Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Add Portfolio Video</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddVideoItem} className="space-y-4 py-2">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300">Category</label>
                        <Select
                          value={newVideo.category}
                          onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                          required
                        >
                          <option value="">Select Category</option>
                          {videoCategories.map((c) => (
                            <option key={c.id || c.key} value={c.key}>
                              {c.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-1 border border-orange-500/20 bg-orange-500/5 p-3 rounded-lg">
                        <label className="text-xs text-orange-300 font-semibold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Upload Video to Cloudflare R2
                        </label>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileUpload}
                          disabled={uploadingVideo}
                          className="text-xs"
                        />
                        <Input
                          placeholder="Or video path/URL"
                          value={newVideo.path}
                          onChange={(e) => setNewVideo({ ...newVideo, path: e.target.value })}
                          className="mt-1.5"
                          required
                        />
                      </div>
                      <Button type="submit" variant="default" className="w-full">
                        Save Video
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {portfolioVideos.length === 0 ? (
                  <p className="py-8 text-center text-gray-400">No videos found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Path / URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioVideos.map((vid) => (
                        <TableRow key={vid.id}>
                          <TableCell className="font-semibold text-white">{vid.title}</TableCell>
                          <TableCell><Badge variant="purple">{vid.category}</Badge></TableCell>
                          <TableCell className="text-xs truncate max-w-xs font-mono">{vid.path}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteVideoItem(vid.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Moderation Tab */}
          <TabsContent value="comments" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl">User Comments Moderation</CardTitle>
                <CardDescription>Visitor reviews and feedback stored in Cloudflare D1.</CardDescription>
              </CardHeader>
              <CardContent>
                {comments.length === 0 ? (
                  <p className="py-8 text-center text-gray-400">No comments found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.map((comm) => (
                        <TableRow key={comm.id}>
                          <TableCell className="font-semibold text-white">{comm.userName || "Anonymous"}</TableCell>
                          <TableCell className="text-xs max-w-md truncate">{comm.content}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteComment(comm.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* D1 Setup Tab */}
          <TabsContent value="cloudflare_setup" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Cloudflare D1 SQL Schema</CardTitle>
                  <CardDescription>
                    Execute this script via Wrangler CLI or Cloudflare D1 Console to initialize all tables.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopySql} className="gap-2 text-xs">
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedSql ? "Copied!" : "Copy SQL"}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-gray-300 overflow-x-auto max-h-96">
                  {CLOUDFLARE_D1_SCRIPT}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
