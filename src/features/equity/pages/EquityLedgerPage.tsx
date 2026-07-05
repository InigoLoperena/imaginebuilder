import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProject } from "@/features/projects/api";
import { useProfiles } from "@/features/ownership/api";
import { useProjectTransactions } from "@/features/equity/api";
import { LedgerTable } from "@/features/equity/components/LedgerTable";

export default function EquityLedgerPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  const { data: profiles = [] } = useProfiles();
  const { data: transactions = [] } = useProjectTransactions(id);
  const nameOf = (uid: string) => {
    const p = profiles.find((x) => x.id === uid);
    return p?.full_name || p?.email || uid.slice(0, 8);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Equity ledger</div>
          <h1 className="text-2xl font-semibold">{project?.name ?? "Project"}</h1>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/app/projects/${id}/equity`}>← Back to dashboard</Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Immutable, append-only record. {transactions.length} transactions.
      </p>
      <LedgerTable transactions={transactions} nameOf={nameOf} />
    </div>
  );
}
