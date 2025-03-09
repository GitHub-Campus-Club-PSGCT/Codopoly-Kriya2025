import { useState, useEffect, useRef } from "react";
import styles from '../../styles/bidding.module.css';
import Clock from '../../assets/clock.png';

const Timer = ({ onTimerReset }) => {
    const [timeLeft, setTimeLeft] = useState(60);// Assuming one min for each auction item
    const prevTimeLeft = useRef(timeLeft);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 1) {
                    return 60; // Reset timer
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (prevTimeLeft.current === 1 && timeLeft === 10) {
            onTimerReset(); // Notify AuctionCode to fetch new code
        }
        prevTimeLeft.current = timeLeft;
    }, [timeLeft, onTimerReset]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <div className={styles.timer}>
                <img src={Clock} alt="Clock"/> 
                <p className={styles.text}>
                    {formatTime(timeLeft)}
                </p>
            </div>
        </>
    );
};

export default Timer;
