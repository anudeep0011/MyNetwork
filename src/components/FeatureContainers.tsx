import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, MemoryJarEntry, Confession, SuperlativeVote, PhotoWallEntry, SecretAdmirerEntry, ThankYouCard, MapPin } from '../types';
import { generateBatchId } from '../lib/utils';
import { useToast } from './ui/Toast';
import { MoodCloud } from './ui/MoodCloud';
import { MemoryJar } from './ui/MemoryJar';
import { ConfessionsWall } from './ui/ConfessionsWall';
import { SuperlativesVoting } from './ui/SuperlativesVoting';
import { PhotoWall } from './ui/PhotoWall';
import { SecretAdmirer } from './ui/SecretAdmirer';
import { ThankYouCards } from './ui/ThankYouCards';
import { TheLastDayMap } from './ui/TheLastDayMap';
import { Loading } from './ui/Loading';

interface FeatureProps {
  profile: UserProfile;
}

export const MoodCloudContainer = ({ profile }: FeatureProps) => {
  const batchId = generateBatchId(profile.college, profile.graduationYear);
  const [entries, setEntries] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'batches', batchId, 'moods'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, `batches/${batchId}/moods`));
  }, [batchId]);

  const handleSetMood = async (mood: string) => {
    try {
      const moodDoc = doc(db, 'batches', batchId, 'moods', auth.currentUser!.uid);
      await updateDoc(moodDoc, { mood, updatedAt: Timestamp.now() }).catch(async () => {
        await addDoc(collection(db, 'batches', batchId, 'moods'), {
          userId: auth.currentUser!.uid,
          mood,
          updatedAt: Timestamp.now()
        });
      });
      toast('Mood updated!', 'success');
    } catch (error) {
      toast('Failed to update mood.', 'error');
    }
  };

  return <MoodCloud onSetMood={handleSetMood} entries={entries} />;
};

export const MemoryJarContainer = ({ profile }: FeatureProps) => {
  const batchId = generateBatchId(profile.college, profile.graduationYear);
  const [entries, setEntries] = useState<MemoryJarEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'batches', batchId, 'memories'), orderBy('postedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemoryJarEntry)));
    }, (error) => handleFirestoreError(error, OperationType.GET, `batches/${batchId}/memories`));
  }, [batchId]);

  const handleAddEntry = async (text: string) => {
    try {
      await addDoc(collection(db, 'batches', batchId, 'memories'), {
        text,
        postedAt: Timestamp.now()
      });
      toast('Memory added to the jar!', 'success');
    } catch (error) {
      toast('Failed to add memory.', 'error');
    }
  };

  return <MemoryJar onAddEntry={handleAddEntry} entries={entries} />;
};

export const ConfessionsWallContainer = ({ profile }: FeatureProps) => {
  const batchId = generateBatchId(profile.college, profile.graduationYear);
  const [entries, setEntries] = useState<Confession[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'batches', batchId, 'confessions'), orderBy('postedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Confession)));
    }, (error) => handleFirestoreError(error, OperationType.GET, `batches/${batchId}/confessions`));
  }, [batchId]);

  const handleAddConfession = async (text: string) => {
    try {
      await addDoc(collection(db, 'batches', batchId, 'confessions'), {
        text,
        postedAt: Timestamp.now(),
        spamHash: Math.random().toString(36).substring(7)
      });
      toast('Confession posted anonymously!', 'success');
    } catch (error) {
      toast('Failed to post confession.', 'error');
    }
  };

  return <ConfessionsWall onAddConfession={handleAddConfession} entries={entries} />;
};

export const SuperlativesVotingContainer = ({ profile }: FeatureProps) => {
  const batchId = generateBatchId(profile.college, profile.graduationYear);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [votes, setVotes] = useState<SuperlativeVote[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const qUsers = query(collection(db, 'users'), where('college', '==', profile.college), where('graduationYear', '==', profile.graduationYear));
    const qVotes = query(collection(db, 'batches', batchId, 'superlatives'), where('voterId', '==', auth.currentUser!.uid));
    
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });

    const unsubVotes = onSnapshot(qVotes, (snapshot) => {
      setVotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SuperlativeVote)));
    });

    return () => {
      unsubUsers();
      unsubVotes();
    };
  }, [batchId, profile]);

  const handleVote = async (categoryId: string, targetId: string) => {
    try {
      // Check if already voted for this category
      const existingVote = votes.find(v => v.categoryId === categoryId);
      if (existingVote) {
        await updateDoc(doc(db, 'batches', batchId, 'superlatives', existingVote.id), { targetId });
      } else {
        await addDoc(collection(db, 'batches', batchId, 'superlatives'), {
          categoryId,
          voterId: auth.currentUser!.uid,
          targetId,
          batchId
        });
      }
      toast('Vote cast!', 'success');
    } catch (error) {
      toast('Failed to cast vote.', 'error');
    }
  };

  return <SuperlativesVoting users={users} onVote={handleVote} entries={votes} />;
};

