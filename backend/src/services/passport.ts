import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ENVIRONMENT, TOKEN_CONFIG, USER_ROLES } from '../constants';

const prisma = new PrismaClient();

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENVIRONMENT.JWT_SECRET || TOKEN_CONFIG.SECRET,
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
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(passwordInput, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Remove password from user object
        const userWithoutPassword = { ...user };
        delete (userWithoutPassword as any).password;
        return done(null, userWithoutPassword);
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
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (user && user.isActive) {
        const userWithoutPassword = { ...user };
        delete (userWithoutPassword as any).password;
        return done(null, userWithoutPassword);
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
          let user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value || '' },
          });

          if (!user) {
            // Create new user from Google profile
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || '',
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                password: '', // OAuth users won't use password login
                role: UserRole.NURSE, // Default role
                isActive: true,
              },
            });
          }

          const userWithoutPassword = { ...user };
          delete (userWithoutPassword as { password?: string }).password;
          return done(null, userWithoutPassword);
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
          let user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value || '' },
          });

          if (!user) {
            // Create new user from Microsoft profile
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || '',
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                password: '', // OAuth users won't use password login
                role: UserRole.NURSE, // Default role
                isActive: true,
              },
            });
          }

          const userWithoutPassword = { ...user };
          delete (userWithoutPassword as { password?: string }).password;
          return done(null, userWithoutPassword);
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
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user && user.isActive) {
      const userWithoutPassword = { ...user };
      delete (userWithoutPassword as any).password;
      return done(null, userWithoutPassword);
    }

    return done(null, false);
  } catch (error) {
    return done(error);
  }
});

export default passport;
