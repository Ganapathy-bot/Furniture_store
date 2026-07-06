import { Request, Response } from 'express';
import { ROLES } from '@furnistore/shared';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

type AuthHandler = (req: Request, res: Response) => Promise<void>;
import { AppError } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/apiResponse';
import { hashPassword, comparePassword, hashToken, generateToken } from '../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
import { env } from '../config/env';

function toPublicUser(user: InstanceType<typeof User>) {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

async function issueTokens(user: InstanceType<typeof User>) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  return { accessToken, refreshToken, user: toPublicUser(user) };
}

export const register: AuthHandler = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists');
  }

  const verificationToken = generateToken();
  const autoVerify = env.autoVerifyEmail;

  const user = await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: ROLES.USER,
    isVerified: autoVerify,
    emailVerificationToken: autoVerify ? undefined : hashToken(verificationToken),
    emailVerificationExpires: autoVerify ? undefined : new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  if (!autoVerify) {
    await sendVerificationEmail(email, verificationToken);
  }

  const tokens = await issueTokens(user);

  sendSuccess(
    res,
    tokens,
    201,
    autoVerify
      ? 'Account created successfully'
      : 'Account created. Please check your email to verify your account.'
  );
};

export const login: AuthHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash +refreshTokenHash');
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new AppError(403, 'ACCOUNT_DISABLED', 'Your account has been disabled');
  }

  if (!user.isVerified && !env.autoVerifyEmail) {
    throw new AppError(403, 'EMAIL_NOT_VERIFIED', 'Please verify your email before logging in');
  }

  const tokens = await issueTokens(user);
  sendSuccess(res, tokens, 200, 'Login successful');
};

export const refresh: AuthHandler = async (req, res) => {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
  }

  const user = await User.findById(payload.userId).select('+refreshTokenHash');
  if (!user || !user.isActive) {
    throw new AppError(401, 'INVALID_TOKEN', 'Invalid refresh token');
  }

  if (user.refreshTokenHash !== hashToken(refreshToken)) {
    throw new AppError(401, 'INVALID_TOKEN', 'Refresh token has been revoked');
  }

  const tokens = await issueTokens(user);
  sendSuccess(res, tokens, 200, 'Token refreshed');
};

export const logout: AuthHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  if (authReq.user) {
    await User.findByIdAndUpdate(authReq.user.userId, { $unset: { refreshTokenHash: 1 } });
  }
  sendSuccess(res, null, 200, 'Logged out successfully');
};

export const me: AuthHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const user = await User.findById(authReq.user!.userId);
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }
  sendSuccess(res, toPublicUser(user));
};

export const verifyEmail: AuthHandler = async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({
    emailVerificationToken: hashToken(token),
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new AppError(400, 'INVALID_TOKEN', 'Invalid or expired verification token');
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  sendSuccess(res, { verified: true }, 200, 'Email verified successfully');
};

export const forgotPassword: AuthHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const resetToken = generateToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(email, resetToken);
  }

  sendSuccess(res, null, 200, 'If that email exists, a reset link has been sent');
};

export const resetPassword: AuthHandler = async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires +passwordHash');

  if (!user) {
    throw new AppError(400, 'INVALID_TOKEN', 'Invalid or expired reset token');
  }

  user.passwordHash = await hashPassword(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokenHash = undefined;
  await user.save();

  sendSuccess(res, null, 200, 'Password reset successfully');
};