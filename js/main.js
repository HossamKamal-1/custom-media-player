const volumeBtn = document.getElementById('volumeBtn');
const volumeBtnIconEl = volumeBtn.querySelector('.icon');
const videoElement = document.getElementById('videoElement');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIconEl = playPauseBtn.querySelector('.icon');
const controlsWrapper = document.getElementById('controlsWrapper');
const volumeSlider = document.getElementById('volumeSlider');
const videoProgressEl = document.getElementById('videoProgress');
const skipBackwardBtn = document.getElementById('skipBackwardBtn');
const skipForwardBtn = document.getElementById('skipForwardBtn');
const currentTimeEl = document.getElementById('currentTime');
const videoDurationEl = document.getElementById('videoDuration');
const videoTimelineEl = document.getElementById('videoTimeline');
const timeOnHoverEl = document.getElementById('timeOnHover');
const playbackSpeedBtn = document.getElementById('playbackSpeedBtn');
const playbackWrapper = document.querySelector('.playback-wrapper');
const playbackListItems = document.querySelectorAll('.playback-speed-item');
const picInPicBtn = document.getElementById('picInPicBtn');
const picInPicIcon = picInPicBtn.querySelector('.icon');
const goFullscreenBtn = document.getElementById('fullscreenBtn');
const goFullscreenIcon = goFullscreenBtn.querySelector('.icon');
const videoContainer = document.getElementById('videoContainer');
let cursorTimeoutId;
function hideCursor() {
  if (videoElement.paused) return;
  cursorTimeoutId = setTimeout(() => {
    videoElement.style.cursor = 'none';
  }, 1000);
}
videoElement.addEventListener('mousemove', () => {
  videoElement.style.cursor = 'auto';
  // debouncing
  clearTimeout(cursorTimeoutId);
  hideCursor();
});
let controlsHideTimeoutId;
function hideControls() {
  if (videoElement.paused) return;
  controlsHideTimeoutId = setTimeout(() => {
    controlsWrapper.classList.remove('show');
  }, 1000);
}
videoContainer.addEventListener('mousemove', (e) => {
  console.log(e.target);
  controlsWrapper.classList.add('show');
  // debonucing
  clearTimeout(controlsHideTimeoutId);
  if (controlsWrapper.contains(e.target)) {
    controlsWrapper.classList.add('show');
  } else {
    hideControls();
  }
});

playbackListItems.forEach((playBackItem) => {
  playBackItem.addEventListener('click', (e) => {
    document
      .querySelector('.playback-speed-item.active')
      .classList.remove('active');
    playBackItem.classList.add('active');
    videoElement.playbackRate = playBackItem.dataset.playbackSpeed;
  });
});
// if browser supports picinpic api
if ('pictureInPictureEnabled' in document) {
  picInPicBtn.addEventListener('click', () => {
    picInPicBtn.classList.toggle('active');
    // document has currenly running picinpic element
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch((error) => {
        // Error handling
      });
    } else {
      // Request Picture-in-Picture
      videoElement.requestPictureInPicture();
    }
  });
} else {
  picInPicBtn.remove();
}
// if browser supports fullscreen api
if ('fullscreenEnabled' in document) {
  goFullscreenBtn.addEventListener('click', () => {
    // document has currenly running picinpic element
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        // Error handling
      });
    } else {
      // Request Picture-in-Picture
      videoContainer.requestFullscreen();
    }
  });
} else {
  goFullscreenBtn.remove();
}
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    goFullscreenIcon.classList.replace('fa-expand', 'fa-compress');
  } else {
    goFullscreenIcon.classList.replace('fa-compress', 'fa-expand');
  }
});
videoElement.addEventListener('dblclick', () => {
  goFullscreenBtn.click();
});
videoElement.addEventListener('enterpictureinpicture', () => {
  picInPicBtn.classList.add('active');
  picInPicIcon.classList.replace('material-icons', 'material-symbols-rounded');
  picInPicIcon.textContent = 'pip_exit';
  console.log('enter picinpic');
});
videoElement.addEventListener('leavepictureinpicture', () => {
  picInPicBtn.classList.remove('active');
  picInPicIcon.classList.replace('material-symbols-rounded', 'material-icons');
  picInPicIcon.textContent = 'picture_in_picture_alt';
  console.log('leave picinpic');
});

