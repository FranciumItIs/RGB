import { Medal, Star, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PlayerData {
  name: string;
  points: number;
  rgb: string;
}

interface DashboardProps {
  players: PlayerData[];
}

export default function Dashboard({ players }: DashboardProps) {
  const [sortedPlayers, setSortedPlayers] = useState(players);
  const [searchRgb, setSearchRgb] = useState('');

  useEffect(() => {
    setSortedPlayers([...players].sort((a, b) => b.points - a.points));
  }, [players]);

  const handleRgbSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRgb(event.target.value);
    filterPlayers(event.target.value, event.target.value);
  };

  const filterPlayers = (rgbFilter: string, playerFilter: string) => {
    if (playerFilter !== ""){
      const filtered = players.filter(player => player.name.toLowerCase().includes(playerFilter.toLowerCase()));
      setSortedPlayers([...filtered].sort((a, b) => b.points - a.points));
    } else if (rgbFilter !== ""){
    const filtered = players.filter(player => player.rgb.toLowerCase().includes(rgbFilter.toLowerCase()));
    setSortedPlayers([...filtered].sort((a, b) => b.points - a.points));
    } else {
      setSortedPlayers([...players].sort((a, b) => b.points - a.points));
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Performance Dashboard
      </h2>

      <div>  {/* Search bar container */}
        <label htmlFor="rgbSearch" className="block text-sm font-medium text-gray-700 mb-1">Search by RGB:</label>
        <input
          type="text"
          id="rgbSearch"
          value={searchRgb}
          onChange={handleRgbSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter RGB value (e.g., #ff0000)"
        />
      </div>

      <div className="grid gap-6">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.name + index}
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: `${player.rgb}15` }}
          >
            <div className="flex items-center gap-4">
              {index === 0 && <Medal className="w-6 h-6 text-yellow-500" />}
              {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
              {index === 2 && <Medal className="w-6 h-6 text-amber-700" />}
              {index > 2 && <Star className="w-6 h-6 text-blue-500" />}
              
              <div>
                <h3 className="font-semibold text-lg">{player.name}</h3>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: player.rgb }}
                  />
                  <span className="text-sm text-gray-600">{player.rgb}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">{player.points}</div>
              <div className="text-sm text-gray-600">points</div>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No player data available. Add some players to see the dashboard!
        </div>
      )}
    </div>
  );
}