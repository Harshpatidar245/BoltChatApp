import { useState, useEffect, useCallback } from 'react';
import { api, socketManager } from '../lib/api';
import { Room, Message } from '../types';

export function useChatStore() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  useEffect(() => {
    const socket = socketManager.connect();

    loadRooms();

    socket.on('new-message', (message: any) => {
      const newMessage: Message = {
        id: message._id,
        roomId: message.roomId,
        username: message.username,
        content: message.content,
        timestamp: new Date(message.createdAt).getTime(),
      };
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      socketManager.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentRoomId) {
      const socket = socketManager.getSocket();
      if (socket) {
        socket.emit('join-room', currentRoomId);
        loadMessages(currentRoomId);
      }

      return () => {
        if (socket) {
          socket.emit('leave-room', currentRoomId);
        }
      };
    }
  }, [currentRoomId]);

  const loadRooms = async () => {
    try {
      const data = await api.fetchRooms();
      setRooms(data.map(room => ({
        id: room._id || room.id,
        name: room.name,
      })));
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const data = await api.fetchMessages(roomId);
      const roomMessages = data.map(msg => ({
        id: msg._id || msg.id,
        roomId: msg.roomId,
        username: msg.username,
        content: msg.content,
        timestamp: new Date(msg.createdAt).getTime(),
      }));
      setMessages(prev => {
        const filtered = prev.filter(m => m.roomId !== roomId);
        return [...filtered, ...roomMessages];
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createRoom = useCallback(async (name: string): Promise<Room | null> => {
    try {
      const data = await api.createRoom(name);
      const newRoom = {
        id: data._id || data.id,
        name: data.name,
      };
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  }, []);

  const sendMessage = useCallback((roomId: string, username: string, content: string) => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('send-message', { roomId, username, content });
    }
  }, []);

  const getMessagesForRoom = useCallback((roomId: string) => {
    return messages.filter(msg => msg.roomId === roomId);
  }, [messages]);

  const selectRoom = useCallback((roomId: string) => {
    setCurrentRoomId(roomId);
  }, []);

  return {
    rooms,
    loading,
    createRoom,
    sendMessage,
    getMessagesForRoom,
    selectRoom,
  };
}
