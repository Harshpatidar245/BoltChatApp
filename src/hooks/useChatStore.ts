import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Room, Message } from '../types';

export function useChatStore() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
    loadMessages();

    const roomsSubscription = supabase
      .channel('rooms-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rooms' }, (payload) => {
        const newRoom: Room = {
          id: payload.new.id,
          name: payload.new.name,
        };
        setRooms(prev => [...prev, newRoom]);
      })
      .subscribe();

    const messagesSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage: Message = {
          id: payload.new.id,
          roomId: payload.new.room_id,
          username: payload.new.username,
          content: payload.new.content,
          timestamp: new Date(payload.new.created_at).getTime(),
        };
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      roomsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, []);

  const loadRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading rooms:', error);
      return;
    }

    if (data) {
      setRooms(data.map(room => ({
        id: room.id,
        name: room.name,
      })));
    }
    setLoading(false);
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (data) {
      setMessages(data.map(msg => ({
        id: msg.id,
        roomId: msg.room_id,
        username: msg.username,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
      })));
    }
  };

  const createRoom = useCallback(async (name: string): Promise<Room | null> => {
    const { data, error } = await supabase
      .from('rooms')
      .insert({ name })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
    };
  }, []);

  const sendMessage = useCallback(async (roomId: string, username: string, content: string) => {
    const { error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        username,
        content,
      });

    if (error) {
      console.error('Error sending message:', error);
    }
  }, []);

  const getMessagesForRoom = useCallback((roomId: string) => {
    return messages.filter(msg => msg.roomId === roomId);
  }, [messages]);

  return {
    rooms,
    loading,
    createRoom,
    sendMessage,
    getMessagesForRoom,
  };
}
