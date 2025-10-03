export interface Room {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  roomId: string;
  username: string;
  content: string;
  timestamp: number;
}
