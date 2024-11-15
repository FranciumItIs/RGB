import { PlusCircle, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PlayerData {
  name: string;
  points: number;
  rgb: string;
}

interface InputScreenProps {
  onSaveData: (data: PlayerData) => void;
}

export default function InputScreen({ onSaveData }: InputScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [points, setPoints] = useState('');
  const [rgb, setRgb] = useState('#000000');
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (playerName.length > 1) { // Start fetching after at least 2 characters
          try {
            const response = await fetch(`/api/players/names?name=${playerName}`); // Use query parameter
            const data = await response.json();
            setSuggestedNames(data);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
          }
        } else {
            setSuggestedNames([]); // Clear suggestions if input is short
        }
    };
    fetchSuggestions();
  }, [playerName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName || !points || !rgb) return;

    onSaveData({
      name: playerName,
      points: Number(points),
      rgb: rgb,
    });

    setPlayerName('');
    setPoints('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <PlusCircle className="w-6 h-6" />
        Add Player Performance
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Player Name
        </label>
        <input
          type="text"
          value={playerName}
          onChange={handleNameChange} // Use the new change handler
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />

          {/* Display Autocomplete Suggestions */}
        {suggestedNames.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-md mt-1">
              {suggestedNames.map((name) => (
                <li
                  key={name}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setPlayerName(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}

      </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Performance Points
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RGB Color
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={rgb}
              onChange={(e) => setRgb(e.target.value)}
              className="h-10 w-20"
            />
            <span className="text-sm text-gray-600">{rgb}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Performance
        </button>
      </form>
    </div>
  );
}