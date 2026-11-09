document.addEventListener('DOMContentLoaded', () => {
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step4 = document.getElementById('step4');

  const btnStep1 = document.getElementById('btnStep1');
  const btnStep2 = document.getElementById('btnStep2');
  const btnBack2 = document.getElementById('btnBack2');
  const btnBack4 = document.getElementById('btnBack4');

  btnStep1.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  });

  btnStep2.addEventListener('click', () => {
    step2.classList.add('hidden');
    step4.classList.remove('hidden');
  });

  btnBack2.addEventListener('click', () => {
    step2.classList.add('hidden');
    btnStep2.classList.add('hidden');
    step1.classList.remove('hidden');
  });

  btnBack4.addEventListener('click', () => {
    step4.classList.add('hidden');
    step2.classList.remove('hidden');
  });
  
  const media3Trigger = document.getElementById('media3Trigger');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const modalZoomContainer = document.getElementById('modalZoomContainer');

  media3Trigger.addEventListener('click', () => {
    imageModal.classList.remove('hidden');
    modalImage.classList.remove('zoomed');
    requestAnimationFrame(() => {
      imageModal.classList.add('active');
    });
  });

  const closeModal = () => {
    imageModal.classList.remove('active');
    modalImage.classList.remove('zoomed');
    setTimeout(() => {
      imageModal.classList.add('hidden');
    }, 400);
  };

  modalClose.addEventListener('click', closeModal);

  modalImage.addEventListener('click', (e) => {
    e.stopPropagation();
    modalImage.classList.toggle('zoomed');
  });

  imageModal.addEventListener('click', () => {
    closeModal();
  });

  modalZoomContainer.addEventListener('click', (e) => {
    if (e.target === modalZoomContainer) {
      closeModal();
    }
  });

  const audio = document.getElementById('bgAudio');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const volumeSlider = document.getElementById('volumeSlider');
  const volIcon = document.getElementById('volIcon');

  audio.volume = volumeSlider.value / 100;
  
  const updateVolumeIcon = (val) => {
    if (val == 0) {
      volIcon.textContent = '🔇';
    } else if (val <= 25) {
      volIcon.textContent = '🔈';
    } else if (val <= 75) {
      volIcon.textContent = '🔉';
    } else {
      volIcon.textContent = '🔊';
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = '❚❚';
    } else {
      audio.pause();
      playPauseBtn.textContent = '▶';
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
    }
  });

  progressBar.addEventListener('input', (e) => {
    e.stopPropagation();
    if (audio.duration) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    e.stopPropagation();
    const val = volumeSlider.value;
    audio.volume = val / 100;
    updateVolumeIcon(val);
  });

  let lastVolume = 75;
  volIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.volume > 0) {
      lastVolume = volumeSlider.value;
      volumeSlider.value = 0;
      audio.volume = 0;
      updateVolumeIcon(0);
    } else {
      volumeSlider.value = lastVolume;
      audio.volume = lastVolume / 100;
      updateVolumeIcon(lastVolume);
    }
  });

  const player = document.querySelector('.audio-player');
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  const interactiveInputs = player.querySelectorAll('input, button');
  interactiveInputs.forEach(input => {
    input.addEventListener('mousedown', (e) => e.stopPropagation());
    input.addEventListener('touchstart', (e) => e.stopPropagation());
  });

  const startDrag = (clientX, clientY) => {
    isDragging = true;
    const rect = player.getBoundingClientRect();
    
    player.style.position = 'fixed';
    player.style.transform = 'none';
    player.style.left = `${rect.left}px`;
    player.style.top = `${rect.top}px`;

    startX = clientX;
    startY = clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    player.style.left = `${initialLeft + deltaX}px`;
    player.style.top = `${initialTop + deltaY}px`;
  };

  const stopDrag = () => {
    isDragging = false;
  };

  player.addEventListener('mousedown', (e) => {
    startDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup', stopDrag);

  player.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('touchend', stopDrag);
});