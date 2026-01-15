import React from 'react';
import './Toast.css';

const Toast = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <div className="toast-content">
                        <span className="toast-icon">
                            {toast.type === 'success' && '✅'}
                            {toast.type === 'error' && '❌'}
                            {toast.type === 'info' && 'ℹ️'}
                            {toast.type === 'warning' && '⚠️'}
                        </span>
                        <p className="toast-message">{toast.message}</p>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        &times;
                    </button>
                    <div className="toast-progress" style={{ animationDuration: `${toast.duration}ms` }}></div>
                </div>
            ))}
        </div>
    );
};

export default Toast;
