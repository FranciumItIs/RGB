import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import InputScreen from './components/InputScreen';

interface PlayerData {
  name: string;
  points: number;
  rgb: string;
}

function App() {
  const [players, setPlayers] = useState<PlayerData[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players'); // Example with explicit port  // Fetch from your backend API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching player data:', error);
        // Handle the error (e.g., display an error message)
      }
    };

    fetchPlayers();
  }, []); // Empty dependency array ensures this runs only once on mount


  const handleSaveData = async (data: PlayerData) => {
    try {
      const response = await fetch('http://localhost:5000/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok')
      }

      const newPlayer = await response.json();
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]);

    } catch (error) {
      console.error('Error saving player data:', error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Player Performance Tracker
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <InputScreen onSaveData={handleSaveData} />
          <Dashboard players={players} />
        </div>
      </div>
    </div>
  );
}

export default App;