/*
  # Create Chat Application Schema

  ## Overview
  Creates a real-time chat application database with rooms and messages.

  ## 1. New Tables
  
  ### `rooms`
  - `id` (uuid, primary key) - Unique identifier for each room
  - `name` (text, unique, not null) - Display name of the chat room
  - `created_at` (timestamptz) - Timestamp when room was created
  
  ### `messages`
  - `id` (uuid, primary key) - Unique identifier for each message
  - `room_id` (uuid, foreign key) - References the room this message belongs to
  - `username` (text, not null) - Name of user who sent the message
  - `content` (text, not null) - The message content
  - `created_at` (timestamptz) - Timestamp when message was sent

  ## 2. Security (Row Level Security)
  
  ### Rooms Table
  - Enable RLS on rooms table
  - Anyone can view all rooms (public read access)
  - Anyone can create new rooms (public insert access)
  
  ### Messages Table
  - Enable RLS on messages table
  - Anyone can view messages (public read access)
  - Anyone can send messages (public insert access)

  ## 3. Performance
  - Index on `messages.room_id` for faster room message queries
  - Index on `messages.created_at` for chronological ordering
  - Cascade delete messages when room is deleted

  ## 4. Important Notes
  - This is a simplified public chat app
  - No authentication required for demo purposes
  - All users can create rooms and send messages
  - Real-time subscriptions will be used for live updates
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS messages_room_id_idx ON messages(room_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Rooms policies: Allow anyone to view and create rooms
CREATE POLICY "Anyone can view rooms"
  ON rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create rooms"
  ON rooms FOR INSERT
  WITH CHECK (true);

-- Messages policies: Allow anyone to view and send messages
CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);