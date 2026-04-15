import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';
import useWorkoutStore from '../store/useWorkoutStore';
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const currentUser = useWorkoutStore((state) => state.currentUser);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await getLeaderboard();
        if (res.data?.status === 'success') {
          setLeaderboard(res.data.leaderboard);
        }
      } catch {
        toast.error('Failed to load motherboard data.');
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex justify-center p-6 bg-zinc-950 min-h-screen">
        <Card className="w-full max-w-4xl rounded-none border border-white/10 bg-black p-8 shadow-none text-white h-auto self-start">
            <CardHeader className="p-0 mb-6 flex flex-row justify-between items-end border-b border-white/10 pb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Global Ranking
                    </p>
                    <CardTitle className="text-3xl font-extrabold uppercase tracking-tight text-white">
                        Multiplayer Ladder
                    </CardTitle>
                    <CardDescription className="text-white/50 text-xs tracking-widest uppercase mt-2">
                        Top 10 highest XP operators.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Table className="uppercase tracking-widest">
                <TableHeader>
                    <TableRow className="border-b border-white/10 hover:bg-transparent">
                    <TableHead className="w-[100px] text-white/50">Rank</TableHead>
                    <TableHead className="text-white/50">Operator</TableHead>
                    <TableHead className="text-right text-white/50">XP points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaderboard.map((user, index) => {
                    const isMe = String(user.id) === String(currentUser?.id);
                    return (
                        <TableRow 
                            key={user.id} 
                            className={`border-b border-white/10 transition-colors ${isMe ? 'bg-primary/10 border-primary' : 'hover:bg-white/5'}`}
                        >
                            <TableCell className={`font-bold ${isMe ? 'text-primary' : 'text-white'}`}>
                                #{index + 1}
                            </TableCell>
                            <TableCell className={isMe ? 'text-primary' : 'text-white/80'}>
                                {user.email} {isMe && <span className="ml-2 text-[10px] bg-primary text-black px-2 py-0.5 font-bold">YOU</span>}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${isMe ? 'text-primary' : 'text-white'}`}>
                                {user.xp_points} XP
                            </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
