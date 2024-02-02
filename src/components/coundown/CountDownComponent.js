import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'


const CountDownComponent = (props) => {
    const { remainingDuration, textStyle, setExamRemainingDuration, size = 58, strokeWidth = 4, onFinish = (remainingDuration) => {

    }, colorsArray,
        onChange = (remainingTime) => {

        }, key = 0 } = props;
    let newColorsArray = colorsArray && colorsArray.length > 0 ? colorsArray : [["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]];

    const children = (remainingTime) => {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

        return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
    };

    return (
        <CountdownCircleTimer
            key={key}
            isPlaying
            duration={remainingDuration}

            // initialRemainingTime={children(400)}
            colors={newColorsArray}
            onComplete={() => onFinish()}
            // style={{ zIndex: 9999, height: 20 }}
            size={size}
            strokeWidth={strokeWidth}
        >
            {({ remainingTime }) => {

                onChange(remainingTime)
                return (<div style={{ fontSize: 11, paddingHorizontal: 3 }}>
                    {
                        children(remainingTime)

                    }

                </div>)
            }}
        </CountdownCircleTimer>
    )

}
export default CountDownComponent