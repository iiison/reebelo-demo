import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'

import styles from './styles.css'

const Timer = ({ seconds, onSkip }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
      // exit early when we reach 0
      if (timeLeft === 0) {
        onSkip('PAGE_TIMEOUT')

        return
      }

      // save intervalId to clear the interval when the
      // component re-renders
      const intervalId = setInterval(() => setTimeLeft(timeLeft - 1) , 1000)

      // clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
      // add timeLeft as a dependency to re-rerun the effect
      // when we update it
    }, [timeLeft]);

    return (
        <div className={`col-12 ${styles.timer}`}>
            {timeLeft <= 60 ? <p>{`Session has been idle and will timeout in ${timeLeft} seconds`}</p> : ""}
        </div>
    );
};

Timer.propTypes = {
  seconds: PropTypes.number,
  onSkip: PropTypes.func
}


export default Timer

