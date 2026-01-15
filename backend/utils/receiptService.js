/**
 * Receipt Generation Service
 * Generates HTML/Text based receipts for bookings
 */

export const generateReceiptHtml = (user, booking, venue, payment) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">
                <h1 style="margin: 0;">RECEIPT</h1>
                <p style="color: #666;">${venue.name}</p>
            </div>
            
            <div style="margin: 20px 0;">
                <table style="width: 100%;">
                    <tr>
                        <td><strong>Transaction ID:</strong></td>
                        <td style="text-align: right;">${payment.transactionId}</td>
                    </tr>
                    <tr>
                        <td><strong>Date:</strong></td>
                        <td style="text-align: right;">${new Date(payment.completedAt || payment.createdAt).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Method:</strong></td>
                        <td style="text-align: right;">${payment.paymentMethod.toUpperCase()}</td>
                    </tr>
                </table>
            </div>

            <div style="margin: 20px 0; border-top: 1px solid #eee; padding-top: 10px;">
                <h3 style="margin-top: 0;">Customer Details</h3>
                <p style="margin: 5px 0;">${user.name}</p>
                <p style="margin: 5px 0;">${user.email}</p>
                <p style="margin: 5px 0;">${user.phone || ''}</p>
            </div>

            <div style="margin: 20px 0; border-top: 1px solid #eee; padding-top: 10px;">
                <h3 style="margin-top: 0;">Booking Details</h3>
                <p style="margin: 5px 0;"><strong>Venue:</strong> ${venue.name}</p>
                <p style="margin: 5px 0;"><strong>Event Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                <p style="margin: 5px 0;"><strong>Event Type:</strong> ${booking.eventType || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guestCount}</p>
            </div>

            <div style="margin: 20px 0; border-top: 2px solid #333; padding-top: 10px;">
                <table style="width: 100%; font-size: 1.2em;">
                    <tr>
                        <td><strong>Amount Paid:</strong></td>
                        <td style="text-align: right;"><strong>NPR ${payment.amount.toLocaleString()}</strong></td>
                    </tr>
                </table>
                <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                    * This is a digital receipt for your partial/full payment. Remaining balance (if any) is due at the venue.
                </p>
            </div>

            <div style="text-align: center; color: #999; font-size: 0.8em; margin-top: 30px;">
                <p>Thank you for choosing ${venue.name}!</p>
                <p>Powered by Banquet Booking System</p>
            </div>
        </div>
    `;
};
