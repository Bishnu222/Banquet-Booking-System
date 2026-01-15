import React, { useState, useEffect } from 'react';
import api from '../../api';
import './AvailabilityCalendar.css';

const AvailabilityCalendar = ({ venueId }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
                const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

                const res = await api.get(`/bookings/range`, {
                    params: { venueId, start, end }
                });
                setBookings(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching range bookings:", err);
                setLoading(false);
            }
        };
        fetchBookings();
    }, [venueId, currentDate]);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isBooked = (day) => {
        return bookings.some(b => {
            const bDate = new Date(b.date);
            return bDate.getDate() === day &&
                bDate.getMonth() === currentDate.getMonth() &&
                bDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const renderDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

        // Fill empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day not-current"></div>);
        }

        // Fill actual days
        for (let d = 1; d <= totalDays; d++) {
            const booked = isBooked(d);
            days.push(
                <div
                    key={d}
                    className={`calendar-day ${isToday(d) ? 'today' : ''} ${booked ? 'booked' : ''}`}
                    title={booked ? 'Already Booked' : 'Available'}
                >
                    {d}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="availability-calendar-container">
            <div className="calendar-header">
                <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="calendar-nav-btn" onClick={prevMonth}>&lt;</button>
                    <button className="calendar-nav-btn" onClick={nextMonth}>&gt;</button>
                </div>
            </div>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}
                {renderDays()}
            </div>

            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="legend-dot available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot booked"></div>
                    <span>Booked</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot today"></div>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
