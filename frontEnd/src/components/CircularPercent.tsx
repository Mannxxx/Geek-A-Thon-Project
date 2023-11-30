import { useEffect } from "react"

export function CircularPercent({
    percent = 30
}: {
    percent?: number
}) {

    useEffect(() => {
        // const targetPercentage = 75;
        // const fill = document.getElementById('fill');
        // const percentageText = document.getElementById('percentage');

        // function animateCircle(currentPercentage) {
        //     const maxPercentage = Math.min(currentPercentage, targetPercentage);
        //     const fillAngle = (maxPercentage / 100) * 360;
        //     fill.style.clipPath = `polygon(50% 50%, 50% 0, 100% 0, 100% 100%, ${50 + 50 * Math.sin((fillAngle - 90) * (Math.PI / 180))}% ${50 + 50 * Math.cos((fillAngle - 90) * (Math.PI / 180))}%)`;
        //     percentageText.textContent = `${maxPercentage}%`;

        //     if (currentPercentage < targetPercentage) {
        //         setTimeout(() => animateCircle(currentPercentage + 1), 10);
        //     }
        // }

        // // Start the animation when the document is ready
        // document.addEventListener("DOMContentLoaded", function () {
        //     animateCircle(0);
        // });
    }, [])


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="circle">
                    <div className="fill" id="fill"></div>
                    <div className="percentage" id="percentage">0%</div>
                </div>
            </div>
        </div>
    )
}