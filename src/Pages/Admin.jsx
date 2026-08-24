import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Unlock,
  MessageSquare,
  Globe,
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
} from "lucide-react";
import SEO from "../components/SEO";
import { supabase } from "../supabase";

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

const SQL_SETUP_SCRIPT = `-- Strict Production RLS Script for Supabase SQL Editor:
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  "userName" text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.web_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.web_projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  description text,
  image text,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.video_categories (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  label text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.portfolio_videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  path text not null,
  thumbnail text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;
alter table public.web_categories enable row level security;
alter table public.web_projects enable row level security;
alter table public.video_categories enable row level security;
alter table public.portfolio_videos enable row level security;

-- Drop old policies if any
drop policy if exists "Allow all comments" on public.comments;
drop policy if exists "Allow all web_categories" on public.web_categories;
drop policy if exists "Allow all web_projects" on public.web_projects;
drop policy if exists "Allow all video_categories" on public.video_categories;
drop policy if exists "Allow all portfolio_videos" on public.portfolio_videos;
drop policy if exists "Public read comments" on public.comments;
drop policy if exists "Public insert comments" on public.comments;
drop policy if exists "Admin delete comments" on public.comments;
drop policy if exists "Public read web_categories" on public.web_categories;
drop policy if exists "Admin write web_categories" on public.web_categories;
drop policy if exists "Public read web_projects" on public.web_projects;
drop policy if exists "Admin write web_projects" on public.web_projects;
drop policy if exists "Public read video_categories" on public.video_categories;
drop policy if exists "Admin write video_categories" on public.video_categories;
drop policy if exists "Public read portfolio_videos" on public.portfolio_videos;
drop policy if exists "Admin write portfolio_videos" on public.portfolio_videos;

-- 1. Comments: Public Read & Insert, Admin Delete
create policy "Public read comments" on public.comments for select using (true);
create policy "Public insert comments" on public.comments for insert with check (true);
create policy "Admin delete comments" on public.comments for delete using (auth.role() = 'authenticated');

-- 2. Web Categories: Public Read, Admin Write
create policy "Public read web_categories" on public.web_categories for select using (true);
create policy "Admin write web_categories" on public.web_categories for all using (auth.role() = 'authenticated');

-- 3. Web Projects: Public Read, Admin Write
create policy "Public read web_projects" on public.web_projects for select using (true);
create policy "Admin write web_projects" on public.web_projects for all using (auth.role() = 'authenticated');

-- 4. Video Categories: Public Read, Admin Write
create policy "Public read video_categories" on public.video_categories for select using (true);
create policy "Admin write video_categories" on public.video_categories for all using (auth.role() = 'authenticated');

-- 5. Portfolio Videos: Public Read, Admin Write
create policy "Public read portfolio_videos" on public.portfolio_videos for select using (true);
create policy "Admin write portfolio_videos" on public.portfolio_videos for all using (auth.role() = 'authenticated');

-- Storage Buckets & Policies
insert into storage.buckets (id, name, public)
values ('portfolio-videos', 'portfolio-videos', true), ('web-projects', 'web-projects', true)
on conflict (id) do nothing;

drop policy if exists "Public Access portfolio-videos" on storage.objects;
drop policy if exists "Public Upload portfolio-videos" on storage.objects;
drop policy if exists "Admin Upload portfolio-videos" on storage.objects;
drop policy if exists "Public Access web-projects" on storage.objects;
drop policy if exists "Public Upload web-projects" on storage.objects;
drop policy if exists "Admin Upload web-projects" on storage.objects;

create policy "Public Access portfolio-videos" on storage.objects for select using (bucket_id = 'portfolio-videos');
create policy "Admin Upload portfolio-videos" on storage.objects for insert with check (bucket_id = 'portfolio-videos' and auth.role() = 'authenticated');
create policy "Public Access web-projects" on storage.objects for select using (bucket_id = 'web-projects');
create policy "Admin Upload web-projects" on storage.objects for insert with check (bucket_id = 'web-projects' and auth.role() = 'authenticated');`;

