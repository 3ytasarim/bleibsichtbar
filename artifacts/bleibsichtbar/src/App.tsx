import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Public Pages
import Home from "./pages/Home";
import SocialMedia from "./pages/SocialMedia";
import Webseiten from "./pages/Webseiten";
import MarketingAds from "./pages/MarketingAds";
import KIAutomatisierungen from "./pages/KIAutomatisierungen";
import Analyse from "./pages/Analyse";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import References from "./pages/References";
import Contact from "./pages/Contact";
import NotFound from "./pages/not-found";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminReferences from "./pages/admin/AdminReferences";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/projekte" component={AdminProjects} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/referenzen" component={AdminReferences} />
      
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/social-media" component={SocialMedia} />
      <Route path="/webseiten" component={Webseiten} />
      <Route path="/marketing-ads" component={MarketingAds} />
      <Route path="/ki-automatisierungen" component={KIAutomatisierungen} />
      <Route path="/analyse" component={Analyse} />
      <Route path="/projekte" component={Projects} />
      <Route path="/projekte/:id" component={ProjectDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/referenzen" component={References} />
      <Route path="/kontakt" component={Contact} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
