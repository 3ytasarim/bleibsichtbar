--
-- PostgreSQL database dump
--

\restrict E5kXj17skohdSIK30CE3046spa6O7OOehRlP28SaIlBHN3y7nMOmpNXRkX5RR5C

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    image_url text,
    author text DEFAULT 'Bleibsichtbar Team'::text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name text NOT NULL,
    image_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "row" integer DEFAULT 1 NOT NULL
);


--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    message text NOT NULL,
    service text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: onboardings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.onboardings (
    id integer NOT NULL,
    company_name text NOT NULL,
    ansprechpartner text,
    data jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: onboardings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.onboardings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: onboardings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.onboardings_id_seq OWNED BY public.onboardings.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name text NOT NULL,
    image_url text,
    website_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    image_url text,
    client_name text,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    published boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    website_url text,
    gallery_images text[] DEFAULT '{}'::text[] NOT NULL,
    stat_followers text,
    stat_likes text,
    stat_views text,
    show_on_homepage boolean DEFAULT false NOT NULL,
    title_en text,
    title_nl text,
    title_fr text,
    description_en text,
    description_nl text,
    description_fr text
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."references" (
    id integer NOT NULL,
    client_name text NOT NULL,
    client_title text,
    company text NOT NULL,
    logo_url text,
    testimonial text,
    rating integer,
    published boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    website_url text,
    "row" integer DEFAULT 1 NOT NULL
);


--
-- Name: references_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.references_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.references_id_seq OWNED BY public."references".id;


--
-- Name: seo_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_settings (
    id integer NOT NULL,
    slug text NOT NULL,
    page_label text NOT NULL,
    meta_title text DEFAULT ''::text NOT NULL,
    meta_description text DEFAULT ''::text NOT NULL,
    keywords text DEFAULT ''::text NOT NULL,
    google_verification text DEFAULT ''::text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    head_script text DEFAULT ''::text NOT NULL,
    body_script text DEFAULT ''::text NOT NULL,
    meta_title_en text DEFAULT ''::text NOT NULL,
    meta_description_en text DEFAULT ''::text NOT NULL,
    meta_title_nl text DEFAULT ''::text NOT NULL,
    meta_description_nl text DEFAULT ''::text NOT NULL,
    meta_title_fr text DEFAULT ''::text NOT NULL,
    meta_description_fr text DEFAULT ''::text NOT NULL
);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seo_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seo_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seo_settings_id_seq OWNED BY public.seo_settings.id;


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: onboardings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboardings ALTER COLUMN id SET DEFAULT nextval('public.onboardings_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: references id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."references" ALTER COLUMN id SET DEFAULT nextval('public.references_id_seq'::regclass);


--
-- Name: seo_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings ALTER COLUMN id SET DEFAULT nextval('public.seo_settings_id_seq'::regclass);


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_posts (id, title, slug, excerpt, content, image_url, author, published, published_at, created_at, updated_at) FROM stdin;
1	Warum Social Media 2024 unverzichtbar für Ihr Unternehmen ist	warum-social-media-2024-unverzichtbar	In der heutigen digitalen Landschaft ist eine starke Social-Media-Präsenz kein Luxus mehr, sondern eine Notwendigkeit.	In der heutigen digitalen Landschaft ist eine starke Social-Media-Präsenz kein Luxus mehr, sondern eine Notwendigkeit. Millionen von Menschen nutzen täglich Plattformen wie Instagram, TikTok und LinkedIn, um Produkte zu entdecken, Marken zu folgen und Kaufentscheidungen zu treffen. Über 4,9 Milliarden Menschen weltweit nutzen Social Media. In Deutschland sind es über 60 Millionen aktive Nutzer.	https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80&fit=crop	Bleibsichtbar Team	t	2026-03-18 12:32:12.283747	2026-03-18 12:32:12.283747	2026-03-18 12:32:12.283747
2	TikTok für Unternehmen: Der ultimative Guide 2024	tiktok-fuer-unternehmen-guide-2024	TikTok ist nicht mehr nur für Teenager. Erfahren Sie, wie Sie als Unternehmen TikTok strategisch nutzen können.	TikTok hat sich von einer reinen Entertainment-Plattform zu einem mächtigen Marketing-Tool entwickelt. Mit über einer Milliarde aktiver Nutzer weltweit bietet TikTok Unternehmen eine einzigartige Chance. Der TikTok-Algorithmus ist demokratisch: Anders als bei anderen Plattformen können auch kleine Accounts viral gehen.	https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80&fit=crop	Bleibsichtbar Team	t	2026-03-11 12:32:16.232598	2026-03-18 12:32:16.232598	2026-03-18 12:32:16.232598
3	Instagram Reels: So steigern Sie Ihre Reichweite um 300%	instagram-reels-reichweite-steigern	Instagram Reels sind das mächtigste Tool für organisches Wachstum auf der Plattform.	Instagram Reels haben die Art und Weise, wie Marken auf Instagram wachsen, revolutioniert. Dank des Reels-Algorithmus können auch kleine Accounts plötzlich Hunderttausende von Menschen erreichen. Erfolgreiche Reels sind kurz, haben einen starken Hook und liefern echten Mehrwert.	https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80&fit=crop	Bleibsichtbar Team	t	2026-03-04 12:32:20.106611	2026-03-18 12:32:20.106611	2026-03-18 12:32:20.106611
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clients (id, name, image_url, sort_order, created_at, "row") FROM stdin;
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contacts (id, name, email, phone, company, message, service, created_at) FROM stdin;
1	Test Kişi	semih.oezdemir@bleibsichtbar.com	0151 12345678	Test GmbH	Bu bir test mesajıdır. E-posta sistemi başarıyla çalışıyor mu diye kontrol ediyoruz.	Social Media	2026-04-11 19:00:49.548804
2	Demo Firma	semih.oezdemir@bleibsichtbar.com	\N	Demo Firma	Marka bilinirliğini artırmak ve yeni müşteriler çekmek istiyoruz.\nInstagram: @demofirma\nTikTok: @demofirma\nLinkedIn: demo-firma	Analyse & Reporting	2026-04-11 19:01:01.56805
\.


--
-- Data for Name: onboardings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.onboardings (id, company_name, ansprechpartner, data, created_at) FROM stdin;
1	Musterfirma AG	Max Muster, 0151 1234567	{"q0": "Musterfirma AG", "q1": ["Ja"], "q2": ["Professionell", "Vertrauenswürdig"], "q3": ["Seriös", "Freundlich"], "q4": "Unternehmer zwischen 30 und 55 Jahren", "q5": ["Nein"], "q6": "Wir bieten exzellenten Kundendienst", "q7": "Qualität und Zuverlässigkeit", "q8": ["Produkte", "Behind the Scenes"], "q9": "Keine politischen Inhalte", "q10": "Teamarbeit und Innovation", "q11": "Ja", "q12": ["Reels", "Stories"], "q13": "@instagram_vorbild", "q15": "Keine Mitbewerber zeigen", "q16": ["Markenbekanntheit steigern", "Leads generieren"], "q17": "Produkt Alpha", "q18": "Ja", "q19": "Nein", "q20": "Produkt Alpha Pro", "q21": "Wie lange dauert die Lieferung?", "q22": "Seit 2010 im Markt", "q23": "Gemeinsam zum Erfolg", "q24": "Max Muster, 0151 1234567", "q25": "", "q5detail": "", "q18detail": "Content-Tag möglich"}	2026-04-02 19:51:22.253048
2	fdfd	\N	{"q0": "fdfd", "q1": [], "q2": [], "q3": [], "q4": "fdfd", "q5": [], "q6": "dfdfd", "q7": "", "q8": [], "q9": "", "q10": "dfdfd", "q11": "", "q12": ["humorvolle Inhalte"], "q13": "dfdfd", "q15": "", "q16": [], "q17": "", "q18": "Ja (bitte zusenden)", "q19": "Ja (bitte zusenden)", "q20": "dfd", "q21": "dfd", "q22": "", "q23": "", "q24": "", "q25": "dfdfd", "q5detail": "", "q18detail": "", "q2sonstiges": ""}	2026-04-02 20:24:40.285219
3	ada	\N	{"q0": "ada", "q1": ["Nein"], "q2": ["seriös"], "q3": ["professionell"], "q4": "adada", "q5": ["Wir möchten unsere bisherige Zielgruppe weiterhin ansprechen", "Ja → welche?"], "q6": "adada", "q7": "", "q8": [], "q9": "", "q10": "adada", "q11": "", "q12": ["humorvolle Inhalte"], "q13": "adada", "q15": "", "q16": ["Verkäufe"], "q17": "", "q18": "Ja (bitte zusenden)", "q19": "Ja (bitte zusenden)", "q20": "adada", "q21": "adada", "q22": "", "q23": "", "q24": "", "q25": "adadadada", "q5detail": "", "q18detail": "", "q2sonstiges": ""}	2026-04-02 20:37:16.083773
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partners (id, name, image_url, website_url, sort_order, created_at) FROM stdin;
1	Strom Strategen	https://bleibsichtbar.com/partners/strom-strategen-t.png	https://strom-strategen.de/	0	2026-05-26 00:02:55.363789
2	Rufschmiede	https://bleibsichtbar.com/partners/rufschmiede-t.png	https://rufschmiede.com/	1	2026-05-26 00:02:55.363789
3	B2B Voice	https://bleibsichtbar.com/partners/b2b-voice-t.png	https://b2b-voice.com/	2	2026-05-26 00:02:55.363789
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, title, description, category, image_url, client_name, tags, published, sort_order, created_at, updated_at, website_url, gallery_images, stat_followers, stat_likes, stat_views, show_on_homepage, title_en, title_nl, title_fr, description_en, description_nl, description_fr) FROM stdin;
1	Social Media Strategie für Fashion Brand	Entwicklung einer ganzheitlichen Social Media Strategie inklusive Content-Planung, Influencer-Marketing und Community Management für ein aufsteigendes Modeunternehmen.	Social Media	https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&fit=crop	FashionForward GmbH	{Instagram,TikTok,Strategie}	t	1	2026-03-18 12:28:09.187118	2026-03-18 12:28:09.187118	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
2	TikTok Content Kampagne	Virales TikTok-Content-Konzept das innerhalb von 30 Tagen über 2 Millionen organische Impressionen generiert hat. Fokus auf Authentizität und Storytelling.	Content Creation	https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80&fit=crop	TechStart Berlin	{TikTok,Viral,Content}	t	2	2026-03-18 12:28:09.187118	2026-03-18 12:28:09.187118	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
3	Instagram Reels Optimierung	Komplette Überarbeitung des Instagram-Auftritts mit Fokus auf Reels-Content. Reichweite um 340% gesteigert in 3 Monaten.	Instagram	https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80&fit=crop	Berliner Café Kette	{Instagram,Reels,Wachstum}	t	3	2026-03-18 12:28:09.187118	2026-03-18 12:28:09.187118	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
4	LinkedIn B2B Marketing	Aufbau einer professionellen LinkedIn-Präsenz für ein B2B-Softwareunternehmen. Leads um 180% gesteigert durch gezieltes Content Marketing.	LinkedIn	https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80&fit=crop	SaaS Solutions AG	{LinkedIn,B2B,Leads}	t	4	2026-03-18 12:28:09.187118	2026-03-18 12:28:09.187118	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
5	Atmosphäre & Markenauftritt	Professionelle Markenentwicklung mit hochwertiger Fotografie und einem konsistenten Erscheinungsbild, das Vertrauen schafft und die Marke unverwechselbar macht.	Branding	https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&fit=crop	Privatkunde	{}	t	0	2026-03-18 13:09:16.994116	2026-03-18 13:09:16.994116	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
6	Autohaus Content Produktion	Hochwertige Content-Produktion für ein regionales Autohaus – Fahrzeugpräsentationen, Social Media Content und professionelle Imagefotografie.	Content Production	https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&fit=crop	Autohaus Partner	{}	t	0	2026-03-18 13:09:21.005885	2026-03-18 13:09:21.005885	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
7	Business- & Imagefotografie	Professionelle Business-Portraits und Imagefotografie für Unternehmen und Führungskräfte, die online und offline überzeugen.	Fotografie	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop	Unternehmensberatung	{}	t	0	2026-03-18 13:09:24.935734	2026-03-18 13:09:24.935734	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
8	Immobilienvermarktung	Digitale Vermarktungsstrategie für Immobilienprojekte – von der Präsentation über Social Media bis zur gezielten Werbung für Käufer und Mieter.	Marketing	https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&fit=crop	Immobilien GmbH	{}	t	0	2026-03-18 13:09:28.890883	2026-03-18 13:09:28.890883	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
9	Food Content	Appetitliche Food-Fotografie und kreativer Social Media Content für Restaurants und Food-Brands, der Hunger macht und Follower gewinnt.	Food & Lifestyle	https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&fit=crop	Restaurant Klient	{}	t	0	2026-03-18 13:09:32.809237	2026-03-18 13:09:32.809237	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
10	Menü und Werbefotografie	Stilvolle Menüfotografie und Werbematerialien für die Gastronomie – perfekt für Print, Online und Social Media.	Fotografie	https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop	Gastronomie Betrieb	{}	t	0	2026-03-18 13:09:36.752185	2026-03-18 13:09:36.752185	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
11	Textilproduktion	Produktfotografie und Content-Strategie für Textilmarken – von der Kollektion bis zum fertigen Social Media Post.	E-Commerce	https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80&fit=crop	Fashion Brand	{}	t	0	2026-03-18 13:09:40.696899	2026-03-18 13:09:40.696899	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
12	Standortpräsentation	Architektur- und Standortfotografie für moderne Unternehmen und Gewerbeobjekte – professionell, einladend und repräsentativ.	Architektur	https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&fit=crop	Gewerbebetrieb	{}	t	0	2026-03-18 13:09:44.771156	2026-03-18 13:09:44.771156	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
13	Werkstatt und Servicebereich	Authentische Fotoreportage aus dem Arbeitsalltag – zeigt Kompetenz, Professionalität und schafft Vertrauen beim Kunden.	Reportage	https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80&fit=crop	Handwerksbetrieb	{}	t	0	2026-03-18 13:09:48.633725	2026-03-18 13:09:48.633725	\N	{}	\N	\N	\N	f	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: references; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."references" (id, client_name, client_title, company, logo_url, testimonial, rating, published, sort_order, created_at, website_url, "row") FROM stdin;
2	Sarah Weber	Marketing Leiterin	TechStart Berlin	\N	Die Zusammenarbeit mit Bleibsichtbar war von Anfang an sehr professionell. Sie haben unser TikTok-Kanal von 0 auf 50.000 Follower gebracht – in nur 4 Monaten!	5	t	2	2026-03-18 12:31:14.613729	\N	1
3	Thomas Schneider	Inhaber	Berliner Café Kette	\N	Endlich eine Agentur, die unsere Marke wirklich versteht. Die Kreativität und der strategische Ansatz von Bleibsichtbar sind beeindruckend.	5	t	3	2026-03-18 12:31:14.613729	\N	1
4	Lisa Bauer	CEO	SaaS Solutions AG	\N	Dank Bleibsichtbar haben wir auf LinkedIn eine starke Thought-Leadership-Position aufgebaut. Die Qualität der Inhalte ist auf einem sehr hohen Niveau.	5	t	4	2026-03-18 12:31:14.613729	\N	1
1	Maximilian Müller	Geschäftsführer	FashionForward GmbH	\N	Bleibsichtbar hat unsere Social-Media-Präsenz komplett transformiert. Unsere Follower-Zahlen sind um 400% gestiegen und die Engagement-Rate hat sich verdreifacht. Absolut empfehlenswert!	5	t	1	2026-03-18 12:31:14.613729	\N	1
\.


--
-- Data for Name: seo_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seo_settings (id, slug, page_label, meta_title, meta_description, keywords, google_verification, updated_at, head_script, body_script, meta_title_en, meta_description_en, meta_title_nl, meta_description_nl, meta_title_fr, meta_description_fr) FROM stdin;
1	home	Startseite (/)	Test SEO Title				2026-04-10 19:25:42.655								
\.


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 3, true);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clients_id_seq', 2, true);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contacts_id_seq', 2, true);


--
-- Name: onboardings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.onboardings_id_seq', 3, true);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partners_id_seq', 3, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 13, true);


--
-- Name: references_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.references_id_seq', 10, true);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seo_settings_id_seq', 1, true);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_unique UNIQUE (slug);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: onboardings onboardings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.onboardings
    ADD CONSTRAINT onboardings_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: references references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_pkey PRIMARY KEY (id);


--
-- Name: seo_settings seo_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_pkey PRIMARY KEY (id);


--
-- Name: seo_settings seo_settings_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_slug_unique UNIQUE (slug);


--
-- PostgreSQL database dump complete
--

\unrestrict E5kXj17skohdSIK30CE3046spa6O7OOehRlP28SaIlBHN3y7nMOmpNXRkX5RR5C

