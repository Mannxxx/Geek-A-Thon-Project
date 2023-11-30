import { useState, useEffect } from 'react';

const getColorForPercentage = (percentage: number) => {
    if (percentage <= 25) {
        return "#ff0000"; // Red for 0%-25%
    } else if (percentage <= 50) {
        return "#ff8800"; // Orange for 26%-50%
    } else if (percentage <= 75) {
        return "#ffd700"; // Gold for 51%-75%
    } else {
        return "#00cc00"; // Green for 76%-100%
    }
};

const calculateDashOffset = (offset: number) => {
    const circumference = 283.528; // 2 * π * r, r = 45%
    const progress = (offset) * circumference / 100;
    return progress;
};

export const CircularProgressBar = ({ percentage, animationDuration }: {
    percentage: number,
    animationDuration: number,
}) => {

    const [offset, setOffset] = useState(0);
    const [circleColor, setCircleColor] = useState("#007bff");

    useEffect(() => {
        const progress = setInterval(() => {
            setOffset((prevOffset) => {
                const newOffset = prevOffset + 1;
                const color = getColorForPercentage(newOffset);
                setCircleColor(color);
                if (newOffset >= percentage) {
                    clearInterval(progress);
                }
                return newOffset;
            });
        }, animationDuration);

        return () => clearInterval(progress);
    }, [percentage, animationDuration]);

    useEffect(() => {
        setOffset(0)
        // const color = getColorForPercentage(percentage);
        // setCircleColor(color);
    }, [percentage]);


    useEffect(() => {
        setOffset(0)
        setCircleColor("#007bff")
    }, [percentage, animationDuration]);

    return (
        <div className="circular-progress">
            <svg className="circle">
                <circle
                    className="circle-background"
                    cx="50%"
                    cy="50%"
                    r="45%"
                />
                <circle
                    className="circle-progress"
                    cx="50%"
                    cy="50%"
                    r="45%"
                    style={{
                        strokeDasharray: `${calculateDashOffset(offset)} 283.528px`,
                        strokeDashoffset: "0",
                        stroke: circleColor,
                        transition: `stroke-dasharray ${animationDuration}ms linear`,
                    }}
                />
            </svg>
            <div className="percentage-text" style={{ color: circleColor }}>{`${offset}%`}</div>
        </div>
    );
};
