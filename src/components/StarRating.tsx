import { Star } from "lucide-react";

const StarRating = ({ rating, reviewCount }: { rating: number | null; reviewCount: number | null }) => {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < full ? "fill-yellow-400 text-yellow-400" : i === full && half ? "fill-yellow-400/50 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      {reviewCount != null && (
        <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;
