import { Link } from "react-router-dom";
import imagineLogo from "@/assets/imagine-logo.png.asset.json";

const NotFound = () => (
  <main className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6 text-center">
    <img src={imagineLogo.url} alt="Imagine" className="h-14 w-auto mb-10" />
    <p className="text-cyan-accent uppercase tracking-[0.4em] text-xs mb-6">
      Página no encontrada
    </p>
    <h1 className="font-display text-5xl md:text-7xl mb-6">404</h1>
    <p className="text-muted-foreground text-lg max-w-md mb-10">
      Esta página todavía no existe. Quizá esté esperando a que alguien la{" "}
      <span className="font-script text-cyan-accent text-xl">imagine</span>.
    </p>
    <Link
      to="/"
      className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
    >
      Volver al inicio
    </Link>
  </main>
);

export default NotFound;
