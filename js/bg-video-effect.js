document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bg-video");
  const subVideo = document.getElementById("sub-bg-video");
  const triggerEnd = window.innerHeight * 1.2;
  

  let targetOpacity = 1;
  let currentOpacity = 1;
  const easing = 0.08;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function update() {
    const scrollY = window.scrollY;
    const rawProgress = Math.min(scrollY / triggerEnd, 1);
    const easedProgress = easeInOutCubic(rawProgress);
    const blur = (1 - currentOpacity) * 20;
video.style.filter = `blur(${blur}px)`;

    targetOpacity = 1 - easedProgress; // 1 → 0 に減少
    currentOpacity += (targetOpacity - currentOpacity) * easing;

    video.style.opacity = currentOpacity.toFixed(3);
    if (subVideo) subVideo.style.opacity = currentOpacity.toFixed(3);

    requestAnimationFrame(update);
  }

  update();
});