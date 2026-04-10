import { Badge } from "@/components/ui/badge";

const PoolTypeBadge = ({ type }: { type: string | null }) => {
  if (!type) return null;
  const lower = type.toLowerCase();
  const variant = lower === "outdoor" ? "default" : lower === "indoor" ? "secondary" : "outline";
  const colors = lower === "outdoor"
    ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
    : lower === "indoor"
    ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
    : "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100";

  return <Badge variant={variant} className={colors}>{type}</Badge>;
};

export default PoolTypeBadge;
