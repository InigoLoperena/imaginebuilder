import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProject } from "@/features/projects/api";
import { useProfiles } from "@/features/ownership/api";
import { useActivePolicy, useProjectTransactions } from "@/features/equity/api";
import { aggregateAllocations } from "@/features/equity/calc";
import { EquitySummaryCard } from "@/features/equity/components/EquitySummaryCard";
import { ContributorEquityTable } from "@/features/equity/components/ContributorEquityTable";

export default function ProjectEquityPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  const { data: profiles = [] } = useProfiles();
  const { data: policy } = useActivePolicy(id);
  const { data: transactions = [] } = useProjectTransactions(id);

  const nameOf = (uid: string) => {
    const p = profiles.find((x) => x.id === uid);
    return p?.full_name || p?.email || uid.slice(0, 8);
  };

  const allocations = aggregateAllocations(transactions, policy);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Equity dashboard</div>
          <h1 className="text-2xl font-semibold">{project?.name ?? "Project"}</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/app/projects/${id}/equity/ledger`}>View ledger</Link>
        </Button>
      </div>

      <EquitySummaryCard policy={policy} allocations={allocations} />

      <div>
        <h2 className="font-semibold mb-3">Contributors</h2>
        <ContributorEquityTable
          allocations={allocations}
          nameOf={nameOf}
          showVesting={!!policy && policy.vesting_duration_months > 0}
        />
      </div>
    </div>
  );
}
