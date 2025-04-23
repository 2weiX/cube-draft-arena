
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/lib/types';

interface TopPlayerCardProps {
  player: Player & {
    matchWinPercentage: number;
    gameWinPercentage: number;
  };
}

export const TopPlayerCard = ({ player }: TopPlayerCardProps) => {
  if (!player) return null;

  return (
    <Card className="mb-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/5">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback className="text-2xl">{player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1">{player.name}</h2>
            <p className="text-muted-foreground mb-2">
              {player.username ? `@${player.username}` : 'Top Ranked Player'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div>
                <p className="text-sm text-muted-foreground">Wins</p>
                <p className="text-xl font-bold text-green-500">{player.wins}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Losses</p>
                <p className="text-xl font-bold text-red-500">{player.losses}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Draws</p>
                <p className="text-xl font-bold">{player.draws}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-xl font-bold">{player.matchWinPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
