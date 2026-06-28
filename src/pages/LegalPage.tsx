import { Link, useLocation } from "react-router-dom";
import imagineLogo from "@/assets/imagine-logo.png.asset.json";

type PageKey = "privacidad" | "cookies" | "aviso-legal";

const CONTENT: Record<PageKey, { title: string; sections: { h: string; p: string }[] }> = {
  privacidad: {
    title: "Política de privacidad",
    sections: [
      {
        h: "1. Responsable del tratamiento",
        p: "Imagine, Venture Builder Cooperativo, es responsable del tratamiento de los datos personales facilitados a través de este sitio web. Tratamos la información de forma confidencial y conforme a la normativa vigente en materia de protección de datos.",
      },
      {
        h: "2. Finalidad",
        p: "Los datos recogidos se utilizan exclusivamente para responder a consultas, gestionar la relación con personas interesadas en participar en el venture builder y enviar comunicaciones relacionadas con los proyectos, siempre que exista consentimiento previo.",
      },
      {
        h: "3. Legitimación",
        p: "La base legal para el tratamiento es el consentimiento del interesado, el interés legítimo de Imagine y, en su caso, la ejecución de un acuerdo de colaboración o pacto de socios.",
      },
      {
        h: "4. Conservación",
        p: "Los datos se conservarán durante el tiempo estrictamente necesario para cumplir con la finalidad para la que fueron recabados, y posteriormente durante los plazos legales aplicables.",
      },
      {
        h: "5. Derechos",
        p: "El usuario puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar el consentimiento prestado, contactando con Imagine a través de los canales habituales.",
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    sections: [
      {
        h: "1. ¿Qué son las cookies?",
        p: "Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario para recordar información sobre su visita, mejorar la experiencia de navegación y obtener datos estadísticos de uso.",
      },
      {
        h: "2. Tipos de cookies utilizadas",
        p: "Este sitio web utiliza cookies técnicas, estrictamente necesarias para el correcto funcionamiento de la página, y cookies analíticas anónimas que nos ayudan a entender cómo se utiliza el sitio para mejorarlo de forma continua.",
      },
      {
        h: "3. Gestión y desactivación",
        p: "El usuario puede aceptar, rechazar o configurar las cookies en cualquier momento desde los ajustes de su navegador. Bloquear determinadas cookies puede afectar a la disponibilidad de algunas funcionalidades del sitio.",
      },
      {
        h: "4. Actualizaciones",
        p: "Imagine se reserva el derecho de modificar esta política de cookies en función de cambios legislativos, técnicos o estratégicos. Recomendamos revisarla periódicamente.",
      },
    ],
  },
  "aviso-legal": {
    title: "Aviso legal",
    sections: [
      {
        h: "1. Titularidad",
        p: "El presente sitio web es titularidad de Imagine, Venture Builder Cooperativo. El acceso al sitio implica el conocimiento y aceptación de las presentes condiciones de uso.",
      },
      {
        h: "2. Propiedad intelectual",
        p: "Todos los contenidos, diseños, textos, imágenes y marcas mostrados en este sitio web están protegidos por derechos de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.",
      },
      {
        h: "3. Condiciones de uso",
        p: "El usuario se compromete a hacer un uso adecuado y lícito del sitio web, absteniéndose de realizar cualquier actividad que pueda dañar, inutilizar, sobrecargar o deteriorar el portal o impedir su normal uso por parte de otros usuarios.",
      },
      {
        h: "4. Responsabilidad",
        p: "Imagine no se hace responsable de los daños o perjuicios que pudieran derivarse del uso de la información contenida en este sitio web, así como de la imposibilidad puntual de acceder al mismo por motivos técnicos.",
      },
      {
        h: "5. Legislación aplicable",
        p: "Las presentes condiciones se rigen por la legislación vigente. Cualquier controversia será sometida a los juzgados y tribunales competentes conforme a derecho.",
      },
    ],
  },
};

const LegalPage = () => {
  const location = useLocation();
  const key = location.pathname.replace("/", "") as PageKey;
  const data = CONTENT[key] ?? CONTENT["aviso-legal"];

  return (
    <main className="min-h-screen text-foreground">
      <header className="gradient-hero">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/">
            <img src={imagineLogo.url} alt="Imagine" className="h-12 md:h-14 w-auto" />
          </Link>
          <Link
            to="/"
            className="text-sm uppercase tracking-widest text-muted-foreground hover:text-cyan-accent transition"
          >
            ← Volver
          </Link>
        </nav>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-cyan-accent uppercase tracking-[0.3em] text-xs mb-4 font-medium">
          Información legal
        </p>
        <h1 className="font-display text-4xl md:text-6xl mb-12 leading-tight">
          {data.title}
        </h1>
        <div className="space-y-10">
          {data.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl mb-3 text-foreground">{s.h}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{s.p}</p>
            </section>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-16 uppercase tracking-widest">
          Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
        </p>
      </article>

      <footer className="border-t border-border/60 bg-navy-deep">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Imagine — Venture Builder Cooperativo.
        </div>
      </footer>
    </main>
  );
};

export default LegalPage;
