import { useState } from 'react';
import { Room } from './types';
import { useChatStore } from './hooks/useChatStore';
import { RoomSelector } from './components/RoomSelector';
import { ChatRoom } from './components/ChatRoom';

function App() {
  const { rooms, loading, createRoom, sendMessage, getMessagesForRoom, selectRoom } = useChatStore();
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [username, setUsername] = useState<string>('');

  const handleCreateRoom = async (name: string) => {
    await createRoom(name);
  };

  const handleJoinRoom = (room: Room, user: string) => {
    setCurrentRoom(room);
    setUsername(user);
    selectRoom(room.id);
  };

  const handleSendMessage = (content: string) => {
    if (currentRoom) {
      sendMessage(currentRoom.id, username, content);
    }
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setUsername('');
  };

  if (currentRoom) {
    return (
      <ChatRoom
        roomName={currentRoom.name}
        username={username}
        messages={getMessagesForRoom(currentRoom.id)}
        onSendMessage={handleSendMessage}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  return (
    <RoomSelector
      rooms={rooms}
      loading={loading}
      onCreateRoom={handleCreateRoom}
      onJoinRoom={handleJoinRoom}
    />
  );
}

export default App;
