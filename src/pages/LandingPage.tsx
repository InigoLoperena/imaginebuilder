import imagineLogo from "@/assets/imagine-logo.png.asset.json";
import {
  Lightbulb,
  Users,
  PieChart,
  Vote,
  FlaskConical,
  Sparkles,
  Globe2,
  Clock,
  Languages,
  DollarSign,
} from "lucide-react";

const RubikCube = () => (
  <div className="grid grid-cols-3 gap-1 w-24 h-24 p-1 rounded-lg bg-navy-deep">
    {[
      "bg-red-500", "bg-yellow-400", "bg-blue-500",
      "bg-orange-500", "bg-white", "bg-green-500",
      "bg-blue-500", "bg-red-500", "bg-yellow-400",
    ].map((c, i) => (
      <div key={i} className={`${c} rounded-sm`} />
    ))}
  </div>
);

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

const LandingPage = () => {
  return (
    <main className="min-h-screen text-foreground">
      {/* HERO */}
      <header className="gradient-hero relative overflow-hidden">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <img
            src={imagineLogo.url}
            alt="Imagine"
            className="h-10 md:h-12 w-auto"
          />
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-muted-foreground">
            <a href="#tesis" className="hover:text-cyan-accent transition">Tesis</a>
            <a href="#ventajas" className="hover:text-cyan-accent transition">Ventajas</a>
            <a href="#slicing-pie" className="hover:text-cyan-accent transition">Slicing Pie</a>
            <a href="#gobernanza" className="hover:text-cyan-accent transition">Gobernanza</a>
            <a href="#sistema" className="hover:text-cyan-accent transition">Sistema</a>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-32 md:pt-24 md:pb-40">
          <div className="animate-fade-up">
            <img
              src={imagineLogo.url}
              alt="Imagine — Venture Builder Cooperativo"
              className="w-full max-w-2xl mb-10"
            />
            <p className="text-cyan-accent uppercase tracking-[0.4em] text-sm md:text-base font-medium mb-8">
              Venture Builder Cooperativo
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl mb-10">
              Construimos productos digitales{" "}
              <span className="font-script text-cyan-accent">imaginando</span>{" "}
              juntos, sin la presión del dinero.
            </h1>
            <blockquote className="border-l-2 border-cyan-accent/60 pl-5 italic text-lg md:text-xl text-muted-foreground max-w-2xl">
              "Imagination is more important than knowledge"
              <footer className="not-italic mt-2 text-sm uppercase tracking-widest text-cyan-accent">
                — Albert Einstein
              </footer>
            </blockquote>
          </div>
        </div>
      </header>

      {/* TESIS */}
      <Section id="tesis" eyebrow="Tesis" title="El nuevo contexto de la innovación en software">
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
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
            Equipo en Argentina, productos para el mundo.
          </h2>
          <p className="text-lg text-muted-foreground mb-14 max-w-3xl">
            La combinación ideal para lanzar productos en USA y globalmente.
          </p>

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
              construir contenido y soporte para mercados globales.
            </FeatureCard>
            <FeatureCard icon={Clock} title="Misma zona horaria que USA" color="text-[hsl(var(--rubik-yellow))]">
              Colaboración en tiempo real con clientes, usuarios y partners
              norteamericanos, sin desfases.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* SLICING PIE */}
      <Section id="slicing-pie" eyebrow="Modelo Slicing Pie" title="Propiedad compartida proporcional al aporte real.">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-5 max-w-xl">
            <p>
              Las personas y empresas que participan en los proyectos aportan{" "}
              <span className="text-foreground font-medium">trabajo</span> u otros
              recursos estratégicos a cambio de{" "}
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

          {/* Pie chart visual */}
          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* 20% slice */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="hsl(var(--accent))"
                  strokeWidth="20"
                  strokeDasharray="50.27 251.33"
                />
                {/* 80% slice */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="hsl(var(--primary))"
                  strokeWidth="20"
                  strokeDasharray="201.06 251.33"
                  strokeDashoffset="-50.27"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <PieChart className="w-10 h-10 text-foreground/40" />
              </div>
            </div>

            <div className="mt-8 space-y-3 w-full max-w-sm">
              <div className="flex items-start gap-3">
                <span className="w-4 h-4 mt-1 rounded-sm bg-[hsl(var(--accent))] shrink-0" />
                <p className="text-base">
                  <span className="text-foreground font-semibold">20% — Idea aprobada.</span>{" "}
                  Pertenece al miembro que propuso la idea y cuya propuesta fue
                  aprobada por los miembros del venture builder.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-4 h-4 mt-1 rounded-sm bg-[hsl(var(--primary))] shrink-0" />
                <p className="text-base">
                  <span className="text-foreground font-semibold">80% — Ejecución.</span>{" "}
                  Se reparte entre los miembros en función de las horas de trabajo
                  aportadas u otro tipo de contribuciones acordadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

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
              { icon: Users, label: "Expulsión de miembros" },
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
        title="Cómo investigamos, validamos y construimos cada hipótesis."
      >
        <p className="mb-12 max-w-3xl">
          Hemos diseñado un sistema para investigar usuarios alrededor de ideas y
          problemas, validar hipótesis mediante entrevistas, llamadas y promoción
          de landings y MVPs.
        </p>

        <ol className="space-y-6">
          {[
            {
              n: "01",
              title: "Identificar dónde están",
              text: "Instagram, LinkedIn, Google Maps, websites, apps… Encontramos a los usuarios potenciales donde ya pasan tiempo.",
            },
            {
              n: "02",
              title: "Extraer data para conversar",
              text: "Obtenemos teléfonos y emails para contactar y entender mejor sus problemas, motivaciones y contexto.",
            },
            {
              n: "03",
              title: "Construir un MVP con vibe coding",
              text: "Levantamos un MVP muy rápido planteando una sola hipótesis clara que queremos poner a prueba.",
            },
            {
              n: "04",
              title: "Presentar la propuesta de valor",
              text: "Con el data extraído lanzamos emails, llamadas en frío y anuncios en redes muy segmentados para validar interés real.",
            },
            {
              n: "05",
              title: "Analizar e iterar",
              text: "Estudiamos data del MVP, interacciones y campañas para extraer insights y decidir si la hipótesis se valida —y por qué.",
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

        <div className="mt-16 card-glow rounded-2xl p-8 bg-card/60 flex items-start gap-5">
          <FlaskConical className="w-8 h-8 text-cyan-accent shrink-0 mt-1" />
          <p className="text-foreground text-lg">
            Cada experimento es barato, rápido y diseñado para producir aprendizaje
            —no para confirmar lo que ya creíamos.
          </p>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-navy-deep">
        <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={imagineLogo.url} alt="Imagine" className="h-10 w-auto" />
          <p className="text-muted-foreground text-sm text-center md:text-right">
            Imagine — Venture Builder Cooperativo.
            <br />
            <span className="font-script text-cyan-accent text-base">
              Imagination is more important than knowledge.
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
