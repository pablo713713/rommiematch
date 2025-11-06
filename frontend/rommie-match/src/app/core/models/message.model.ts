export interface Message {
  id: number;
  content: string;
  createdAt: string | null;
  read: boolean;

  senderId: number;
  senderName: string;
  senderRole: string | null;

  recipientId: number;

  listingId?: number | null;
  listingTitle?: string | null;
}
