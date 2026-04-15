import { Shield, Medal, Trophy } from "lucide-react";

export default function RankBadge({ workoutsCount, xpPoints }) {
  let rank = "Iron";
  let rankColor = "text-slate-500";
  let borderColor = "border-slate-500/50";
  let icon = <Shield className="w-6 h-6 text-slate-500" />;
  let nextRank = 5;

  if (workoutsCount >= 20) {
    rank = "Gold";
    rankColor = "text-yellow-400";
    borderColor = "border-yellow-400/50";
    icon = <Trophy className="w-6 h-6 text-yellow-400" />;
    nextRank = null;
  } else if (workoutsCount >= 10) {
    rank = "Silver";
    rankColor = "text-slate-300";
    borderColor = "border-slate-300/50";
    icon = <Medal className="w-6 h-6 text-slate-300" />;
    nextRank = 20;
  } else if (workoutsCount >= 5) {
    rank = "Bronze";
    rankColor = "text-amber-600";
    borderColor = "border-amber-600/50";
    icon = <Shield className="w-6 h-6 text-amber-600" />;
    nextRank = 10;
  }

  const progress = nextRank ? Math.min((workoutsCount / nextRank) * 100, 100) : 100;

  return (
    <div className={`p-4 border border-white/10 bg-zinc-950 flex flex-col md:flex-row items-center justify-between gap-4 w-full rounded-none`}>
      <div className="flex items-center gap-4 w-full">
        <div className={`p-2 border rounded-none bg-black ${borderColor}`}>
            {icon}
        </div>
        <div>
          <p className={`uppercase tracking-widest text-sm font-bold ${rankColor}`}>DIVISION: {rank}</p>
          <p className="text-white/50 text-[10px] tracking-widest uppercase">Validated ops: {workoutsCount} • Total XP: {xpPoints || 0}</p>
        </div>
      </div>
      {nextRank ? (
        <div className="w-full md:w-32">
          <div className="flex justify-between items-center mb-1">
             <p className="text-[10px] uppercase tracking-widest text-white/50">Progress</p>
             <p className="text-[10px] uppercase tracking-widest text-primary">{workoutsCount} / {nextRank}</p>
          </div>
          <div className="w-full bg-black border border-white/10 h-2 rounded-none">
            <div className={`h-full transition-all duration-500 bg-primary`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : (
          <p className="text-[10px] uppercase tracking-widest text-primary w-full md:w-32 text-right">MAX LEVEL</p>
      )}
    </div>
  )
}
