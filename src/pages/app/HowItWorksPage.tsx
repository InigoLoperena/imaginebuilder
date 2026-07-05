import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Guía</div>
        <h1 className="text-3xl font-semibold">Cómo funciona la app</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Explicación breve y clara de todos los sistemas del Venture Builder.
        </p>
      </div>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">1. Proyectos</h2>
        <p className="text-sm text-muted-foreground">
          Cada proyecto agrupa un producto o iniciativa del Venture Builder. Tiene su propio equipo,
          registro de horas y política de equity. Los proyectos pueden mostrarse en la landing pública
          y/o dentro del panel interno según decida el Superadministrador.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">2. Registro de horas</h2>
        <p className="text-sm text-muted-foreground">
          Cada colaborador registra las horas que dedica a cada proyecto. El Admin las revisa y puede
          <strong> Aprobar</strong> o <strong>Rechazar</strong> cada entrada. Solo las horas aprobadas
          generan equity (a no ser que la política del proyecto diga otra cosa).
        </p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">3. Modelos de equity</h2>
        <p className="text-sm text-muted-foreground">
          Cada proyecto usa <strong>uno</strong> de estos dos modelos (son excluyentes).
        </p>

        <div className="space-y-3">
          <div className="border-l-2 border-primary pl-4">
            <div className="flex items-center gap-2">
              <Badge>Pool Dinámico</Badge>
              <span className="text-sm font-medium">Reparto proporcional flotante</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              El % de cada persona <strong>flota</strong> según el total de horas aprobadas del
              proyecto. Si entra alguien nuevo y trabaja, todos los demás se "diluyen" proporcionalmente.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <em>Ejemplo:</em> Ana tiene 100h y el 100%. Entra Beto y hace 100h → cada uno pasa a tener el 50%.
            </p>
          </div>

          <div className="border-l-2 border-primary pl-4">
            <div className="flex items-center gap-2">
              <Badge>Conversión Fija</Badge>
              <span className="text-sm font-medium">Horas → % bloqueado</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Cada hora aprobada se convierte en un % <strong>fijo e inmutable</strong> según un
              ratio definido (por ejemplo, <code>10 horas = 1%</code>). Ya no te dilues cuando entra
              alguien nuevo.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <em>Ejemplo:</em> ratio 10h/1%. Ana hace 50h → gana 5% para siempre. Beto entra y hace 30h → gana 3%. Ana sigue con 5%.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">4. Configuración de políticas (Superadmin)</h2>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><strong>Modelo</strong>: Pool Dinámico o Conversión Fija.</li>
          <li><strong>Horas por 1%</strong>: solo en Conversión Fija. Cuántas horas equivalen a 1% de equity.</li>
          <li><strong>Equity máximo</strong>: tope de % que puede repartirse (por defecto 100%).</li>
          <li><strong>Qué horas cuentan</strong>: solo aprobadas, o todas las registradas.</li>
          <li><strong>Fecha de efecto</strong>: desde cuándo empieza a acumularse equity con esta política.</li>
          <li><strong>Redondeo</strong>: 2 decimales, 4 decimales o sin redondeo.</li>
          <li><strong>Vesting cliff</strong>: meses de espera antes de que el equity empiece a "consolidarse".</li>
          <li><strong>Duración de vesting</strong>: meses en los que el equity se consolida linealmente.</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Editar una política crea una <strong>nueva versión</strong> y desactiva la anterior. Todo
          queda auditable.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">5. Ledger (libro contable)</h2>
        <p className="text-sm text-muted-foreground">
          Registro <strong>inmutable</strong> de cada movimiento de equity: quién, cuándo, cuántas
          horas, qué % ganó o perdió, con qué política y por qué. Nunca se edita ni se borra: las
          correcciones son filas nuevas con % negativo.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">6. Dilución manual (Admin)</h2>
        <p className="text-sm text-muted-foreground">
          Cuando entra un miembro nuevo con un % pactado (por ejemplo 20%), el Admin puede aplicar
          una <strong>dilución proporcional</strong>: todos los miembros existentes ceden ese %
          proporcionalmente, y el nuevo miembro recibe su parte. Queda registrado en el historial.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">7. Roles</h2>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><strong>Superadministrador</strong>: control total. Configura políticas de equity, cambia modelo, gestiona visibilidad de proyectos, correcciones manuales.</li>
          <li><strong>Administrador</strong>: aprueba/rechaza horas, gestiona proyectos y usuarios, aplica diluciones.</li>
          <li><strong>Colaborador</strong>: registra sus horas, consulta su equity y participa en los proyectos donde ha sido añadido.</li>
        </ul>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">8. Simulador de equity</h2>
        <p className="text-sm text-muted-foreground">
          Dentro de "Ajustes de equity" el Superadmin puede simular <em>"¿qué pasaría si el ratio
          fuese 10h = 1%?"</em> y ver el reparto proyectado sobre las horas actuales — sin guardar
          nada.
        </p>
      </Card>
    </div>
  );
}
