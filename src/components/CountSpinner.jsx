import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

const CountdownSpinner = ({ duration, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft === 0) {
            onComplete();
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onComplete]);

    return (
        <div style={{ textAlign: 'center' }}>
            <ClipLoader size={50} color={"#123abc"} loading={true} />
            <h2>{timeLeft}</h2>
        </div>
    );
};

export default CountdownSpinner;
