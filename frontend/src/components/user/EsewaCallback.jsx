import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api';

function EsewaSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        verifyPayment();
    }, []);

    const verifyPayment = async () => {
        try {
            const oid = searchParams.get('oid');
            const amt = searchParams.get('amt');
            const refId = searchParams.get('refId');

            if (!oid || !amt || !refId) {
                setError('Invalid payment parameters');
                setVerifying(false);
                return;
            }

            const res = await api.post('/payments/esewa/verify', {
                oid,
                amt,
                refId
            });

            if (res.data.success) {
                setTimeout(() => {
                    navigate('/bookings', { 
                        state: { message: 'Payment successful! Your booking is confirmed.' } 
                    });
                }, 2000);
            } else {
                setError('Payment verification failed');
                setVerifying(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Payment verification failed');
            setVerifying(false);
        }
    };

    if (verifying) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.spinner}></div>
                    <h2>Verifying Payment...</h2>
                    <p>Please wait while we confirm your payment with eSewa.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.errorIcon}>❌</div>
                    <h2>Payment Failed</h2>
                    <p>{error}</p>
                    <button 
                        style={styles.button}
                        onClick={() => navigate('/bookings')}
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.successIcon}>✅</div>
                <h2>Payment Successful!</h2>
                <p>Redirecting to your bookings...</p>
            </div>
        </div>
    );
}

function EsewaFailure() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.errorIcon}>❌</div>
                <h2>Payment Failed</h2>
                <p>Your payment was not completed. Please try again.</p>
                <button 
                    style={styles.button}
                    onClick={() => navigate('/bookings')}
                >
                    Back to Bookings
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
    },
    card: {
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
    },
    successIcon: {
        fontSize: '4rem',
        marginBottom: '1rem'
    },
    errorIcon: {
        fontSize: '4rem',
        marginBottom: '1rem'
    },
    button: {
        marginTop: '2rem',
        padding: '0.75rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: '600'
    }
};

export { EsewaSuccess, EsewaFailure };
