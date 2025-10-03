import { io, Socket } from 'socket.io-client';
import type { Room, Message } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  async fetchRooms(): Promise<Room[]> {
    const response = await fetch(`${API_URL}/api/rooms`);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return response.json();
  },

  async createRoom(name: string, description?: string): Promise<Room> {
    const response = await fetch(`${API_URL}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create room');
    }
    return response.json();
  },

  async fetchMessages(roomId: string): Promise<Message[]> {
    const response = await fetch(`${API_URL}/api/messages/room/${roomId}`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  }
};

let socket: Socket | null = null;

export const socketManager = {
  connect(): Socket {
    if (!socket) {
      socket = io(API_URL);
    }
    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket(): Socket | null {
    return socket;
  }
};
