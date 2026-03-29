import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, orderBy, onSnapshot, Timestamp, addDoc, limit } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, Connection, FarewellNote } from './types';
import { Layout } from './components/ui/Layout';
import { Loading } from './components/ui/Loading';
import { ToastProvider, useToast } from './components/ui/Toast';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/Card';
import { Avatar } from './components/ui/Avatar';
import { ProfileCard } from './components/ui/ProfileCard';
import { QRScanner } from './components/ui/QRScanner';
import { QRCodeDisplay } from './components/ui/QRCodeDisplay';
import { BatchWallGrid } from './components/ui/BatchWallGrid';
import { SignatureCanvas } from './components/ui/SignatureCanvas';
import { NoteCard } from './components/ui/NoteCard';
import { EmptyState } from './components/ui/EmptyState';
import { Camera, Users, History, User as UserIcon, LogIn, Sparkles, MessageCircle } from 'lucide-react';
import { BRANCH_OPTIONS, GRADUATION_YEARS } from './constants';
import { generateBatchId } from './lib/utils';
import {
  MoodCloudContainer,
  MemoryJarContainer,
  ConfessionsWallContainer,
  SuperlativesVotingContainer,
  PhotoWallContainer,
  SecretAdmirerContainer,
  ThankYouCardsContainer,
  TheLastDayMapContainer
} from './components/FeatureContainers';
import { TimeCapsule } from './components/ui/TimeCapsule';
import { BatchPredictions } from './components/ui/BatchPredictions';
import { ProfessorWall } from './components/ui/ProfessorWall';
import { UnsentMessage } from './components/ui/UnsentMessage';
import { WhoMadeYouBetter } from './components/ui/WhoMadeYouBetter';
import { The4AMList } from './components/ui/The4AMList';
import { BatchTrivia } from './components/ui/BatchTrivia';
import { BatchConstellation } from './components/ui/BatchConstellation';
import { TheInheritance } from './components/ui/TheInheritance';
import { CollegeBucketList } from './components/ui/CollegeBucketList';
import { BatchAnthemVote } from './components/ui/BatchAnthemVote';
import { GoodbyeRitual } from './components/ui/GoodbyeRitual';
import { TheWitness } from './components/ui/TheWitness';
import { Dialog } from './components/ui/Dialog';

// --- Components ---

const ProtectedRoute = ({ children, user, profile }: { children: React.ReactNode; user: User | null; profile: UserProfile | null }) => {
  if (!user) return <Navigate to="/login" />;
  if (!profile && window.location.pathname !== '/setup') return <Navigate to="/setup" />;
  return <>{children}</>;
};

const LoginPage = () => {
  const { toast } = useToast();
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast('Login failed. Please try again.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-200">
        <Camera className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-900">BatchSnap</h1>
      <p className="mb-8 max-w-xs text-slate-500">One day. One QR. Everyone you'll miss. Capture your farewell memories.</p>
      <Button onClick={handleLogin} size="lg" className="gap-2 px-8">
        <LogIn className="h-5 w-5" />
        Sign in with Google
      </Button>
    </div>
  );
};

