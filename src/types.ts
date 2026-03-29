export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  instagram: string;
  linkedin?: string;
  branch: string;
  college: string;
  graduationYear: number;
  photoUrl: string;
  farewellQuote: string;
  qrCodeData: string;
  createdAt: any; // Firestore Timestamp
  madeBetterCount: number;
  fourAmCount: number;
}

export interface Connection {
  id: string;
  scannedUserId: string;
  scannedAt: any; // Firestore Timestamp
  savedToContacts: boolean;
}

export interface FarewellNote {
  id: string;
  senderId: string;
  senderName: string;
  senderPhotoUrl: string;
  type: 'text' | 'drawing';
  content: string;
  sentAt: any; // Firestore Timestamp
}

export interface BatchInfo {
  id: string; // collegeSlug_year
  college: string;
  graduationYear: number;
  farewellDate: any; // Firestore Timestamp
  anthemSong?: string;
  moodCounts: Record<string, number>;
  goodbyeWords: string[];
  adminUserId: string;
}

export interface Confession {
  id: string;
  text: string;
  postedAt: any; // Firestore Timestamp
  spamHash: string;
}

export interface SuperlativeVote {
  id: string;
  categoryId: string;
  voterId: string;
  targetId: string;
  batchId: string;
}

export interface MemoryJarEntry {
  id: string;
  text: string;
  postedAt: any; // Firestore Timestamp
}

export interface PhotoWallEntry {
  id: string;
  photoUrl: string;
  uploaderId: string;
  uploaderName: string;
  uploadedAt: any; // Firestore Timestamp
}

export interface BatchMood {
  id: string;
  userId: string;
  mood: string;
  updatedAt: any; // Firestore Timestamp
}

export interface SecretAdmirerEntry {
  id: string;
  senderId: string;
  targetId: string;
  text: string;
  sentAt: any; // Firestore Timestamp
  revealed: boolean;
}

export interface ThankYouCard {
  id: string;
  senderId: string;
  senderName: string;
  targetId: string;
  text: string;
  sentAt: any; // Firestore Timestamp
}

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  text: string;
  userId: string;
  userName: string;
  postedAt: any; // Firestore Timestamp
}

export interface SuperlativeResult {
  categoryId: string;
  winnerId: string;
  winnerName: string;
  winnerPhotoUrl: string;
  voteCount: number;
}
