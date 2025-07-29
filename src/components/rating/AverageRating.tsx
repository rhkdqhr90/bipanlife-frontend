interface Rating {
  name: string;
  score: number;
  type: "POSITIVE" | "NEGATIVE";
}

interface AverageRatingDisplayProps {
  ratings: Rating[];
}

export const AverageRatingDisplay = ({ ratings }: AverageRatingDisplayProps) => {
  if (!ratings || ratings.length === 0) return null;

  const total = ratings.reduce((sum, r) => {
    const score = r.type === "POSITIVE" ? r.score : -r.score;
    return sum + score;
  }, 0);

  const avg = total / ratings.length;
  const color = avg >= 0 ? "text-yellow-500" : "text-purple-500";

  return <span className={`font-semibold ${color}`}>{avg.toFixed(1)}점</span>;
};
