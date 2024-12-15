const AudioUtils = {
    fadeIn(audioElement, maxVol, startDelay, fadeInTime, steps) {
        let i = 0;
        let interval = fadeInTime / steps;
        setTimeout(function () {
          let intervalId = setInterval(function() {
            let volume = (maxVol / steps) * i;
            audioElement.volume = volume;
            if(++i >= steps)
              clearInterval(intervalId);
          }, interval);
        }, startDelay);
      }
}