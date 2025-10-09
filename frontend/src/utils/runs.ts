export const getScoreColor = (score: number) => {
  if (score >= 90)
    return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
  if (score >= 70)
    return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
  return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
