import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/i18n";

// Public Pages — lazy loaded
const Home = lazy(() => import("./pages/Home"));
const SocialMedia = lazy(() => import("./pages/SocialMedia"));
const Webseiten = lazy(() => import("./pages/Webseiten"));
const MarketingAds = lazy(() => import("./pages/MarketingAds"));
const KIAutomatisierungen = lazy(() => import("./pages/KIAutomatisierungen"));
const Analyse = lazy(() => import("./pages/Analyse"));
const Projects = lazy(() => import("./pages/Projects"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const References = lazy(() => import("./pages/References"));
const Contact = lazy(() => import("./pages/Contact"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const Impressum = lazy(() => import("./pages/Impressum"));
const AGB = lazy(() => import("./pages/AGB"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const NotFound = lazy(() => import("./pages/not-found"));

// Admin Pages — separate lazy chunk
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminReferences = lazy(() => import("./pages/admin/AdminReferences"));
const AdminOnboarding = lazy(() => import("./pages/admin/AdminOnboarding"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners"));
const AdminSeo = lazy(() => import("./pages/admin/AdminSeo"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
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
        <Route path="/admin/partner" component={AdminPartners} />
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
        <Route path="/agb" component={AGB} />
        <Route path="/onboarding" component={Onboarding} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
