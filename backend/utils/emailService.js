import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Transporter
// Ideally use environment variables: EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'mock_user',
        pass: process.env.EMAIL_PASS || 'mock_pass'
    }
});

export const sendEmail = async (to, subject, html) => {
    // If no real credentials, just log
    if (!process.env.EMAIL_USER) {
        console.log("======================================");
        console.log(`[MOCK EMAIL] To: ${to}`);
        console.log(`[MOCK EMAIL] Subject: ${subject}`);
        console.log(`[MOCK EMAIL] Body: ${html}`);
        console.log("======================================");
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendBookingConfirmation = async (user, booking, venue) => {
    const subject = `Booking Confirmation - ${venue.name}`;
    const html = `
        <h1>Booking Confirmed!</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for booking with <strong>${venue.name}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toDateString()}</p>
        <p><strong>Guests:</strong> ${booking.guestCount}</p>
        <p><strong>Total Price:</strong> Rs. ${booking.totalPrice}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        <p>We look forward to hosting your event!</p>
    `;
    await sendEmail(user.email, subject, html);
};

export const sendBookingStatusUpdate = async (user, booking, venue) => {
    const subject = `Booking Update - ${venue.name}`;
    const html = `
        <h1>Booking Status Updated</h1>
        <p>Dear ${user.name},</p>
        <p>The status of your booking at <strong>${venue.name}</strong> has been updated.</p>
        <p><strong>New Status:</strong> ${booking.status.toUpperCase()}</p>
        <p>Please login to your dashboard for more details.</p>
    `;
    await sendEmail(user.email, subject, html);
};
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    const subject = `Password Reset Request`;
    const html = `
        <h1>Password Reset</h1>
        <p>Dear ${name},</p>
        <p>You requested a password reset for your Banquet Booking System account.</p>
        <p>Please click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;
    await sendEmail(email, subject, html);
};

import { generateReceiptHtml } from './receiptService.js';

export const sendPaymentNotification = async (user, booking, venue, payment) => {
    const subject = `Payment Successful - Receipt for ${venue.name}`;
    const receiptHtml = generateReceiptHtml(user, booking, venue, payment);

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #2e7d32;">Payment Received!</h1>
            <p>Dear ${user.name},</p>
            <p>We have successfully received your payment for your booking at <strong>${venue.name}</strong>.</p>
            <p>Attached below is your digital receipt. You can also view your booking details in your dashboard.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            ${receiptHtml}
            <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                <h3 style="margin-top: 0;">Next Steps</h3>
                <ul>
                    <li>Your booking is now confirmed.</li>
                    <li>If you paid a deposit, the remaining balance is due at the venue on the day of the event.</li>
                    <li>Please bring a copy of this receipt (digital or printed) to the venue.</li>
                </ul>
            </div>
        </div>
    `;
    await sendEmail(user.email, subject, html);
};
