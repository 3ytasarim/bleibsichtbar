import React, { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/i18n";

// Public Pages
import Home from "./pages/Home";
import SocialMedia from "./pages/SocialMedia";
import Webseiten from "./pages/Webseiten";
import MarketingAds from "./pages/MarketingAds";
import KIAutomatisierungen from "./pages/KIAutomatisierungen";
import Analyse from "./pages/Analyse";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import References from "./pages/References";
import Contact from "./pages/Contact";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/not-found";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminReferences from "./pages/admin/AdminReferences";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import AdminClients from "./pages/admin/AdminClients";
import AdminSeo from "./pages/admin/AdminSeo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Admin Routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/projekte" component={AdminProjects} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/referenzen" component={AdminReferences} />
        <Route path="/admin/onboarding" component={AdminOnboarding} />
        <Route path="/admin/kunden" component={AdminClients} />
        <Route path="/admin/seo" component={AdminSeo} />

        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/social-media" component={SocialMedia} />
        <Route path="/webseiten" component={Webseiten} />
        <Route path="/marketing-ads" component={MarketingAds} />
        <Route path="/ki-automatisierungen" component={KIAutomatisierungen} />
        <Route path="/analyse" component={Analyse} />
        <Route path="/projekte" component={Projects} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/referenzen" component={References} />
        <Route path="/kontakt" component={Contact} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/onboarding" component={Onboarding} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
