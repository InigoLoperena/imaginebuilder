import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imagineLogo from "@/assets/imagine-logo-transparent.png.asset.json";
import teamArgentina from "@/assets/team-argentina-new.png.asset.json";
import rocketsLatam from "@/assets/rockets-latam.jpg.asset.json";
import { useProjects, useAppSettings } from "@/features/projects/api";
import { ProjectLogo } from "@/features/projects/ProjectLogo";
import { useAuth } from "@/features/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Lightbulb,
  Users,
  Vote,
  Sparkles,
  Globe2,
  Clock,
  Languages,
  DollarSign,
  ExternalLink,
  FileText,
} from "lucide-react";

const Section = ({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="px-6 py-24 md:py-32 max-w-6xl mx-auto">
    {eyebrow && (
      <p className="text-cyan-accent uppercase tracking-[0.3em] text-xs mb-4 font-medium">
        {eyebrow}
      </p>
    )}
    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight">
      {title}
    </h2>
    <div className="text-lg md:text-xl text-muted-foreground leading-relaxed">
      {children}
    </div>
  </section>
);

const FeatureCard = ({
  icon: Icon,
  title,
  children,
  color = "text-cyan-accent",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  color?: string;
}) => (
  <div className="card-glow rounded-2xl p-7 bg-card/60 backdrop-blur-sm">
    <div className={`${color} mb-4`}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="font-display text-xl text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

const HeaderLoginForm = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = username.trim();
    if (!value) return toast.error("Introduce tu usuario");
    setBusy(true);
    try {
      const { data, error: resolveError } = await supabase.functions.invoke("resolve-login", {
        body: { identifier: value },
      });
      if (resolveError || !data?.email) return toast.error("Usuario o contraseña incorrectos");
      const { error } = await signIn(data.email as string, password);
      if (error) return toast.error("Usuario o contraseña incorrectos");
      navigate("/app", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <button
        type="button"
        onClick={() => navigate("/app")}
        className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
      >
        Entrar al sistema
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="hidden lg:flex items-center gap-2" aria-label="Login rápido">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
        autoComplete="username"
        className="h-9 w-28 rounded-md border border-border bg-background/70 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/60"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        type="password"
        autoComplete="current-password"
        className="h-9 w-28 rounded-md border border-border bg-background/70 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/60"
      />
      <button
        type="submit"
        disabled={busy}
        className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60"
      >
        {busy ? "..." : "Entrar"}
      </button>
    </form>
  );
};

// Floating orbital illustration in brand colors
const FloatingOrbits = () => (
  <div className="relative w-full max-w-md mx-auto aspect-square" aria-hidden="true">
    <div className="absolute inset-0 rounded-full border border-cyan-accent/20 animate-[spin_240s_linear_infinite]">
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[hsl(var(--rubik-red))] shadow-[0_0_30px_hsl(var(--rubik-red)/0.6)]" />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-[hsl(var(--rubik-yellow))] shadow-[0_0_30px_hsl(var(--rubik-yellow)/0.6)]" />
    </div>
    <div className="absolute inset-8 rounded-full border border-cyan-accent/30 animate-[spin_180s_linear_infinite_reverse]">
      <span className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[hsl(var(--rubik-green))] shadow-[0_0_25px_hsl(var(--rubik-green)/0.6)]" />
      <span className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(var(--rubik-blue))] shadow-[0_0_25px_hsl(var(--rubik-blue)/0.6)]" />
    </div>
    <div className="absolute inset-20 rounded-full border border-cyan-accent/40 animate-[spin_120s_linear_infinite]">
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[hsl(var(--rubik-orange))] shadow-[0_0_20px_hsl(var(--rubik-orange)/0.7)]" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-cyan-accent/20 backdrop-blur-sm flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-cyan-accent" />
      </div>
    </div>
  </div>
);

// 6-segment colored donut chart
const SixSlicePie = () => {
  const slices = [
    { color: "hsl(var(--rubik-red))", label: "Investigación" },
    { color: "hsl(var(--rubik-yellow))", label: "Diseño" },
    { color: "hsl(var(--rubik-green))", label: "Desarrollo" },
    { color: "hsl(var(--rubik-blue))", label: "Contenido" },
    { color: "hsl(var(--rubik-orange))", label: "Growth" },
    { color: "hsl(var(--primary))", label: "Comunidad" },
  ];
  const segment = 100 / slices.length;
  const circumference = 2 * Math.PI * 40;
  const segLen = (segment / 100) * circumference;
  const gap = circumference - segLen;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-72 h-72">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {slices.map((s, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={s.color}
              strokeWidth="20"
              strokeDasharray={`${segLen} ${gap}`}
              strokeDashoffset={-i * segLen}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-script text-cyan-accent text-3xl leading-none">imagine</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
              propiedad
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-sm">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-foreground/90">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const { data: allProjects = [] } = useProjects();
  const { data: settings } = useAppSettings();
  const sectionVisible = settings?.landing_projects_section_visible ?? true;
  const projects = allProjects.filter((p) => p.visible_landing);
  return (
    <main className="min-h-screen text-foreground">
      {/* HERO */}
      <header className="gradient-hero relative overflow-hidden">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <img
            src={imagineLogo.url}
            alt="Imagine"
            className="h-36 md:h-40 w-auto"
          />
          <div className="flex items-center gap-4">
            <div className="hidden 2xl:flex gap-6 text-sm uppercase tracking-widest text-muted-foreground">
              <a href="#tesis" className="hover:text-cyan-accent transition">Tesis</a>
              <a href="#ventajas" className="hover:text-cyan-accent transition">Ventajas</a>
              <a href="#slicing-pie" className="hover:text-cyan-accent transition">Slicing Pie</a>
              {sectionVisible && <a href="#proyectos" className="hover:text-cyan-accent transition">Proyectos</a>}
              <a href="#gobernanza" className="hover:text-cyan-accent transition">Gobernanza</a>
              <a href="#sistema" className="hover:text-cyan-accent transition">Sistema</a>
            </div>
            <HeaderLoginForm />
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 pt-12 pb-32 md:pt-20 md:pb-40 grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div className="animate-fade-up">
            <p className="text-cyan-accent uppercase tracking-[0.4em] text-sm md:text-base font-medium mb-8">
              Venture Builder Cooperativo
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl mb-10">
              Construimos productos digitales{" "}
              <span className="font-script text-cyan-accent">imaginando y colaborando</span>{" "}
              juntos, alineando intereses, sin la presión del dinero.
            </h1>
            <blockquote className="border-l-2 border-cyan-accent/60 pl-5 italic text-lg md:text-xl text-muted-foreground max-w-2xl">
              "Imagination is more important than knowledge"
              <footer className="not-italic mt-2 text-sm uppercase tracking-widest text-cyan-accent">
                — Albert Einstein
              </footer>
            </blockquote>
          </div>
          <div className="relative w-full max-w-md mx-auto aspect-square" aria-hidden="true">
            <img
              src={rocketsLatam.url}
              alt=""
              className="w-full h-full object-cover"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 45%, transparent 78%)",
                maskImage:
                  "radial-gradient(ellipse at center, black 45%, transparent 78%)",
              }}
            />
          </div>
        </div>
      </header>

      {/* TESIS */}
      <Section id="tesis" eyebrow="TESIS" title="El nuevo contexto de la innovación en software">
        <p className="max-w-3xl">
          Los costes de la construcción de software se han derrumbado. Lo importante
          ahora en el mundo de la innovación no es escribir código: es{" "}
          <span className="text-foreground font-medium">la imaginación</span>, la
          investigación UX y de mercado, el diseño de sistemas que aporten valor,
          aprender e iterar muy rápidamente, y la capacidad de hacer funcionar las
          soluciones en el mercado adquiriendo y activando usuarios.
        </p>
      </Section>

      {/* VENTAJAS */}
      <section id="ventajas" className="bg-card/40 border-y border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-cyan-accent uppercase tracking-[0.3em] text-xs mb-4 font-medium">
            Ventajas competitivas
          </p>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
              Equipo en Argentina, productos para el mundo.
            </h2>
            <div className="rounded-2xl overflow-hidden card-glow">
              <img
                src={teamArgentina.url}
                alt="Equipo de Imagine trabajando en Argentina"
                className="w-full h-auto block"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard icon={Sparkles} title="Creatividad argentina">
              Una cultura reconocida mundialmente por su talento creativo y su
              capacidad para resolver problemas con recursos limitados.
            </FeatureCard>
            <FeatureCard icon={DollarSign} title="Talento top a coste 10x menor" color="text-[hsl(var(--rubik-green))]">
              Acceso a profesionales de primer nivel a una fracción del coste
              salarial de Estados Unidos.
            </FeatureCard>
            <FeatureCard icon={Languages} title="Inglés a nivel nativo" color="text-[hsl(var(--rubik-blue))]">
              El país hispanohablante con mejor dominio del inglés, listo para
              construir contenido y comunicaciones para mercados globales.
            </FeatureCard>
            <FeatureCard icon={Clock} title="Misma zona horaria que USA" color="text-[hsl(var(--rubik-yellow))]">
              Colaboración en tiempo real con clientes, usuarios y partners
              norteamericanos
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* SLICING PIE */}
      <Section id="slicing-pie" eyebrow="Modelo Slicing Pie" title="Propiedad compartida a cambio de trabajo u otros recursos estratégicos">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 max-w-xl">
            <p>
              Las personas y empresas que participan en los proyectos aportan{" "}
              <span className="text-foreground font-medium">trabajo</span> u otros
              recursos estratégicos como software o comunidades en redes sociales a cambio de{" "}
              <span className="text-foreground font-medium">propiedad</span> sobre
              los proyectos. Esto nos permite construir sin la presión del dinero
              y crear cosas que de otra forma no serían viables.
            </p>
            <p>
              Cada proyecto tiene su propio reparto. Hasta que un proyecto no
              genere ingresos recurrentes no es necesario formalizar la fundación
              de una empresa: se firma un{" "}
              <span className="text-foreground font-medium">pacto de socios previo</span>{" "}
              que regula el acuerdo entre todos los participantes.
            </p>
          </div>
          <SixSlicePie />
        </div>
      </Section>

      {/* PROYECTOS */}
      {sectionVisible && (
      <Section id="proyectos" eyebrow="Proyectos" title="En lo que estamos trabajando">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">Pronto anunciaremos nuestros proyectos.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="card-glow rounded-2xl p-6 bg-card/60 backdrop-blur-sm flex gap-5">
                <ProjectLogo path={p.logo_url} name={p.name} size={80} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-2xl text-foreground mb-2">{p.name}</h3>
                  {p.description && (
                    <p className="text-muted-foreground text-base leading-relaxed mb-4">
                      {p.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {p.website_url && (
                      <a
                        href={p.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-accent hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" /> Web del proyecto
                      </a>
                    )}
                    {p.pitch_deck_url && (
                      <a
                        href={p.pitch_deck_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-accent hover:underline"
                      >
                        <FileText className="w-4 h-4" /> Pitch deck
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      )}



      {/* GOBERNANZA */}
      <section id="gobernanza" className="bg-card/40 border-y border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-cyan-accent uppercase tracking-[0.3em] text-xs mb-4 font-medium">
            Gobernanza
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Decisiones colectivas, por votación entre todos los miembros.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            Las decisiones generales del Venture Studio se toman de forma
            democrática. Estas son las que se someten a votación:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, label: "Incorporación de nuevos miembros" },
              { icon: Vote, label: "Aprobación de trabajos y presupuestos" },
              { icon: Lightbulb, label: "Aprobación de nuevos proyectos" },
              { icon: Vote, label: "Modificación del acuerdo y contrato" },
              { icon: Globe2, label: "Uso de recursos comunes" },
            ].map((item, i) => (
              <div
                key={i}
                className="card-glow rounded-xl p-6 bg-card/60 flex items-start gap-4"
              >
                <div className="shrink-0 w-11 h-11 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-accent">
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="text-foreground font-medium pt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SISTEMA */}
      <Section
        id="sistema"
        eyebrow="Sistema de diseño y validación"
        title="Cómo investigamos, validamos y construimos"
      >
        <p className="mb-12 max-w-3xl">
          Hemos diseñado un sistema para investigar  problemas y proponer soluciones rápida y eficientemente
        </p>

        <ol className="space-y-6">
          {[
            {
              n: "01",
              title: "Identificar dónde están las empresas o personas con el problema ",
              text: "Instagram, LinkedIn, Google Maps, websites, apps… ",
            },
            {
              n: "02",
              title: "Extraer data para conversar",
              text: "Obtenemos teléfonos y emails con Apollo, scrap.io, influencers.club  o otras  para contactarles y entender mejor sus problemas, motivaciones y contexto.",
            },
            {
              n: "03",
              title: "Construir una landing o MVP con vibe coding",
              text: "Levantamos un MVP muy rápido planteando una hipótesis clara que queremos poner a prueba",
            },
            {
              n: "04",
              title: "Presentar la propuesta de valor",
              text: "Con el mismo data extraído lanzamos emails, llamadas en frío y anuncios en redes muy segmentados para validar interés",
            },
            {
              n: "05",
              title: "Analizar e iterar",
              text: "Estudiamos data del MVP, interacciones y campañas para extraer insights y decidir si la hipótesis se valida — y por qué.",
            },
            {
              n: "06",
              title: "Construir empresa y software escalable",
              text: "Una vez validado el valor del sistema y el interés en el mercado, construimos software profesional y un equipo independiente para el proyecto.",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="grid md:grid-cols-[120px_1fr] gap-4 md:gap-8 items-start border-t border-border/60 pt-6"
            >
              <div className="font-script text-5xl text-cyan-accent leading-none">
                {step.n}
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-navy-deep">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
          <div className="col-span-2 md:col-span-1">
            <p className="font-script text-cyan-accent text-2xl">imagine</p>
            <p className="text-muted-foreground text-sm mt-2">
              Venture Builder Cooperativo.
            </p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-xs text-cyan-accent mb-3">
              Privacidad
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacidad" className="hover:text-cyan-accent transition">Política de privacidad</Link></li>
            </ul>
          </div>
          <div>
            <p className="uppercase tracking-widest text-xs text-cyan-accent mb-3">
              Cookies
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/cookies" className="hover:text-cyan-accent transition">Política de cookies</Link></li>
            </ul>
          </div>
          <div>
            <p className="uppercase tracking-widest text-xs text-cyan-accent mb-3">
              Legal
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/aviso-legal" className="hover:text-cyan-accent transition">Aviso legal</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Imagine. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
