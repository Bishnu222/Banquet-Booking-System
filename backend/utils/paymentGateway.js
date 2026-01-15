import axios from 'axios';
import crypto from 'crypto';

// eSewa Payment Gateway Integration
export class EsewaPayment {
    constructor() {
        this.merchantId = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
        this.secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
        this.paymentUrl = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
        this.verifyUrl = 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';
    }

    // Generate payment signature
    generateSignature(totalAmount, transactionUuid, productCode) {
        const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const hash = crypto.createHmac('sha256', this.secretKey).update(message).digest('base64');
        return hash;
    }

    // Initiate payment
    initiatePayment(paymentData) {
        const { amount, transactionId, productServiceCharge = 0, productDeliveryCharge = 0, taxAmount = 0 } = paymentData;

        const totalAmount = amount + productServiceCharge + productDeliveryCharge + taxAmount;

        // Generate signature for V2
        const signature = this.generateSignature(totalAmount, transactionId, this.merchantId);

        return {
            paymentUrl: this.paymentUrl,
            params: {
                amount: amount,
                failure_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/esewa/failure`,
                product_delivery_charge: productDeliveryCharge,
                product_service_charge: productServiceCharge,
                product_code: this.merchantId,
                signature: signature,
                signed_field_names: 'total_amount,transaction_uuid,product_code',
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/esewa/success`,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                transaction_uuid: transactionId
            }
        };
    }

    // Verify payment
    async verifyPayment(queryParams) {
        try {
            // eSewa V2 status check
            const { oid, amt, refId } = queryParams;

            if (!oid || !amt) {
                return { success: false, message: 'Missing transaction details for verification' };
            }

            // Note: In V2, we might not need to regenerate signature for the REQUEST if using the status API?
            // Usually status API requires all fields including signature. Let's try standard V2 status check pattern.
            // Using the documentation pattern: url?product_code=...&total_amount=...&transaction_uuid=...&signature=...

            const signature = this.generateSignature(amt, oid, this.merchantId);

            const verifyParams = new URLSearchParams({
                product_code: this.merchantId,
                total_amount: amt,
                transaction_uuid: oid,
                signature: signature
            });

            const response = await axios.get(`${this.verifyUrl}?${verifyParams.toString()}`);

            // eSewa V2 Status API response is JSON
            // { "status": "COMPLETE", "ref_id": "...", "amount": ..., ... }
            if (response.data && response.data.status === 'COMPLETE') {
                return {
                    success: true,
                    transactionId: oid,
                    referenceId: response.data.ref_id,
                    amount: response.data.total_amount
                };
            }

            return { success: false, message: 'Payment status is not COMPLETE' };
        } catch (error) {
            console.error('eSewa verification error:', error);
            return { success: false, message: error.message };
        }
    }
}

// Khalti Payment Gateway Integration
export class KhaltiPayment {
    constructor() {
        this.publicKey = process.env.KHALTI_PUBLIC_KEY || 'test_public_key';
        this.secretKey = process.env.KHALTI_SECRET_KEY || 'test_secret_key';
        this.apiUrl = process.env.KHALTI_API_URL || 'https://khalti.com/api/v2';
    }

    // Initiate payment
    initiatePayment(paymentData) {
        const { amount, transactionId, productName, productIdentity } = paymentData;

        return {
            publicKey: this.publicKey,
            amount: amount * 100, // Khalti accepts amount in paisa (1 Rs = 100 paisa)
            productIdentity: productIdentity || transactionId,
            productName: productName || 'Banquet Hall Booking',
            productUrl: process.env.FRONTEND_URL || 'http://localhost:8080'
        };
    }

    // Verify payment
    async verifyPayment(token, amount) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payment/verify/`,
                {
                    token: token,
                    amount: amount
                },
                {
                    headers: {
                        'Authorization': `Key ${this.secretKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.idx) {
                return {
                    success: true,
                    transactionId: response.data.idx,
                    amount: response.data.amount / 100, // Convert back to rupees
                    mobile: response.data.mobile,
                    data: response.data
                };
            }

            return { success: false, message: 'Payment verification failed' };
        } catch (error) {
            console.error('Khalti verification error:', error);
            return { success: false, message: error.message };
        }
    }
}

// Card Payment (Simulated)
export class CardPayment {
    // Validate card number using Luhn algorithm
    validateCardNumber(cardNumber) {
        const digits = cardNumber.replace(/\s/g, '');
        let sum = 0;
        let isEven = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    // Detect card type
    detectCardType(cardNumber) {
        const digits = cardNumber.replace(/\s/g, '');

        if (/^4/.test(digits)) return 'Visa';
        if (/^5[1-5]/.test(digits)) return 'Mastercard';
        if (/^3[47]/.test(digits)) return 'American Express';
        if (/^6(?:011|5)/.test(digits)) return 'Discover';

        return 'Unknown';
    }

    // Process card payment (simulated)
    async processPayment(cardDetails, amount) {
        // In production, integrate with real payment processor like Stripe, Paystack, etc.
        const { cardNumber, cardHolderName, expiryDate, cvv } = cardDetails;

        // Validate card
        if (!this.validateCardNumber(cardNumber)) {
            return { success: false, message: 'Invalid card number' };
        }

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate 90% success rate
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            return {
                success: true,
                transactionId: `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                cardType: this.detectCardType(cardNumber),
                last4Digits: cardNumber.slice(-4),
                amount: amount
            };
        } else {
            return {
                success: false,
                message: 'Payment declined by card issuer'
            };
        }
    }
}
