import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useMyTransactions } from "@/features/equity/api";
import { useProjects } from "@/features/projects/api";
import { aggregateAllocations, vestingFactor } from "@/features/equity/calc";
import { ProjectLogo } from "@/features/projects/ProjectLogo";

export default function MyEquityPage() {
  const { data: transactions = [], isLoading } = useMyTransactions();
  const { data: projects = [] } = useProjects();

  const byProject = new Map<string, typeof transactions>();
  for (const tx of transactions) {
    const list = byProject.get(tx.project_id) ?? [];
    list.push(tx);
    byProject.set(tx.project_id, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My equity</h1>
        <p className="text-sm text-muted-foreground">Your accumulated ownership across all projects.</p>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {!isLoading && transactions.length === 0 && (
        <Card className="p-6 text-muted-foreground">
          You don't have any equity transactions yet. Once your hours are approved they'll appear here.
        </Card>
      )}

      <div className="grid gap-4">
        {Array.from(byProject.entries()).map(([projectId, txs]) => {
          const project = projects.find((p) => p.id === projectId);
          const allocations = aggregateAllocations(txs, null);
          const mine = allocations[0];
          const now = new Date();
          const vestedNow = txs.reduce(
            (s, tx) => s + Number(tx.percentage_delta) * vestingFactor(new Date(tx.created_at), now, { vesting_cliff_months: 0, vesting_duration_months: 0 }),
            0,
          );
          return (
            <Card key={projectId} className="p-5">
              <div className="flex items-center gap-4">
                <ProjectLogo path={project?.logo_url ?? null} name={project?.name ?? ""} size={48} />
                <div className="flex-1">
                  <div className="font-semibold">{project?.name ?? "Project"}</div>
                  <div className="text-xs text-muted-foreground">
                    {txs.length} transaction{txs.length === 1 ? "" : "s"} · {mine?.hours.toFixed(2) ?? 0}h logged
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums">{mine?.earned_pct.toFixed(4) ?? "0.0000"}%</div>
                  <div className="text-xs text-muted-foreground">Vested {vestedNow.toFixed(4)}%</div>
                </div>
                {project && (
                  <Link to={`/app/projects/${project.id}/equity`} className="text-sm text-primary hover:underline">
                    Project →
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