export const PhotoWallContainer = ({ profile }: FeatureProps) => {
  const batchId = generateBatchId(profile.college, profile.graduationYear);
  const [entries, setEntries] = useState<PhotoWallEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'batches', batchId, 'photos'), orderBy('uploadedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PhotoWallEntry)));
    }, (error) => handleFirestoreError(error, OperationType.GET, `batches/${batchId}/photos`));
  }, [batchId]);

  const handleAddPhoto = async (photoUrl: string, caption: string) => {
    try {
      await addDoc(collection(db, 'batches', batchId, 'photos'), {
        photoUrl,
        caption,
        uploaderId: auth.currentUser!.uid,
        uploaderName: profile.name,
        uploadedAt: Timestamp.now()
      });
      toast('Photo uploaded to the wall!', 'success');
    } catch (error) {
      toast('Failed to upload photo.', 'error');
    }
  };

  return <PhotoWall onAddPhoto={handleAddPhoto} entries={entries} />;
};

export const SecretAdmirerContainer = ({ profile }: FeatureProps) => {
  const batchId = generateBatchId(profile.college, profile.graduationYear);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [sentEntries, setSentEntries] = useState<SecretAdmirerEntry[]>([]);
  const [receivedEntries, setReceivedEntries] = useState<SecretAdmirerEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const qUsers = query(collection(db, 'users'), where('college', '==', profile.college), where('graduationYear', '==', profile.graduationYear));
    const qSent = query(collection(db, 'batches', batchId, 'admirers'), where('senderId', '==', auth.currentUser!.uid));
    const qReceived = query(collection(db, 'batches', batchId, 'admirers'), where('targetId', '==', auth.currentUser!.uid));
    
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });

    const unsubSent = onSnapshot(qSent, (snapshot) => {
      setSentEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecretAdmirerEntry)));
    }, (error) => handleFirestoreError(error, OperationType.GET, `batches/${batchId}/admirers`));

    const unsubReceived = onSnapshot(qReceived, (snapshot) => {
      setReceivedEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecretAdmirerEntry)));
    }, (error) => handleFirestoreError(error, OperationType.GET, `batches/${batchId}/admirers`));

    return () => {
      unsubUsers();
      unsubSent();
      unsubReceived();
    };
  }, [batchId, profile]);

  const handleAddAdmirer = async (targetId: string, text: string) => {
    try {
      await addDoc(collection(db, 'batches', batchId, 'admirers'), {
        senderId: auth.currentUser!.uid,
        targetId,
        text,
        sentAt: Timestamp.now(),
        revealed: false
      });
      toast('Message sent secretly!', 'success');
    } catch (error) {
      toast('Failed to send message.', 'error');
    }
  };

  const mutualMatches = receivedEntries.filter(received => 
    sentEntries.some(sent => sent.targetId === received.senderId)
  );

  return <SecretAdmirer users={users} onAddAdmirer={handleAddAdmirer} entries={sentEntries} matches={mutualMatches} />;
};

export const ThankYouCardsContainer = ({ profile }: FeatureProps) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [entries, setEntries] = useState<ThankYouCard[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const qUsers = query(collection(db, 'users'), where('college', '==', profile.college), where('graduationYear', '==', profile.graduationYear));
    const qThanks = query(collection(db, 'users', profile.uid, 'thanks'), orderBy('sentAt', 'desc'));
    
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });

    const unsubThanks = onSnapshot(qThanks, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ThankYouCard)));
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${profile.uid}/thanks`));

    return () => {
      unsubUsers();
      unsubThanks();
    };
  }, [profile]);

  const handleSendCard = async (targetId: string, text: string) => {
    try {
      await addDoc(collection(db, 'users', targetId, 'thanks'), {
        senderId: auth.currentUser!.uid,
        senderName: profile.name,
        targetId,
        text,
        sentAt: Timestamp.now()
      });
      toast('Thank you card sent!', 'success');
    } catch (error) {
      toast('Failed to send card.', 'error');
    }
  };

  return <ThankYouCards users={users} onSendCard={handleSendCard} entries={entries} />;
};

export const TheLastDayMapContainer = ({ profile }: FeatureProps) => {
  const batchId = generateBatchId(profile.college, profile.graduationYear);
  const [entries, setEntries] = useState<MapPin[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'batches', batchId, 'map_pins'), orderBy('postedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MapPin)));
    }, (error) => handleFirestoreError(error, OperationType.GET, `batches/${batchId}/map_pins`));
  }, [batchId]);

  const handleAddPin = async (lat: number, lng: number, text: string) => {
    try {
      await addDoc(collection(db, 'batches', batchId, 'map_pins'), {
        lat,
        lng,
        text,
        userId: auth.currentUser!.uid,
        userName: profile.name,
        postedAt: Timestamp.now()
      });
      toast('Pin dropped on the map!', 'success');
    } catch (error) {
      toast('Failed to drop pin.', 'error');
    }
  };

  return <TheLastDayMap onAddPin={handleAddPin} entries={entries} />;
};