playbackSpeedBtn.addEventListener('click', () => {
  playbackSpeedBtn.classList.toggle('active');
});
document.addEventListener('click', (e) => {
  if (!playbackWrapper.contains(e.target)) {
    playbackSpeedBtn.classList.remove('active');
  }
});
let volumeValue = 1;
videoTimelineEl.addEventListener('mousemove', (e) => {
  console.log(e.offsetX);
  if (e.offsetX >= videoTimelineEl.clientWidth - 20) {
    timeOnHoverEl.style.left = `${
      videoTimelineEl.clientWidth - timeOnHoverEl.clientWidth + 12
    }px`;
  } else if (e.offsetX <= 25) {
    timeOnHoverEl.style.left = '20px';
  } else {
    timeOnHoverEl.style.left = `${e.offsetX}px`;
  }
  const percentage =
    (e.offsetX / videoTimelineEl.clientWidth) * videoElement.duration;
  timeOnHoverEl.textContent = formatTime(percentage);
});
videoTimelineEl.addEventListener('click', (e) => {
  const percentage =
    (e.offsetX / videoTimelineEl.clientWidth) * videoElement.duration;
  videoElement.currentTime = percentage;
});
const dragVideoProgress = (e) => {
  const percentage =
    (e.offsetX / videoTimelineEl.clientWidth) * videoElement.duration;
  videoProgressEl.style.width = `${e.offsetX}px`;
  videoElement.currentTime = percentage;
};
// When user click mousedown btn
videoTimelineEl.addEventListener('mousedown', (e) => {
  videoTimelineEl.addEventListener('mousemove', dragVideoProgress);
});
// When user release mousedown btn
document.addEventListener('mouseup', (e) => {
  videoTimelineEl.removeEventListener('mousemove', dragVideoProgress);
});
videoElement.addEventListener('contextmenu', (e) => e.preventDefault());
const formatTime = (timeInSeconds) => {
  console.log('time in seconds', timeInSeconds);
  let minutes = Math.floor(timeInSeconds / 60) % 60,
    seconds = Math.floor(timeInSeconds % 60),
    hours = Math.floor(timeInSeconds / (60 * 60));
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;
  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

videoElement.addEventListener('loadedmetadata', (e) => {
  console.log('meta data loaded');
  console.log('time is ');
  videoDurationEl.textContent = formatTime(e.currentTarget.duration);
});

videoElement.addEventListener(
  'timeupdate',
  ({ currentTarget: { currentTime, duration } }) => {
    console.log(currentTime);
    console.log(duration);
    // console.log(`${(currentTime / duration) * 100}%`);
    videoProgressEl.style.width = `${(currentTime / duration) * 100}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }
);
skipBackwardBtn.addEventListener('click', () => {
  videoElement.currentTime -= 5;
});
skipForwardBtn.addEventListener('click', () => {
  videoElement.currentTime += 5;
});
volumeSlider.addEventListener('input', (e) => {
  console.log(e);
  volumeSlider.style.backgroundSize =
    ((volumeSlider.value - volumeSlider.min) * 100) /
      (volumeSlider.max - volumeSlider.min) +
    '% 100%';

  if (e.isCustomEvent) {
    volumeSlider.value = videoElement.volume;
    volumeSlider.style.backgroundSize = `${volumeSlider.value * 100}% 100%`;
  } else {
    videoElement.volume = volumeSlider.value;
  }
  if (volumeSlider.value >= 0.5) {
    volumeBtnIconEl.classList.remove('fa-volume-xmark');
    volumeBtnIconEl.classList.remove('fa-volume-low');
    volumeBtnIconEl.classList.add('fa-volume-high');
    volumeBtn.classList.remove('muted');
    volumeValue = volumeSlider.value;
  } else if (volumeSlider.value < 0.5 && +volumeSlider.value !== 0) {
    volumeBtnIconEl.classList.replace('fa-volume-xmark', 'fa-volume-low');
    volumeBtnIconEl.classList.replace('fa-volume-high', 'fa-volume-low');
    volumeBtn.classList.remove('muted');
    volumeValue = volumeSlider.value;
  } else {
    volumeBtnIconEl.classList.replace('fa-volume-low', 'fa-volume-xmark');
    volumeBtn.classList.add('muted');
  }
});
const customInputEvent = new Event('input');
customInputEvent.isCustomEvent = true;
volumeBtn.addEventListener('click', () => {
  volumeBtn.classList.toggle('muted');
  // volume muted
  if (volumeBtn.matches('.muted')) {
    volumeBtnIconEl.classList.replace('fa-volume-high', 'fa-volume-xmark');
    videoElement.volume = 0;
  } else {
    volumeBtnIconEl.classList.replace('fa-volume-xmark', 'fa-volume-high');
    videoElement.volume = +volumeValue;
  }
  volumeSlider.dispatchEvent(customInputEvent);
});
playPauseBtn.addEventListener('click', () => {
  videoElement[videoElement.paused ? 'play' : 'pause']();
});
videoElement.addEventListener('play', () => {
  playPauseIconEl.classList.replace('fa-play', 'fa-pause');
});
videoElement.addEventListener('click', () => playPauseBtn.click());
videoElement.addEventListener('pause', () => {
  playPauseIconEl.classList.replace('fa-pause', 'fa-play');
});
