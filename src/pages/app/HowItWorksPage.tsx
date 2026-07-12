import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Guía</div>
        <h1 className="text-3xl font-semibold">Cómo se distribuye la propiedad de un proyecto</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Cada proyecto tiene un sistema para repartir el equity (porcentaje de propiedad) entre las
          personas que trabajan en él o aportan recursos estratégicos.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Hay dos tipos de asignaciones de propiedad: <strong>fija</strong> y <strong>dinámica</strong>.
        </p>
      </div>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Propiedad fija</h2>
        <p className="text-sm text-muted-foreground">
          La propiedad fija se puede asignar con porcentajes de propiedad (X %) u otros criterios
          aprobados previamente; por ejemplo: alguien que ha aportado algo estratégico al proyecto,
          como la idea, un MVP o una comunidad en redes sociales, y los miembros acuerdan que el 20%
          del proyecto sea de su propiedad.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Propiedad dinámica</h2>
        <p className="text-sm text-muted-foreground">
          La propiedad dinámica se calcula en función de las horas dedicadas al proyecto. Ésta puede
          configurarse de 2 formas:
        </p>

        <div className="space-y-3 pt-2">
          <div className="border-l-2 border-primary pl-4">
            <div className="flex items-center gap-2">
              <Badge>Pool Dinámico</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Primero se establece por acuerdo un porcentaje de la propiedad del proyecto para el
              pool dinámico de horas de trabajo. El porcentaje de propiedad cambia continuamente
              según las horas trabajadas por cada colaborador.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <em>Ejemplo:</em> Si una persona A ha trabajado 10 horas y otra persona B ha trabajado
              5 horas, el equity asignado del pool dinámico se repartirá proporcionalmente.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <div className="flex items-center gap-2">
              <Badge>Conversión Fija</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Las horas trabajadas se convierten en un porcentaje fijo de propiedad según un ratio
              acordado para el proyecto (por ejemplo, 100 horas = 1%).
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <em>Ejemplo:</em> Con un ratio de 100 horas = 1%, una persona que trabaja 50 horas
              obtiene un 0.5% de propiedad.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Sistema de dilución</h2>
        <p className="text-sm text-muted-foreground">
          Existe también un sistema de dilución por el cual, por ejemplo, se acuerda y se aprueba
          por votación darle a un nuevo miembro un 10% de la propiedad del proyecto porque aporta
          algo estratégico.
        </p>
        <p className="text-sm text-muted-foreground">
          Todos los propietarios se diluyen un 10% para asignarle esa propiedad al nuevo propietario.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Gobernanza</h2>
        <p className="text-sm text-muted-foreground">
          Existe gobernabilidad a nivel del venture builder cooperativo y a nivel de proyectos.
        </p>
        <p className="text-sm text-muted-foreground">
          A nivel del venture builder, todos los miembros tienen el mismo peso y poder de votación,
          y a nivel de proyectos el peso de las votaciones lo determina el porcentaje de la propiedad.
        </p>
        <p className="text-sm text-muted-foreground">
          Existe un contrato que regula el acuerdo del venture builder y también un contrato que
          regula el acuerdo de cada proyecto.
        </p>
        <p className="text-sm text-muted-foreground">
          En este link hay un borrador del acuerdo de fundación del venture builder:{" "}
          <a
            href="https://app.notion.com/p/38c519334a6a8047b9a4d417ad8fcd56?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80"
          >
            Ver borrador en Notion
          </a>
        </p>
      </Card>
    </div>
  );
}
