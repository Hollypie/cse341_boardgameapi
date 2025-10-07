const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  proxy: true,
});

console.log('📦 Session Config:', {
  hasSecret: !!process.env.SESSION_SECRET,
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieSameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  proxy: true,
});

module.exports = sessionConfig;