const SetupPage = ({ user, onProfileCreated }: { user: User; onProfileCreated: (profile: UserProfile) => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.displayName || '',
    phone: '',
    instagram: '',
    linkedin: '',
    branch: BRANCH_OPTIONS[0],
    college: '',
    graduationYear: 2026,
    farewellQuote: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profile: UserProfile = {
        uid: user.uid,
        ...formData,
        photoUrl: user.photoURL || 'https://picsum.photos/seed/avatar/200/200',
        qrCodeData: user.uid,
        createdAt: Timestamp.now(),
        madeBetterCount: 0,
        fourAmCount: 0,
      };
      await setDoc(doc(db, 'users', user.uid), profile);
      onProfileCreated(profile);
      toast('Profile created successfully!', 'success');
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
      toast('Failed to create profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Tell your batchmates a bit about yourself.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Instagram Handle"
              placeholder="username"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              required
            />
            <Input
              label="LinkedIn URL (Optional)"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Branch</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                {BRANCH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <Input
              label="College Name"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Graduation Year</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
              >
                {GRADUATION_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Farewell Quote</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                maxLength={120}
                value={formData.farewellQuote}
                onChange={(e) => setFormData({ ...formData, farewellQuote: e.target.value })}
                required
              />
              <p className="text-right text-[10px] text-slate-400">{formData.farewellQuote.length}/120</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Start BatchSnap'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const HomePage = ({ profile }: { profile: UserProfile }) => {
  const navigate = useNavigate();
  const [batchmates, setBatchmates] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('college', '==', profile.college),
      where('graduationYear', '==', profile.graduationYear),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBatchmates(snapshot.docs.map(doc => doc.data() as UserProfile));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });
    return () => unsubscribe();
  }, [profile]);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hey, {profile.name.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-slate-500">Ready for the farewell?</p>
        </div>
        <Avatar src={profile.photoUrl} alt={profile.name} size="lg" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="cursor-pointer transition-all hover:shadow-md" onClick={() => navigate('/scan')}>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600">
                <Camera className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Scan QR</h3>
                <p className="text-xs text-slate-500">Connect with a batchmate</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="cursor-pointer transition-all hover:shadow-md" onClick={() => navigate('/profile')}>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-purple-100 p-4 text-purple-600">
                <UserIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">My QR</h3>
                <p className="text-xs text-slate-500">Show your profile</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Batch Wall</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/wall')}>View All</Button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <BatchWallGrid users={batchmates} onUserClick={(u) => navigate(`/profile/${u.uid}`)} />
        )}
      </section>
    </div>
  );
};

