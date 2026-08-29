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
const OnboardingAI = lazy(() => import("./pages/OnboardingAI"));
const OnboardingWebseiten = lazy(() => import("./pages/OnboardingWebseiten"));
const OnboardingSocialMedia = lazy(() => import("./pages/OnboardingSocialMedia"));
const NotFound = lazy(() => import("./pages/not-found"));

// Unified Login (admin or customer, determined server-side)
const Login = lazy(() => import("./pages/admin/Login"));

// Admin Pages — separate lazy chunk
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminReferences = lazy(() => import("./pages/admin/AdminReferences"));
const AdminOnboarding = lazy(() => import("./pages/admin/AdminOnboarding"));
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners"));
const AdminSeo = lazy(() => import("./pages/admin/AdminSeo"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminInvoices = lazy(() => import("./pages/admin/AdminInvoices"));
const AdminDocuments = lazy(() => import("./pages/admin/AdminDocuments"));
const AdminArchive = lazy(() => import("./pages/admin/AdminArchive"));
const AdminSupportTickets = lazy(() => import("./pages/admin/AdminSupportTickets"));

// Customer Portal Pages — separate lazy chunk
const CustomerDashboard = lazy(() => import("./pages/customer/Dashboard"));
const CustomerInstagram = lazy(() => import("./pages/customer/Instagram"));
const CustomerContentCalendar = lazy(() => import("./pages/customer/ContentCalendar"));
const CustomerDokumente = lazy(() => import("./pages/customer/Dokumente"));
const CustomerAnalysen = lazy(() => import("./pages/customer/Analysen"));
const CustomerRechnungen = lazy(() => import("./pages/customer/Rechnungen"));
const CustomerProfil = lazy(() => import("./pages/customer/Profil"));
const CustomerSupportTickets = lazy(() => import("./pages/customer/SupportTickets"));

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
        {/* Unified Login */}
        <Route path="/login" component={Login} />

        {/* Admin Routes */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/projekte" component={AdminProjects} />
        <Route path="/admin/referenzen" component={AdminReferences} />
        <Route path="/admin/onboarding" component={AdminOnboarding} />
        <Route path="/admin/partner" component={AdminPartners} />
        <Route path="/admin/seo" component={AdminSeo} />
        <Route path="/admin/benutzer" component={AdminUsers} />
        <Route path="/admin/rechnungen" component={AdminInvoices} />
        <Route path="/admin/dokumente" component={AdminDocuments} />
        <Route path="/admin/archiv" component={AdminArchive} />
        <Route path="/admin/support-tickets" component={AdminSupportTickets} />

        {/* Customer Portal — completely separate from Admin (own dashboard, shares /login) */}
        <Route path="/dashboard" component={CustomerDashboard} />
        <Route path="/dashboard/instagram" component={CustomerInstagram} />
        <Route path="/dashboard/content-calendar" component={CustomerContentCalendar} />
        <Route path="/dashboard/dokumente" component={CustomerDokumente} />
        <Route path="/dashboard/dateien" component={CustomerAnalysen} />
        <Route path="/dashboard/rechnungen" component={CustomerRechnungen} />
        <Route path="/dashboard/profil" component={CustomerProfil} />
        <Route path="/dashboard/support" component={CustomerSupportTickets} />

        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/social-media" component={SocialMedia} />
        <Route path="/webseiten" component={Webseiten} />
        <Route path="/marketing-ads" component={MarketingAds} />
        <Route path="/ki-automatisierungen" component={KIAutomatisierungen} />
        <Route path="/analyse" component={Analyse} />
        <Route path="/llc-grundung" component={Analyse} />
        <Route path="/projekte" component={Projects} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/referenzen" component={References} />
        <Route path="/kontakt" component={Contact} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/agb" component={AGB} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/onboarding-ai" component={OnboardingAI} />
        <Route path="/onboarding-webseiten" component={OnboardingWebseiten} />
        <Route path="/onboarding-social-media" component={OnboardingSocialMedia} />

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
