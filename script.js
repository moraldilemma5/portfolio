document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      const file = button.getAttribute('data-file');
      fetch(file)
        .then(res => res.text())
        .then(html => {
          document.getElementById('content').innerHTML = html;
        });
    });
  }); 

// Aoi Yamada スクロール時
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const fadeStart = 0;      // フェード開始位置（px）
    const fadeEnd = 300;      // フェード終了位置（完全に消える位置）

    const subvisual = document.getElementById('subvisual');

    if (scrollY <= fadeStart) {
      subvisual.style.opacity = 1;
    } else if (scrollY >= fadeEnd) {
      subvisual.style.opacity = 0;
    } else {
      // スクロール位置に応じて透明度を計算
      const opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
      subvisual.style.opacity = opacity;
    }
  });




  window.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.sec-title-works');
  const portfolio = document.querySelector('.portfolio');

  // 遅延追加でアニメ風に
  setTimeout(() => {
    title.classList.add('active');
  }, 100);

  setTimeout(() => {
    portfolio.classList.add('active');
  }, 600); // タイトルより遅れて
});




// works セクションが画面内に入ったら右のボックスを表示する（IntersectionObserver）
document.addEventListener('DOMContentLoaded', function () {
  const worksSection = document.getElementById('works');
  const btnGroup = document.querySelector('.button-group');

  if (!worksSection || !btnGroup || !('IntersectionObserver' in window)) {
    // 古いブラウザや要素がない場合は常時表示
    btnGroup && btnGroup.classList.add('in-works');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.12) {
        btnGroup.classList.add('in-works');
      } else {
        btnGroup.classList.remove('in-works');
      }
    });
  }, {
    root: null,
    threshold: [0, 0.12, 0.5]
  });

  observer.observe(worksSection);
});









  $(document).ready(function () {
    // Isotope初期化
    var $gallery = $('.gallery').isotope({
      itemSelector: '.item',
      layoutMode: 'fitRows'
    });

    // フィルターボタン切り替え
    $('.button-group .button').on('click', function () {
      $('.button-group .button').removeClass('active');
      $(this).addClass('active');
      var filterValue = $(this).attr('data-filter');
      $gallery.isotope({ filter: filterValue });
    });
  });

  // Adobe Typekit 読み込み（そのまま）
  (function (d) {
    var config = { kitId: 'cwa5rpr', scriptTimeout: 3000, async: true },
      h = d.documentElement,
      t = setTimeout(function () {
        h.className = h.className.replace(/\bwf-loading\b/g, "") + " wf-inactive";
      }, config.scriptTimeout),
      tk = d.createElement("script"),
      f = false,
      s = d.getElementsByTagName("script")[0],
      a;
    h.className += " wf-loading";
    tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
    tk.async = true;
    tk.onload = tk.onreadystatechange = function () {
      a = this.readyState;
      if (f || (a && a != "complete" && a != "loaded")) return;
      f = true;
      clearTimeout(t);
      try {
        Typekit.load(config);
      } catch (e) { }
    };
    s.parentNode.insertBefore(tk, s);
  })(document);
  document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");

  // ハンバーガークリックで開閉
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // 外クリック判定に届かないように
    menuOverlay.classList.toggle("active");
  });

  // メニュー内クリック時は閉じないように
  menuOverlay.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 外クリックで閉じる
  document.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
  });
});

  // スムーズスクロール + メニュー閉じる
  function navigateTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('.menu-overlay').classList.remove('active');
    }
  }

  // スクロール時のヘッダーのタイトル表示切替とメニュー閉じる
  window.addEventListener('scroll', () => {
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuOverlay.classList.contains('active')) {
      menuOverlay.classList.remove('active');
    }
    const title = document.querySelector('.site-title');
    title.classList.add('hidden');
    if (window.scrollY < 10) {
      title.classList.remove('hidden');
    }
  });

  // ポップアップ関連スクリプト
  document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const popupImage = document.getElementById("popup-image");
    const popupDescription = document.getElementById("popup-description");
    const overlay = document.querySelector(".popup-overlay");
    const prevBtn = document.getElementById("prev-button");
    const nextBtn = document.getElementById("next-button");

    let currentGroup = [];
    let currentIndex = 0;
    let isPopupVisible = false;
    let scrollTimeout;

    // サムネイルを1枚だけ表示に設定
    const shownCategories = new Set();
    document.querySelectorAll(".item").forEach((item) => {
      const category = Array.from(item.classList).find(c =>
        ["grapefruit", "germany1", "germany2", "germany3", "germany4", "germany5"].includes(c)
      );

      if (shownCategories.has(category)) {
        item.setAttribute("data-thumbnail", "false");
      } else {
        shownCategories.add(category);
        item.setAttribute("data-thumbnail", "true");
      }
    });

    // VIEW MOREクリックでポップアップ表示
    document.querySelectorAll(".overlay a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const item = e.target.closest(".item");
        // グループは「item」のクラスのうち該当カテゴリだけ取得
        const groupClass = Array.from(item.classList).find(cls => cls !== 'item' && cls !== 'photo' && cls !== 'video' && cls !== 'other');
        currentGroup = Array.from(document.querySelectorAll(`.item.${groupClass}`));
        currentIndex = currentGroup.indexOf(item);
        showPopup();
      });
    });

    function showPopup() {
      const currentItem = currentGroup[currentIndex];
      const imgSrc = currentItem.querySelector("img").src;
      popupImage.src = imgSrc;
      popupDescription.textContent = '';

      popup.classList.remove("hidden", "fade-out");
      isPopupVisible = true;
    }

    // ポップアップの前後ボタン
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
      showPopup();
    });
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % currentGroup.length;
      showPopup();
    });

    // オーバーレイクリックで閉じる
    overlay.addEventListener("click", () => {
      popup.classList.add("hidden");
      isPopupVisible = false;
    });

    // スクロール時にポップアップを自然にフェードアウトして閉じる（デバウンス付き）
    window.addEventListener('scroll', () => {
      if (
        isPopupVisible &&
        !popup.classList.contains('hidden') &&
        !popup.classList.contains('fade-out')
      ) {
        popup.classList.add('fade-out');

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          popup.classList.add('hidden');
          popup.classList.remove('fade-out');
          isPopupVisible = false;
        }, 500);
      }
    });
  });