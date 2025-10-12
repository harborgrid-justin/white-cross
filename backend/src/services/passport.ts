import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { User } from '../database/models';
import { UserRole } from '../database/types/enums';
import bcrypt from 'bcryptjs';
import { ENVIRONMENT, TOKEN_CONFIG, USER_ROLES } from '../constants';

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENVIRONMENT.JWT_SECRET || TOKEN_CONFIG.JWT_SECRET,
};

// Local Strategy for email/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, passwordInput, done) => {
      try {
        const user = await User.findOne({
          where: { email },
        });

        if (!user || !user.isActive) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValidPassword = await user.comparePassword(passwordInput);

        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Return user without sensitive data
        return done(null, user.toSafeObject());
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy for token-based authentication
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);

      if (user && user.isActive) {
        return done(null, user.toSafeObject());
      }

      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

// Google OAuth Strategy
if (ENVIRONMENT.GOOGLE_CLIENT_ID && ENVIRONMENT.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENVIRONMENT.GOOGLE_CLIENT_ID,
        clientSecret: ENVIRONMENT.GOOGLE_CLIENT_SECRET,
        callbackURL: `${ENVIRONMENT.BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
        try {
          let user = await User.findOne({
            where: { email: profile.emails?.[0]?.value || '' },
          });

          if (!user) {
            // Create new user from Google profile
            user = await User.create({
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              password: Math.random().toString(36).slice(-12), // Random password for OAuth users
              role: UserRole.NURSE, // Default role
              isActive: true,
            });
          }

          return done(null, user.toSafeObject());
        } catch (error) {
          return done(error as Error | null);
        }
      }
    )
  );
}

// Microsoft OAuth Strategy
if (ENVIRONMENT.MICROSOFT_CLIENT_ID && ENVIRONMENT.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: ENVIRONMENT.MICROSOFT_CLIENT_ID,
        clientSecret: ENVIRONMENT.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${ENVIRONMENT.BACKEND_URL}/api/auth/microsoft/callback`,
        scope: ['user.read'],
      },
      async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
        try {
          let user = await User.findOne({
            where: { email: profile.emails?.[0]?.value || '' },
          });

          if (!user) {
            // Create new user from Microsoft profile
            user = await User.create({
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              password: Math.random().toString(36).slice(-12), // Random password for OAuth users
              role: UserRole.NURSE, // Default role
              isActive: true,
            });
          }

          return done(null, user.toSafeObject());
        } catch (error) {
          return done(error as Error | null);
        }
      }
    )
  );
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, (user as { id: string }).id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);

    if (user && user.isActive) {
      return done(null, user.toSafeObject());
    }

    return done(null, false);
  } catch (error) {
    return done(error);
  }
});

export default passport;