const ProfilePage = ({ profile, isOwn = true }: { profile: UserProfile; isOwn?: boolean }) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<FarewellNote[]>([]);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteType, setNoteType] = useState<'text' | 'drawing'>('text');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'users', profile.uid, 'notes'),
      orderBy('sentAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FarewellNote)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${profile.uid}/notes`);
    });
    return () => unsubscribe();
  }, [profile.uid]);

  const handleSendNote = async (content: string, type: 'text' | 'drawing') => {
    try {
      const note: Partial<FarewellNote> = {
        senderId: auth.currentUser!.uid,
        senderName: auth.currentUser!.displayName || 'Anonymous',
        senderPhotoUrl: auth.currentUser!.photoURL || '',
        type,
        content,
        sentAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'users', profile.uid, 'notes'), note);
      toast('Note sent!', 'success');
      setShowNoteDialog(false);
    } catch (error) {
      toast('Failed to send note.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <ProfileCard
        user={profile}
        isOwn={isOwn}
        onLeaveNote={() => setShowNoteDialog(true)}
      />

      {isOwn && (
        <section className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-bold text-slate-900">Your QR Code</h3>
          <QRCodeDisplay value={profile.uid} name={profile.name} />
        </section>
      )}

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Farewell Notes</h3>
        {notes.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No notes yet"
            description={isOwn ? "Your batchmates' notes will appear here." : "Be the first to leave a note!"}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {notes.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        )}
      </section>

      {showNoteDialog && (
        <Dialog
          onClose={() => setShowNoteDialog(false)}
          title={`Leave a note for ${profile.name}`}
          description="Your note will be visible on their profile wall."
        >
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Button
                variant={noteType === 'text' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setNoteType('text')}
              >
                Text Note
              </Button>
              <Button
                variant={noteType === 'drawing' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setNoteType('drawing')}
              >
                Signature/Drawing
              </Button>
            </div>

            {noteType === 'text' ? (
              <textarea
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Write something nice..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <SignatureCanvas onSave={(data) => setNoteContent(data)} onCancel={() => setNoteType('text')} />
                <p className="mt-2 text-center text-[10px] text-slate-400">Draw your signature or a small doodle</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>Cancel</Button>
            <Button
              onClick={() => handleSendNote(noteContent, noteType)}
              disabled={!noteContent}
            >
              Send Note
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

const ScanPage = ({ onScanned }: { onScanned: (uid: string) => void }) => {
  const navigate = useNavigate();
  return (
    <QRScanner
      onScan={(uid) => {
        onScanned(uid);
        navigate(`/profile/${uid}`);
      }}
      onClose={() => navigate('/')}
    />
  );
};

const HistoryPage = ({ profile }: { profile: UserProfile }) => {
  const [connections, setConnections] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'users', profile.uid, 'connections'),
      orderBy('scannedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const conns = await Promise.all(snapshot.docs.map(async d => {
        const data = d.data();
        const userDoc = await getDoc(doc(db, 'users', data.scannedUserId));
        return { id: d.id, ...data, user: userDoc.data() };
      }));
      setConnections(conns);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${profile.uid}/connections`);
    });
    return () => unsubscribe();
  }, [profile.uid]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Scan History</h1>
      {connections.length === 0 ? (
        <EmptyState
          icon={History}
          title="No scans yet"
          description="Start scanning QR codes to build your network!"
          actionLabel="Scan Now"
          onAction={() => navigate('/scan')}
        />
      ) : (
        <div className="space-y-4">
          {connections.map(conn => (
            <div key={conn.id} className="cursor-pointer" onClick={() => navigate(`/profile/${conn.scannedUserId}`)}>
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar src={conn.user?.photoUrl} alt={conn.user?.name} />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{conn.user?.name}</h4>
                    <p className="text-xs text-slate-500">{conn.user?.branch}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">
                      {conn.scannedAt?.toDate ? conn.scannedAt.toDate().toLocaleTimeString() : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route
            path="/setup"
            element={
              user ? (
                <SetupPage user={user} onProfileCreated={setProfile} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute user={user} profile={profile}>
                <Layout user={user} onLogout={logout}>
                  <Routes>
                    <Route path="/" element={profile && <HomePage profile={profile} />} />
                    <Route path="/features" element={profile && <FeaturesPage />} />
                    <Route path="/profile" element={profile && <ProfilePage profile={profile} isOwn />} />
                    <Route path="/profile/:uid" element={<ProfileViewer />} />
                    <Route path="/scan" element={<ScanPage onScanned={() => {}} />} />
                    <Route path="/history" element={profile && <HistoryPage profile={profile} />} />
                    <Route path="/network" element={profile && <HistoryPage profile={profile} />} />
                    <Route path="/wall" element={profile && <WallPage profile={profile} />} />
                    <Route path="/mood" element={profile && <MoodCloudContainer profile={profile} />} />
                    <Route path="/memories" element={profile && <MemoryJarContainer profile={profile} />} />
                    <Route path="/confessions" element={profile && <ConfessionsWallContainer profile={profile} />} />
                    <Route path="/superlatives" element={profile && <SuperlativesVotingContainer profile={profile} />} />
                    <Route path="/photos" element={profile && <PhotoWallContainer profile={profile} />} />
                    <Route path="/capsule" element={<TimeCapsule onAddEntry={(text, date) => console.log('Capsule added:', text, date)} entries={[]} />} />
                    <Route path="/predictions" element={<BatchPredictions onAddPrediction={(target, text) => console.log('Prediction:', target, text)} users={[]} entries={[]} />} />
                    <Route path="/secret" element={profile && <SecretAdmirerContainer profile={profile} />} />
                    <Route path="/thanks" element={profile && <ThankYouCardsContainer profile={profile} />} />
                    <Route path="/professors" element={<ProfessorWall onAddShoutout={(name, dept, text, anon) => console.log('Prof shoutout:', name, dept, text, anon)} entries={[]} />} />
                    <Route path="/unsent" element={<UnsentMessage onAddMessage={(target, text) => console.log('Unsent:', target, text)} users={[]} entries={[]} />} />
                    <Route path="/impact" element={<WhoMadeYouBetter onAddBetter={(target) => console.log('Better:', target)} users={[]} entries={[]} />} />
                    <Route path="/4am" element={<The4AMList onAddNomination={(target) => console.log('4AM:', target)} users={[]} entries={[]} />} />
                    <Route path="/trivia" element={<BatchTrivia users={[]} />} />
                    <Route path="/constellation" element={<BatchConstellation users={[]} connections={[]} />} />
                    <Route path="/inheritance" element={<TheInheritance onAddTip={(text, cat) => console.log('Inheritance:', text, cat)} entries={[]} />} />
                    <Route path="/bucketlist" element={<CollegeBucketList onAddEntry={(text) => console.log('Bucket list:', text)} entries={[]} />} />
                    <Route path="/map" element={profile && <TheLastDayMapContainer profile={profile} />} />
                    <Route path="/anthem" element={<BatchAnthemVote onNominate={(title, artist) => console.log('Anthem nominate:', title, artist)} onVote={(id) => console.log('Anthem vote:', id)} entries={[]} />} />
                    <Route path="/ritual" element={<GoodbyeRitual onComplete={() => console.log('Ritual complete')} />} />
                    <Route path="/witness" element={<TheWitness onAddPromise={(text, witnesses, date) => console.log('Witness:', text, witnesses, date)} users={[]} entries={[]} />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

const FeaturesPage = () => {
  const navigate = useNavigate();
  const features = [
    { name: 'Mood Cloud', icon: Sparkles, path: '/mood', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Memory Jar', icon: History, path: '/memories', color: 'bg-blue-100 text-blue-600' },
    { name: 'Confessions', icon: MessageCircle, path: '/confessions', color: 'bg-red-100 text-red-600' },
    { name: 'Superlatives', icon: Sparkles, path: '/superlatives', color: 'bg-purple-100 text-purple-600' },
    { name: 'Photo Wall', icon: Camera, path: '/photos', color: 'bg-green-100 text-green-600' },
    { name: 'Time Capsule', icon: History, path: '/capsule', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Predictions', icon: Sparkles, path: '/predictions', color: 'bg-orange-100 text-orange-600' },
    { name: 'Secret Admirer', icon: MessageCircle, path: '/secret', color: 'bg-pink-100 text-pink-600' },
    { name: 'Thank You Cards', icon: MessageCircle, path: '/thanks', color: 'bg-teal-100 text-teal-600' },
    { name: 'Professor Wall', icon: Users, path: '/professors', color: 'bg-slate-100 text-slate-600' },
    { name: 'Unsent Messages', icon: MessageCircle, path: '/unsent', color: 'bg-gray-100 text-gray-600' },
    { name: 'Who Made You Better', icon: Users, path: '/impact', color: 'bg-cyan-100 text-cyan-600' },
    { name: '4AM List', icon: Users, path: '/4am', color: 'bg-violet-100 text-violet-600' },
    { name: 'Batch Trivia', icon: Sparkles, path: '/trivia', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Constellation', icon: Users, path: '/constellation', color: 'bg-sky-100 text-sky-600' },
    { name: 'The Inheritance', icon: MessageCircle, path: '/inheritance', color: 'bg-amber-100 text-amber-600' },
    { name: 'Bucket List', icon: History, path: '/bucketlist', color: 'bg-lime-100 text-lime-600' },
    { name: 'Campus Map', icon: Camera, path: '/map', color: 'bg-rose-100 text-rose-600' },
    { name: 'Batch Anthem', icon: Sparkles, path: '/anthem', color: 'bg-fuchsia-100 text-fuchsia-600' },
    { name: 'Goodbye Ritual', icon: Sparkles, path: '/ritual', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'The Witness', icon: Users, path: '/witness', color: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Interactive Features</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {features.map((f) => (
          <div key={f.name} className="cursor-pointer transition-all hover:shadow-md" onClick={() => navigate(f.path)}>
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className={`rounded-2xl p-3 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-slate-700">{f.name}</span>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const WallPage = ({ profile }: { profile: UserProfile }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('college', '==', profile.college),
      where('graduationYear', '==', profile.graduationYear)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });
    return () => unsubscribe();
  }, [profile]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Batch Wall</h1>
      {loading ? <Loading /> : <BatchWallGrid users={users} onUserClick={(u) => navigate(`/profile/${u.uid}`)} />}
    </div>
  );
};
const ProfileViewer = () => {
  const { uid } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const fetchProfile = async () => {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [uid]);

  if (loading) return <Loading />;
  if (!profile) return <EmptyState icon={UserIcon} title="Profile not found" description="This user hasn't set up their profile yet." />;

  return <ProfilePage profile={profile} isOwn={auth.currentUser?.uid === uid} />;
};
