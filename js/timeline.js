const marker = document.getElementById("timeline-marker");
const timeline = document.getElementById("timeline");

timeline.addEventListener("mousemove", (e) => {
    const rect = timeline.getBoundingClientRect();

    // マウスのY位置をタイムライン内に制限
    let y = e.clientY - rect.top;
    y = Math.max(0, Math.min(rect.height, y));

    // 丸を上下に移動
    marker.style.transform = `translateY(${y}px)`;
});

  // Intersection Observerでスクロール時アニメーション
const items = document.querySelectorAll('.fade-in-up');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
    }, { threshold: 0.2 });

items.forEach(item => observer.observe(item));
