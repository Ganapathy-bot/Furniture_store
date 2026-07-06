import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { IOrder } from '../models/Order';
import { CURRENCY } from '@furnistore/shared';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
});

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyUrl = `${env.clientUrl}/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to: email,
      subject: 'Verify your FurniStore account',
      html: `
        <h2>Welcome to FurniStore</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
    logger.info('Verification email sent', { email });
  } catch (error) {
    logger.warn('Failed to send verification email', { email, error });
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to: email,
      subject: 'Reset your FurniStore password',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
      `,
    });
    logger.info('Password reset email sent', { email });
  } catch (error) {
    logger.warn('Failed to send password reset email', { email, error });
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  order: IOrder
): Promise<void> {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.name} x ${item.quantity} - ${CURRENCY} ${(item.price * item.quantity).toLocaleString('en-IN')}</li>`
    )
    .join('');

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to: email,
      subject: `Order Confirmed - FurniStore #${order._id.toString().slice(-8)}`,
      html: `
        <h2>Thank you for your order, ${name}!</h2>
        <p>Your payment has been received. Order ID: <strong>${order._id}</strong></p>
        <h3>Items</h3>
        <ul>${itemsHtml}</ul>
        <p>Subtotal: ${CURRENCY} ${order.subtotal.toLocaleString('en-IN')}</p>
        <p>Shipping: ${order.shippingCost === 0 ? 'Free' : `${CURRENCY} ${order.shippingCost}`}</p>
        <p><strong>Total: ${CURRENCY} ${order.total.toLocaleString('en-IN')}</strong></p>
        <h3>Shipping to</h3>
        <p>
          ${order.shippingAddress.name}<br/>
          ${order.shippingAddress.line1}<br/>
          ${order.shippingAddress.line2 ? order.shippingAddress.line2 + '<br/>' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pinCode}<br/>
          Phone: ${order.shippingAddress.phone}
        </p>
      `,
    });
    logger.info('Order confirmation email sent', { email, orderId: order._id });
  } catch (error) {
    logger.warn('Failed to send order confirmation email', { email, error });
  }
}
