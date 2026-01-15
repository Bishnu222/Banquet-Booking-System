import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import './PaymentPage.css';

function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [error, setError] = useState('');

    // Manual Payment State
    const [isManual, setIsManual] = useState(false);
    const [manualForm, setManualForm] = useState({
        senderId: '',
        transactionCode: '',
        remarks: ''
    });

    // Card details
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);

    // Agreed to terms check
    const [agreed, setAgreed] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            if (location.state?.booking) {
                setBooking(location.state.booking);
                setLoading(false);
            } else {
                const res = await api.get(`/bookings/my`);
                const foundBooking = res.data.find(b => b._id === bookingId);
                if (foundBooking) {
                    setBooking(foundBooking);
                } else {
                    setError('Booking not found');
                }
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load booking details');
            setLoading(false);
        }
    };

    const handleManualChange = (e) => {
        setManualForm({ ...manualForm, [e.target.name]: e.target.value });
    };

    const handleManualSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validation
        if (!manualForm.senderId || !manualForm.transactionCode) {
            setError('Please fill in all required fields (Sender ID and Transaction Code).');
            // access toast if available, or just set error
            // Assuming addToast is available from context based on previous view
            if (typeof addToast === 'function') {
                addToast('Please fill in all required fields.', 'error');
            }
            return;
        }

        setProcessing(true);
        setError('');

        try {
            const methodKey = selectedMethod === 'esewa' ? 'esewa_manual' : 'khalti_manual';
            const depositAmount = booking ? Math.round(booking.totalPrice * 0.3) : 0;

            const res = await api.post('/payments/manual-report', {
                bookingId,
                paymentMethod: methodKey,
                amount: depositAmount,
                senderId: manualForm.senderId,
                transactionCode: manualForm.transactionCode,
                remarks: manualForm.remarks
            });

            if (res.data.success) {
                setTransactionDetails(res.data.payment);
                setPaymentSuccess(true);
                addToast('Payment reported successfully! Pending verification.', 'success');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to report payment.');
        } finally {
            setProcessing(false);
        }
    };

    // ... (Existing formatting Helpers) ...
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) parts.push(match.substring(i, i + 4));
        return parts.length ? parts.join(' ') : value;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.replace(/\s/g, '').length <= 16) setCardNumber(formatted);
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
        return v;
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiryDate(e.target.value);
        if (formatted.replace(/\//g, '').length <= 4) setExpiryDate(formatted);
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/gi, '');
        if (value.length <= 4) setCvv(value);
    };

    // ... (Existing Logic for Automatic Gateway) ...
    const initiatePayment = async () => {
        try {
            setProcessing(true);
            setError('');

            const res = await api.post('/payments/initiate', {
                bookingId: bookingId,
                paymentMethod: selectedMethod
            });

            const { payment, gatewayData } = res.data;

            switch (selectedMethod) {
                case 'card':
                    await processCardPayment(payment.transactionId);
                    break;
                case 'esewa':
                    initiateEsewaPayment(gatewayData);
                    break;
                case 'khalti':
                    initiateKhaltiPayment(gatewayData);
                    break;
                case 'cash':
                    setTransactionDetails(payment);
                    setPaymentSuccess(true);
                    setProcessing(false);
                    break;
                default:
                    setError('Invalid payment method');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Payment initiation failed');
            setProcessing(false);
        }
    };

    const processCardPayment = async (transactionId) => {
        try {
            if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
                setError('Please fill all card details');
                setProcessing(false);
                return;
            }
            const cardDetailsObj = {
                cardNumber: cardNumber.replace(/\s/g, ''),
                cardHolderName: cardHolder,
                expiryDate: expiryDate,
                cvv: cvv
            };
            const res = await api.post('/payments/card/process', {
                transactionId: transactionId,
                cardDetails: cardDetailsObj
            });
            if (res.data.success) {
                setTransactionDetails(res.data.payment);
                setPaymentSuccess(true);
                setProcessing(false);
            } else {
                setError(res.data.message || 'Payment failed');
                setProcessing(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Card payment failed');
            setProcessing(false);
        }
    };

    const initiateEsewaPayment = (gatewayData) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = gatewayData.paymentUrl;
        Object.keys(gatewayData.params).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = gatewayData.params[key];
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
    };

    const initiateKhaltiPayment = (gatewayData) => {
        const config = {
            publicKey: gatewayData.publicKey,
            productIdentity: gatewayData.productIdentity,
            productName: gatewayData.productName,
            productUrl: gatewayData.productUrl,
            eventHandler: {
                onSuccess(payload) {
                    verifyKhaltiPayment(payload.token, payload.amount, gatewayData.productIdentity);
                },
                onError(error) {
                    console.error(error);
                    setError('Khalti payment failed');
                    setProcessing(false);
                },
                onClose() {
                    setProcessing(false);
                }
            },
            paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"]
        };
        const checkout = new window.KhaltiCheckout(config);
        checkout.show({ amount: gatewayData.amount });
    };

    const verifyKhaltiPayment = async (token, amount, transactionId) => {
        try {
            const res = await api.post('/payments/khalti/verify', {
                token: token,
                amount: amount,
                transactionId: transactionId
            });
            if (res.data.success) {
                setTransactionDetails(res.data.payment);
                setPaymentSuccess(true);
                setProcessing(false);
            } else {
                setError('Payment verification failed');
                setProcessing(false);
            }
        } catch (err) {
            console.error(err);
            setError('Payment verification failed');
            setProcessing(false);
        }
    };

    // Helper: Navigation & Printing
    const navigateBack = () => {
        navigate(`/venues/${booking.venue?._id}`);
    };
    const handlePrintReceipt = () => window.print();

    // Calculations
    const depositAmount = booking ? Math.round(booking.totalPrice * 0.3) : 0;
    const remainingAmount = booking ? booking.totalPrice - depositAmount : 0;

    if (loading) return <div className="payment-loading">Loading payment details...</div>;
    if (!booking) return <div className="payment-error">{error || 'Booking not found'}</div>;

    if (paymentSuccess) {
        return (
            <div className="payment-success-container">
                <div className="success-badge-large">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2>Payment Successful!</h2>
                <p className="success-msg">Your booking at <strong>{booking.venue?.name}</strong> has been confirmed.</p>
                <div className="receipt-box" id="printable-receipt">
                    <div className="receipt-header">
                        <h3>Payment Receipt</h3>
                        <p className="txn-id">Transaction ID: {transactionDetails?.transactionId}</p>
                    </div>
                    <div className="receipt-body">
                        <div className="receipt-row">
                            <span>Amount Paid</span>
                            <span>NPR {transactionDetails?.amount?.toLocaleString()}</span>
                        </div>
                        <div className="receipt-row">
                            <span>Amount Remaining</span>
                            <span>NPR {(booking.totalPrice - (transactionDetails?.amount || 0)).toLocaleString()}</span>
                        </div>
                        <div className="receipt-row">
                            <span>Payment Method</span>
                            <span className="capitalize">
                                {transactionDetails?.paymentMethod?.includes('esewa') ? 'eSewa' :
                                    transactionDetails?.paymentMethod?.includes('khalti') ? 'Khalti' :
                                        transactionDetails?.paymentMethod}
                            </span>
                        </div>
                        <div className="receipt-row">
                            <span>Date</span>
                            <span>{new Date().toLocaleString()}</span>
                        </div>
                        <div className="receipt-divider"></div>
                        <div className="receipt-row">
                            <span>Venue</span>
                            <span>{booking.venue?.name}</span>
                        </div>
                    </div>
                    <div className="receipt-footer">
                        <p>A confirmation email has been sent to {booking.user?.email}</p>
                    </div>
                </div>
                <div className="success-actions">
                    <button className="print-btn" onClick={handlePrintReceipt}>Print Receipt</button>
                    <button className="dashboard-btn" onClick={() => navigate('/bookings')}>Go to My Bookings</button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page-v2">
            <div className="payment-top-bar">
                <div className="top-bar-container">
                    <button className="back-link" onClick={navigateBack}>
                        <span className="arrow">←</span> Back to Booking
                    </button>
                    <div className="secure-badge">Secure Payment</div>
                </div>
            </div>

            <main className="payment-main">
                <div className="payment-hero">
                    <h1>Complete Your Booking</h1>
                    <p>Secure payment powered by Industry-leading encryption</p>
                </div>

                <div className="payment-layout-grid">
                    <div className="payment-methods-card">
                        <section className="method-selection">
                            <h3>Select payment method</h3>
                            <div className="method-grid-3">
                                <button
                                    className={`method-option-btn card ${selectedMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => { setSelectedMethod('card'); setIsManual(false); }}
                                >
                                    <span>Credit/Debit card</span>
                                </button>
                                <button
                                    className={`method-option-btn esewa ${selectedMethod === 'esewa' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('esewa')}
                                >
                                    <span>eSewa</span>
                                </button>
                                <button
                                    className={`method-option-btn khalti ${selectedMethod === 'khalti' ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod('khalti')}
                                >
                                    <span>Khalti</span>
                                </button>
                            </div>
                        </section>

                        <div className="method-specific-content">
                            {selectedMethod === 'card' && (
                                <div className="card-fields">
                                    {/* Simplified Card fields for brevity */}
                                    <h4>Card Details</h4>
                                    <div className="form-group-v2">
                                        <label>Card Number</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumberChange} />
                                    </div>
                                    <div className="form-group-v2"><label>Name</label><input type="text" value={cardHolder} onChange={e => setCardHolder(e.target.value)} /></div>
                                    <div className="form-row-2">
                                        <div className="form-group-v2"><label>Expiry</label><input type="text" placeholder="MM/YY" value={expiryDate} onChange={handleExpiryChange} /></div>
                                        <div className="form-group-v2"><label>CVV</label><input type="text" value={cvv} onChange={handleCvvChange} /></div>
                                    </div>
                                </div>
                            )}

                            {(selectedMethod === 'esewa' || selectedMethod === 'khalti') && (
                                <div className="gateway-payment-container">
                                    <div className="toggle-manual-container" style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={isManual}
                                                onChange={(e) => setIsManual(e.target.checked)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                        <span className="toggle-label" style={{ fontWeight: 500 }}>
                                            {isManual ? `Manual ${selectedMethod === 'esewa' ? 'eSewa' : 'Khalti'} Transfer` : `Pay via ${selectedMethod === 'esewa' ? 'eSewa' : 'Khalti'} Gateway`}
                                        </span>
                                    </div>

                                    {!isManual ? (
                                        <div className="automatic-gateway-view">
                                            <p>You will be redirected to {selectedMethod === 'esewa' ? 'eSewa' : 'Khalti'} to complete your payment securely.</p>
                                        </div>
                                    ) : (
                                        <form className="manual-payment-form" onSubmit={handleManualSubmit} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                                            <div className="manual-form-header" style={{ textAlign: 'center', marginBottom: '15px' }}>
                                                <img
                                                    src={`/assets/${selectedMethod === 'esewa' ? 'esewa-logo.svg' : 'khalti-logo.svg'}`}
                                                    alt={`${selectedMethod} Logo`}
                                                    style={{ height: '40px', marginBottom: '10px' }}
                                                />
                                                <h4 style={{ margin: '0', color: '#2c3e50' }}>Manual Transfer Report</h4>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px', textAlign: 'center' }}>
                                                Please transfer <strong>NPR {depositAmount.toLocaleString()}</strong> to our {selectedMethod === 'esewa' ? 'eSewa' : 'Khalti'} ID manually from your app.
                                            </p>
                                            <div className="merchant-info-box" style={{ background: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '15px', borderLeft: '4px solid #4caf50' }}>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#2e7d32' }}>Our {selectedMethod === 'esewa' ? 'eSewa' : 'Khalti'} ID:</span>
                                                <strong style={{ fontSize: '1.1rem', color: '#1b5e20' }}>9806800001</strong>
                                            </div>

                                            <div className="form-group-v2">
                                                <label>Amount Paid (NPR)</label>
                                                <input
                                                    type="text"
                                                    value={depositAmount.toLocaleString()}
                                                    readOnly
                                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f5f5f5', color: '#555', cursor: 'not-allowed' }}
                                                />
                                            </div>

                                            <div className="form-group-v2">
                                                <label>Your {selectedMethod === 'esewa' ? 'eSewa' : 'Khalti'} ID / Mobile</label>
                                                <input
                                                    type="text"
                                                    name="senderId"
                                                    value={manualForm.senderId}
                                                    onChange={handleManualChange}
                                                    required
                                                    placeholder="e.g. 98XXXXXXXX"
                                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                                />
                                            </div>

                                            <div className="form-group-v2">
                                                <label>Transaction Code / Ref ID</label>
                                                <input
                                                    type="text"
                                                    name="transactionCode"
                                                    value={manualForm.transactionCode}
                                                    onChange={handleManualChange}
                                                    required
                                                    placeholder="e.g. TXN-12345"
                                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                                />
                                            </div>

                                            <div className="form-group-v2">
                                                <label>Remarks (Optional)</label>
                                                <input
                                                    type="text"
                                                    name="remarks"
                                                    value={manualForm.remarks}
                                                    onChange={handleManualChange}
                                                    placeholder="Any additional info..."
                                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                                />
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Shared Terms & Button Section used for both Gateway and Manual */}
                            <div className="terms-condition-section">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                                    <span className="custom-checkbox"></span>
                                    <span>I agree to the terms. 30% deposit required.</span>
                                </label>
                            </div>

                            <button
                                className="pay-deposit-btn"
                                disabled={!agreed || processing}
                                onClick={isManual ? handleManualSubmit : initiatePayment}
                                style={{ width: '100%', padding: '12px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', marginTop: '15px', cursor: 'pointer', opacity: (!agreed || processing) ? 0.7 : 1 }}
                            >
                                {processing ? 'Processing...' : (isManual ? 'Submit Payment Details' : `Pay Deposit NPR ${depositAmount.toLocaleString()}`)}
                            </button>
                        </div>
                    </div>

                    <aside className="payment-sidebar">
                        <section className="sidebar-card booking-summary">
                            <h3>Booking Summary</h3>
                            <h4 className="venue-name">{booking.venue?.name}</h4>
                            <div className="booking-details-list">
                                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                                <p>Guests: {booking.guestCount}</p>
                            </div>

                            <div className="summary-rows" style={{ marginTop: '20px' }}>
                                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span>Total</span>
                                    <span>NPR {booking.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="summary-row deposit" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>Deposit (30%)</span>
                                    <span>NPR {depositAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default PaymentPage;
