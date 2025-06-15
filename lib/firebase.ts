import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Realtime DB

import fbconfig from '../fbconfig'; // adjust path if needed

// Prevent re-initializing Firebase during hot reloads
const app = !getApps().length ? initializeApp(fbconfig) : getApp();

// Firebase services
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };