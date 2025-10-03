import { useState } from 'react';
import { Room } from '../types';
import { Plus, LogIn } from 'lucide-react';

interface RoomSelectorProps {
  rooms: Room[];
  loading: boolean;
  onCreateRoom: (name: string) => Promise<void>;
  onJoinRoom: (room: Room, username: string) => void;
}

export function RoomSelector({ rooms, loading, onCreateRoom, onJoinRoom }: RoomSelectorProps) {
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim() && !creating) {
      setCreating(true);
      await onCreateRoom(roomName.trim());
      setRoomName('');
      setCreating(false);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoom && username.trim()) {
      onJoinRoom(selectedRoom, username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Chat Rooms</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New Room</h2>
          <form onSubmit={handleCreateRoom} className="flex gap-2">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Join Room</h2>
          <form onSubmit={handleJoinRoom} className="space-y-3">
            <select
              value={selectedRoom?.id || ''}
              onChange={(e) => {
                const room = rooms.find(r => r.id === e.target.value);
                setSelectedRoom(room || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!selectedRoom || !username.trim()}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Join Room
            </button>
          </form>
        </div>

        {loading && (
          <p className="text-gray-500 text-center mt-6">Loading rooms...</p>
        )}
        {!loading && rooms.length === 0 && (
          <p className="text-gray-500 text-center mt-6">No rooms yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}
