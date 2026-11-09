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

  let currentScale = 1;
  let minScale = 1;
  let maxScale = 4;
  let posX = 0;
  let posY = 0;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startPinchDistance = 0;

  const updateTransform = () => {
    modalImage.style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
  };

  const resetZoom = () => {
    currentScale = 1;
    posX = 0;
    posY = 0;
    updateTransform();
  };

  media3Trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    imageModal.classList.remove('hidden');
    resetZoom();
    requestAnimationFrame(() => {
      imageModal.classList.add('active');
    });
  });

  const closeModal = () => {
    imageModal.classList.remove('active');
    resetZoom();
    setTimeout(() => {
      imageModal.classList.add('hidden');
    }, 400);
  };

  modalClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });

  modalZoomContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomStep = 0.25;
    if (e.deltaY < 0) {
      currentScale = Math.min(currentScale + zoomStep, maxScale);
    } else {
      currentScale = Math.max(currentScale - zoomStep, minScale);
      if (currentScale === 1) {
        posX = 0;
        posY = 0;
      }
    }
    updateTransform();
  }, { passive: false });

  modalZoomContainer.addEventListener('mousedown', (e) => {
    if (currentScale > 1) {
      isPanning = true;
      startX = e.clientX - posX;
      startY = e.clientY - posY;
      e.preventDefault();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning || currentScale === 1) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isPanning = false;
  });

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  modalZoomContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      startPinchDistance = getTouchDistance(e.touches);
    } else if (e.touches.length === 1 && currentScale > 1) {
      isPanning = true;
      startX = e.touches[0].clientX - posX;
      startY = e.touches[0].clientY - posY;
    }
  }, { passive: true });

  modalZoomContainer.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const currentDistance = getTouchDistance(e.touches);
      if (startPinchDistance > 0) {
        const factor = currentDistance / startPinchDistance;
        let newScale = currentScale * factor;
        newScale = Math.max(minScale, Math.min(newScale, maxScale));
        currentScale = newScale;
        if (currentScale === 1) {
          posX = 0;
          posY = 0;
        }
        updateTransform();
        startPinchDistance = currentDistance;
      }
    } else if (e.touches.length === 1 && isPanning && currentScale > 1) {
      posX = e.touches[0].clientX - startX;
      posY = e.touches[0].clientY - startY;
      updateTransform();
    }
  }, { passive: true });

  modalZoomContainer.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      startPinchDistance = 0;
    }
    if (e.touches.length === 0) {
      isPanning = false;
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
  let startXPlayer, startYPlayer, initialLeft, initialTop;

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

    startXPlayer = clientX;
    startYPlayer = clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = clientX - startXPlayer;
    const deltaY = clientY - startYPlayer;
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