const AdminDashboard = () => {
  // Supabase Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Database Data State
  const [comments, setComments] = useState([]);
  const [webProjects, setWebProjects] = useState([]);
  const [webCategories, setWebCategories] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [portfolioVideos, setPortfolioVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Storage & Modal States
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);

  // Shadcn UI Alert Toast Notification State
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
      AUTH: "background: #6366f1; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      DATABASE: "background: #a855f7; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      SUCCESS: "background: #10b981; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      ERROR: "background: #ef4444; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      WEBCREATIONS: "background: #3b82f6; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      PORTFOLIO: "background: #ec4899; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
    };

    const style = consoleStyles[category] || consoleStyles.AUTH;
    if (isError) {
      console.error(`%c[ADMIN ${category}]%c [${time}] ${message}`, style, "color: #f87171;", details || "");
    } else {
      console.log(`%c[ADMIN ${category}]%c [${time}] ${message}`, style, "color: #a7f3d0;", details || "");
    }
  }, []);

  // Web Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    url: "",
  });
  const [newCategoryName, setNewCategoryName] = useState("");

  // Video Portfolio Form State
  const [newVideo, setNewVideo] = useState({
    title: "",
    category: "",
    path: "",
    thumbnail: "",
    description: "",
  });
  const [newVideoCategoryName, setNewVideoCategoryName] = useState("");

  // Listen to Supabase Auth state
  useEffect(() => {
    addLog("AUTH", "Initializing Admin Authentication check...");
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        addLog("AUTH", `Active admin session detected: ${session.user.email}`);
      } else {
        addLog("AUTH", "No active admin session found.");
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        addLog("AUTH", `Auth state changed -> Logged in as: ${session.user.email}`);
      } else {
        addLog("AUTH", "Auth state changed -> Logged out.");
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [addLog]);

  // Fetch Supabase data
  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingData(true);
    addLog("DATABASE", "Fetching fresh data from Supabase backend...");

    let hasSchemaIssue = false;

    try {
      // Comments
      const { data: commentsData, error: commErr } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });
      if (commErr) {
        addLog("ERROR", "Error fetching comments from Supabase", commErr, true);
        if (commErr.code === "PGRST205") hasSchemaIssue = true;
      } else if (commentsData) {
        setComments(commentsData);
        addLog("DATABASE", `Loaded ${commentsData.length} user comments.`);
      }

      // Web Projects
      const { data: projectsData, error: projErr } = await supabase.from("web_projects").select("*");
      if (projErr) {
        addLog("ERROR", "Error fetching web_projects from Supabase", projErr, true);
        if (projErr.code === "PGRST205") hasSchemaIssue = true;
      } else if (projectsData) {
        setWebProjects(projectsData);
        addLog("DATABASE", `Loaded ${projectsData.length} web creations projects.`);
      }

      // Web Categories
      const { data: categoriesData, error: catErr } = await supabase.from("web_categories").select("*");
      if (catErr) {
        addLog("ERROR", "Error fetching web_categories from Supabase", catErr, true);
        if (catErr.code === "PGRST205") hasSchemaIssue = true;
      } else if (categoriesData) {
        setWebCategories(categoriesData);
        addLog("DATABASE", `Loaded ${categoriesData.length} web creation categories.`);
      }

      // Video Categories
      const { data: vCatData, error: vCatErr } = await supabase.from("video_categories").select("*");
      if (vCatErr) {
        if (vCatErr.code === "PGRST205") hasSchemaIssue = true;
      } else if (vCatData) {
        setVideoCategories(vCatData);
        addLog("DATABASE", `Loaded ${vCatData.length} video categories.`);
      }

      // Portfolio Videos
      const { data: vData, error: vErr } = await supabase.from("portfolio_videos").select("*");
      if (vErr) {
        if (vErr.code === "PGRST205") hasSchemaIssue = true;
      } else if (vData) {
        setPortfolioVideos(vData);
        addLog("DATABASE", `Loaded ${vData.length} portfolio video items.`);
      }

      setSchemaMissing(hasSchemaIssue);
    } catch (err) {
      addLog("ERROR", "Unexpected error fetching Supabase admin data", err, true);
    } finally {
      setLoadingData(false);
    }
  }, [currentUser, addLog]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Supabase Login
  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setSubmittingAuth(true);
    addLog("AUTH", `Attempting authentication for email: ${email}`);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addLog("ERROR", `Login failed: ${error.message}`, error, true);
        setAuthError(error.message || "Failed to authenticate with Supabase.");
        notify("destructive", "Authentication Failed", error.message || "Invalid login credentials.");
      } else {
        addLog("SUCCESS", `Login successful! Welcome ${data.user.email}`);
        setCurrentUser(data.user);
        notify("success", "Welcome Admin", `Successfully authenticated as ${data.user.email}`);
      }
    } catch (err) {
      addLog("ERROR", "Unexpected login exception", err, true);
      setAuthError("An unexpected error occurred during authentication.");
      notify("destructive", "Login Error", "An unexpected error occurred during authentication.");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      addLog("AUTH", "Signing out admin user...");
      await supabase.auth.signOut();
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
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    notify("success", "SQL Copied", "Supabase setup script copied to clipboard!");
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Upload Video File to Supabase Storage bucket 'portfolio-videos'
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    addLog("PORTFOLIO", `Uploading video "${file.name}" to Supabase bucket 'portfolio-videos'...`);

    try {
      const { data, error } = await supabase.storage
        .from("portfolio-videos")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (error) {
        addLog("ERROR", `Video storage upload error: ${error.message}`, error, true);
        notify("destructive", "Video Upload Failed", `Storage error: ${error.message}. Ensure bucket 'portfolio-videos' is PUBLIC.`);
      } else if (data) {
        const { data: pubData } = supabase.storage.from("portfolio-videos").getPublicUrl(fileName);
        const videoUrl = pubData?.publicUrl || fileName;
        setNewVideo((prev) => ({ ...prev, path: videoUrl }));
        addLog("SUCCESS", `Video uploaded successfully: ${fileName}`);
        notify("success", "Video Uploaded", `File "${file.name}" uploaded to Supabase Storage successfully!`);
      }
    } catch (err) {
      addLog("ERROR", "Unexpected video upload failure", err, true);
      notify("destructive", "Upload Error", "Unexpected failure uploading video file.");
    } finally {
      setUploadingVideo(false);
    }
  };

  // Upload Image File to Supabase Storage bucket 'web-projects'
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    addLog("WEBCREATIONS", `Uploading image "${file.name}" to Supabase bucket 'web-projects'...`);

    try {
      const { data, error } = await supabase.storage
        .from("web-projects")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (error) {
        addLog("ERROR", `Image storage upload error: ${error.message}`, error, true);
        notify("destructive", "Image Upload Failed", `Storage error: ${error.message}. Ensure bucket 'web-projects' is PUBLIC.`);
      } else if (data) {
        const { data: pubData } = supabase.storage.from("web-projects").getPublicUrl(fileName);
        const imageUrl = pubData?.publicUrl || fileName;
        setNewProject((prev) => ({ ...prev, image: imageUrl }));
        addLog("SUCCESS", `Image uploaded successfully: ${fileName}`);
        notify("success", "Image Uploaded", `File "${file.name}" uploaded to Supabase Storage successfully!`);
      }
    } catch (err) {
      addLog("ERROR", "Unexpected image upload failure", err, true);
      notify("destructive", "Upload Error", "Unexpected failure uploading image file.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      addLog("DATABASE", `Deleting comment ID: ${id}...`);
      try {
        const { error } = await supabase.from("comments").delete().eq("id", id);
        if (error) throw error;
        addLog("SUCCESS", `Comment ${id} deleted successfully.`);
        notify("success", "Comment Deleted", "User comment deleted successfully.");
        fetchData();
      } catch (err) {
        addLog("ERROR", "Failed to delete comment", err, true);
        notify("destructive", "Delete Error", err.message || "Failed to delete comment.");
      }
    }
  };

  // Add New Web Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const catName = newCategoryName.trim();
    addLog("WEBCREATIONS", `Adding new category: "${catName}"`);
    try {
      const { error } = await supabase
        .from("web_categories")
        .insert([{ name: catName }]);
      if (error) throw error;
      addLog("SUCCESS", `Category "${catName}" added to database.`);
      notify("success", "Category Added", `Web category "${catName}" added to Supabase.`);
      setNewCategoryName("");
      fetchData();
    } catch (err) {
      addLog("ERROR", "Failed to add category", err, true);
      notify("destructive", "Category Error", err.message || "Failed to add category. Please run the SQL setup script first.");
    }
  };

  // Delete Web Category
  const handleDeleteCategory = async (catId) => {
    if (window.confirm("Delete this category?")) {
      addLog("WEBCREATIONS", `Deleting category ID: ${catId}...`);
      try {
        const { error } = await supabase.from("web_categories").delete().eq("id", catId);
        if (error) throw error;
        addLog("SUCCESS", `Category ${catId} deleted.`);
        notify("success", "Category Deleted", "Web creation category deleted.");
        fetchData();
      } catch (err) {
        addLog("ERROR", "Failed to delete category", err, true);
        notify("destructive", "Delete Error", err.message || "Failed to delete category.");
      }
    }
  };

  // Add New Web Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.url.trim()) return;
    addLog("WEBCREATIONS", `Adding new Web Creation project: "${newProject.title.trim()}"`);
    try {
      const { error } = await supabase.from("web_projects").insert([
        {
          title: newProject.title,
          category: newProject.category,
          description: newProject.description,
          image: newProject.image,
          url: newProject.url,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      addLog("SUCCESS", `Web Creation project "${newProject.title.trim()}" created successfully!`);
      notify("success", "Web Project Saved", `Project "${newProject.title.trim()}" published live!`);
      setNewProject({ title: "", category: "", description: "", image: "", url: "" });
      setOpenProjectModal(false);
      fetchData();
    } catch (err) {
      addLog("ERROR", "Failed to add Web Project", err, true);
      notify("destructive", "Project Error", err.message || "Failed to add web project. Check Supabase RLS policies.");
    }
  };

  // Delete Web Project
  const handleDeleteProject = async (projId) => {
    if (window.confirm("Delete this web project?")) {
      addLog("WEBCREATIONS", `Deleting Web Project ID: ${projId}...`);
      try {
        const { error } = await supabase.from("web_projects").delete().eq("id", projId);
        if (error) throw error;
        addLog("SUCCESS", `Web Project ${projId} deleted.`);
        notify("success", "Project Deleted", "Web project deleted successfully.");
        fetchData();
      } catch (err) {
        addLog("ERROR", "Failed to delete project", err, true);
        notify("destructive", "Delete Error", err.message || "Failed to delete project.");
      }
    }
  };

  // Add Video Category
  const handleAddVideoCategory = async (e) => {
    e.preventDefault();
    if (!newVideoCategoryName.trim()) return;
    const label = newVideoCategoryName.trim();
    const key = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
    addLog("PORTFOLIO", `Adding Video Category: "${label}" (${key})`);
    try {
      const { error } = await supabase
        .from("video_categories")
        .insert([{ key, label }]);
      if (error) throw error;
      addLog("SUCCESS", `Video Category "${label}" added to Supabase.`);
      notify("success", "Video Category Added", `Category "${label}" created successfully!`);
      setNewVideoCategoryName("");
      fetchData();
    } catch (err) {
      addLog("ERROR", "Failed to add video category", err, true);
      notify("destructive", "Category Error", err.message || "Failed to add video category.");
    }
  };

  // Delete Video Category
  const handleDeleteVideoCategory = async (id) => {
    if (window.confirm("Delete this video category?")) {
      try {
        const { error } = await supabase.from("video_categories").delete().eq("id", id);
        if (error) throw error;
        addLog("SUCCESS", `Video category ${id} deleted.`);
        notify("success", "Category Deleted", "Video category removed.");
        fetchData();
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
    addLog("PORTFOLIO", `Adding Video Item to category "${newVideo.category}": ${newVideo.path}`);
    try {
      const { error } = await supabase.from("portfolio_videos").insert([
        {
          title: videoTitle,
          category: newVideo.category || "general",
          path: newVideo.path,
          thumbnail: newVideo.thumbnail || "",
          description: newVideo.description || "",
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      addLog("SUCCESS", `Portfolio Video added successfully!`);
      notify("success", "Video Card Saved", "Portfolio video reel published live!");
      setNewVideo({ title: "", category: "", path: "", thumbnail: "", description: "" });
      setOpenVideoModal(false);
      fetchData();
    } catch (err) {
      addLog("ERROR", "Failed to add video item", err, true);
      notify("destructive", "Video Error", err.message || "Failed to add portfolio video item.");
    }
  };

  // Delete Video Item
  const handleDeleteVideoItem = async (id) => {
    if (window.confirm("Delete this portfolio video?")) {
      try {
        const { error } = await supabase.from("portfolio_videos").delete().eq("id", id);
        if (error) throw error;
        addLog("SUCCESS", `Portfolio video ${id} deleted.`);
        notify("success", "Video Deleted", "Portfolio video reel deleted.");
        fetchData();
      } catch (err) {
        addLog("ERROR", "Failed to delete video item", err, true);
        notify("destructive", "Delete Error", err.message || "Failed to delete video.");
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // If NOT logged in with Supabase Auth
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex flex-col justify-between items-center relative p-6">
        <SEO title="Admin Login | Xpensive Films" description="Admin Supabase Authentication panel." />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
            <Alert variant={notification.type} className="shadow-2xl border-white/20 relative pr-10">
              {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {notification.type === "destructive" && <AlertCircle className="w-5 h-5 text-red-400" />}
              {notification.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {notification.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
              <div>
                <AlertTitle className="font-bold">{notification.title}</AlertTitle>
                <AlertDescription className="text-xs">{notification.message}</AlertDescription>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </Alert>
          </div>
        )}

        <div className="my-auto w-full max-w-md relative z-10">
          <Card className="border border-white/10 bg-[#0b0720]/90 backdrop-blur-2xl p-6 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Supabase Authentication for Xpensive Films Administrators.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSupabaseLogin} className="space-y-4">
                {authError && (
                  <Alert variant="destructive">
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-medium">Admin Email</label>
                  <Input
                    type="email"
                    placeholder="xpensivefilms.co@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-300 font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="default" className="w-full gap-2" disabled={submittingAuth}>
                  {submittingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                  {submittingAuth ? "Authenticating..." : "Login with Supabase"}
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-500">
                <Link to="/" className="text-purple-400 hover:underline">
                  ← Back to Public Website
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="text-xs text-gray-500 text-center py-4">
          © 2026 Xpensive Films™. Supabase Authentication Protected.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white py-10 px-4 sm:px-8 relative">
      <SEO title="Admin Control Center | Xpensive Films" description="Admin management dashboard." />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <Alert variant={notification.type} className="shadow-2xl border-white/20 relative pr-10">
            {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {notification.type === "destructive" && <AlertCircle className="w-5 h-5 text-red-400" />}
            {notification.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {notification.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
            <div>
              <AlertTitle className="font-bold">{notification.title}</AlertTitle>
              <AlertDescription className="text-xs">{notification.message}</AlertDescription>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Badge variant="purple" className="px-3 py-1">
                Supabase Admin
              </Badge>
              <span className="text-xs text-gray-400 font-mono">{currentUser.email}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent mt-1">
              Xpensive Films Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="w-4 h-4" /> View Site
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Database Schema Setup Banner if missing tables */}
        {schemaMissing && (
          <Alert variant="warning" className="p-6">
            <Database className="w-6 h-6 text-amber-400" />
            <AlertTitle className="text-lg font-bold text-amber-200">
              Supabase Tables Missing (Public Schema Setup Required)
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm text-gray-300 space-y-3">
              <p>
                Your Supabase database project requires the 5 public tables (<code>comments</code>, <code>web_projects</code>, <code>web_categories</code>, <code>video_categories</code>, <code>portfolio_videos</code>) and storage buckets (<code>portfolio-videos</code>, <code>web-projects</code>).
              </p>
              <p>To create them in 1 click:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-amber-100 font-mono">
                <li>Go to <a href="https://supabase.com/dashboard/project/rrwbwviwesnczadgjhde/sql/new" target="_blank" rel="noreferrer" className="underline text-purple-300 font-sans">Supabase SQL Editor</a></li>
                <li>Click <strong>Copy Setup SQL Script</strong> below, paste it into the editor, and click <strong>RUN</strong></li>
                <li>Click <strong>Re-sync Data</strong> button to finish setup</li>
              </ol>

              <div className="pt-2 flex items-center gap-3">
                <Button size="sm" variant="default" onClick={handleCopySql} className="gap-2">
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedSql ? "SQL Copied!" : "Copy Setup SQL Script"}
                </Button>
                <Button size="sm" variant="outline" onClick={fetchData} className="gap-2">
                  <RefreshCw className="w-4 h-4" /> Re-sync Data
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">User Comments</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{comments.length}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Web Creations</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{webProjects.length}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
              <Globe className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Video Portfolio</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{portfolioVideos.length}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400">
              <Video className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Backend Status</p>
              <Badge variant={schemaMissing ? "destructive" : "purple"} className="mt-2">
                {schemaMissing ? "Setup Required" : "Supabase Active"}
              </Badge>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="web" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="web" className="gap-2">
              <Globe className="w-4 h-4" /> Web Creations & Categories ({webProjects.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Film className="w-4 h-4" /> Portfolio Showcase Videos ({portfolioVideos.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2">
              <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2">
              <Mail className="w-4 h-4" /> Form Inquiries
            </TabsTrigger>
          </TabsList>

          {/* Web Projects & Categories Tab */}
          <TabsContent value="web" className="space-y-6">
            {/* Category Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Web Categories Manager</CardTitle>
                  <CardDescription>
                    Add and delete Web Creation categories stored live in Supabase.
                  </CardDescription>
                </div>

                <form onSubmit={handleAddCategory} className="flex items-center gap-2">
                  <Input
                    placeholder="New Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-48"
                  />
                  <Button type="submit" variant="default" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Add Category
                  </Button>
                </form>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {webCategories.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      {schemaMissing
                        ? "Supabase web_categories table missing. Please run the SQL setup script."
                        : "No categories added yet in Supabase."}
                    </p>
                  ) : (
                    webCategories.map((cat) => (
                      <Badge
                        key={cat.id}
                        variant="secondary"
                        className="px-3 py-1.5 flex items-center gap-2 text-xs"
                      >
                        {cat.name}
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add New Web Project Form & List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Web Creation Projects</CardTitle>
                  <CardDescription>
                    Manage Web Creations displayed on the main portfolio page.
                  </CardDescription>
                </div>

                <Dialog open={openProjectModal} onOpenChange={setOpenProjectModal}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="gap-2">
                      <FolderPlus className="w-4 h-4" /> Add Web Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Web Creation</DialogTitle>
                      <DialogDescription>
                        Upload image or enter details to add a new project.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddProject} className="space-y-4 py-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-300 font-medium">Project Title</label>
                        <Input
                          placeholder="e.g. The Wed 24"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-300 font-medium">Category</label>
                        <Select
                          value={newProject.category}
                          onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                          required
                        >
                          <option value="">Select a Category</option>
                          {webCategories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-300 font-medium">Live Website URL</label>
                        <Input
                          placeholder="https://example.com"
                          value={newProject.url}
                          onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                          required
                        />
                      </div>

                      {/* Image Upload Option */}
                      <div className="space-y-1.5 border border-purple-500/20 bg-purple-500/5 p-3 rounded-lg">
                        <label className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Upload Image to Supabase ('web-projects')
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          disabled={uploadingImage}
                          className="text-xs file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-2.5 file:py-1 file:mr-2 file:cursor-pointer"
                        />
                        {uploadingImage && (
                          <p className="text-xs text-purple-300 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Uploading image to Supabase Storage...
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400">Or type image URL manually below:</p>
                        <Input
                          placeholder="Image URL or Supabase storage URL"
                          value={newProject.image}
                          onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-300 font-medium">Description</label>
                        <Textarea
                          placeholder="Project description..."
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          required
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <Button type="submit" variant="default" className="w-full" disabled={uploadingImage}>
                          Save Project
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                {webProjects.length === 0 ? (
                  <p className="py-12 text-center text-gray-400">
                    {schemaMissing
                      ? "Supabase web_projects table missing. Please run the SQL setup script above."
                      : "No web projects found in Supabase."}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Live URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webProjects.map((proj) => (
                        <TableRow key={proj.id}>
                          <TableCell className="font-semibold text-white">{proj.title}</TableCell>
                          <TableCell>
                            <Badge variant="purple">{proj.category || "General"}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-xs">{proj.description}</TableCell>
                          <TableCell>
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:underline inline-flex items-center gap-1 text-xs"
                            >
                              {proj.url} <ExternalLink className="w-3 h-3" />
                            </a>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProject(proj.id)}
                              className="gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
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

          {/* Portfolio Showcase Video Tab */}
          <TabsContent value="videos" className="space-y-6">
            {/* Video Categories Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Portfolio Video Categories</CardTitle>
                  <CardDescription>
                    Add and delete categories for the Portfolio Showcase.
                  </CardDescription>
                </div>

                <form onSubmit={handleAddVideoCategory} className="flex items-center gap-2">
                  <Input
                    placeholder="New Category Name"
                    value={newVideoCategoryName}
                    onChange={(e) => setNewVideoCategoryName(e.target.value)}
                    className="w-48"
                  />
                  <Button type="submit" variant="default" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Add Category
                  </Button>
                </form>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {videoCategories.length === 0 ? (
                    <p className="text-sm text-gray-400">No custom video categories added in Supabase yet.</p>
                  ) : (
                    videoCategories.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="px-3 py-1.5 flex items-center gap-2 text-xs">
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

            {/* Video Items Manager */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Portfolio Videos</CardTitle>
                  <CardDescription>
                    Add and manage portfolio videos displayed in the Portfolio Showcase.
                  </CardDescription>
                </div>

                <Dialog open={openVideoModal} onOpenChange={setOpenVideoModal}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="gap-2">
                      <FolderPlus className="w-4 h-4" /> Add Video Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Portfolio Video Card</DialogTitle>
                      <DialogDescription>
                        Upload video file or enter details to store in Supabase.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddVideoItem} className="space-y-4 py-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-300 font-medium">Category</label>
                        <Select
                          value={newVideo.category}
                          onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                          required
                        >
                          <option value="">Select a Category</option>
                          {videoCategories.map((c) => (
                            <option key={c.id} value={c.key}>
                              {c.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {/* Video File Upload Option */}
                      <div className="space-y-1.5 border border-purple-500/20 bg-purple-500/5 p-3 rounded-lg">
                        <label className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Upload Video to Supabase ('portfolio-videos')
                        </label>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileUpload}
                          disabled={uploadingVideo}
                          className="text-xs file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-2.5 file:py-1 file:mr-2 file:cursor-pointer"
                        />
                        {uploadingVideo && (
                          <p className="text-xs text-purple-300 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Uploading video to Supabase Storage...
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400">Or type video path/URL manually below:</p>
                        <Input
                          placeholder="e.g. rahul-dit-o-concert.mp4 or https://..."
                          value={newVideo.path}
                          onChange={(e) => setNewVideo({ ...newVideo, path: e.target.value })}
                          required
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <Button type="submit" variant="default" className="w-full" disabled={uploadingVideo}>
                          Save Video Item
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {portfolioVideos.length === 0 ? (
                  <p className="py-12 text-center text-gray-400">
                    No custom portfolio videos added in Supabase yet.
                  </p>
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
                          <TableCell>
                            <Badge variant="purple">{vid.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-xs font-mono">{vid.path}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteVideoItem(vid.id)}
                              className="gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
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
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">User Comments Moderation</CardTitle>
                <CardDescription>
                  Live Supabase comments submitted by site visitors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="py-12 text-center text-gray-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-purple-400" /> Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <p className="py-12 text-center text-gray-400">
                    {schemaMissing
                      ? "Supabase comments table missing. Please run the SQL setup script above."
                      : "No user comments found in Supabase."}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>Comment Content</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-semibold text-white">{item.userName || item.username || "Anonymous"}</TableCell>
                          <TableCell className="max-w-md truncate">{item.content}</TableCell>
                          <TableCell className="text-xs text-gray-400">
                            {item.created_at ? new Date(item.created_at).toLocaleString() : "Recent"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteComment(item.id)}
                              className="gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
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

          {/* Form Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Form Inquiries</CardTitle>
                <CardDescription>
                  Client inquiries sent via the Contact page form.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="info">
                  <Mail className="w-5 h-5" />
                  <AlertTitle>FormSubmit Active Endpoint</AlertTitle>
                  <AlertDescription>
                    Client messages and brochure requests are forwarded directly to:{" "}
                    <strong className="text-white font-mono">xpensivefilms.co@gmail.com</strong>
                  </AlertDescription>
                </Alert>

                <div className="flex flex-wrap gap-4 pt-2">
                  <a href="mailto:xpensivefilms.co@gmail.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="default" className="gap-2">
                      <Mail className="w-4 h-4" /> Open Email Inbox
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
