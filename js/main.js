// main.js
// ポイント
// - 機能ごとに initXXX() へ分割
// - ユーティリティ関数で記述を簡潔に
// - IntersectionObserver を役割ごとに命名
// - スクロール処理は単一ハンドラに統合（パッシブ）
// - 変数名の衝突・二重初期化を回避

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Config
  // =========================
  const CONFIG = {
    fadeInUpThreshold: 0.2,
    worksBtnThresholds: [0, 0.12, 0.5],
    worksBtnMinRatio: 0.12,
    worksTitleThreshold: 0.3,
    delayedTitleMs: 100,
    delayedPortfolioMs: 600,
    menuScrolledY: 50,
    menuToggleTriggerOffset: 800,
    itemInViewThreshold: 0.1,
  };

  // =========================
  // Utils
  // =========================
  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const on = (el, evt, handler, opts) =>
    el && el.addEventListener(evt, handler, opts);
  const hasIO = "IntersectionObserver" in window;

  // requestAnimationFrame ベースの軽量デバウンス
  const rafDebounce = (fn) => {
    let id = null;
    return (...args) => {
      if (id) cancelAnimationFrame(id);
      id = requestAnimationFrame(() => fn(...args));
    };
  };

  // =========================
  // 0) ギャラリー初期ランダム散らかし
  // =========================
  function initRandomScatter() {
    const wrapper = document.querySelector(".gallery-wrapper");
    if (!wrapper) return;
    const items = wrapper.querySelectorAll(".item");
    const rect = wrapper.getBoundingClientRect();

    const maxOffsetX = rect.width * 0; // 横幅の1%
    const maxOffsetY = rect.height * 0; // 高さの1%

    items.forEach((item) => {
      const offsetX = (Math.random() - 0.5) * maxOffsetX * 2;
      const offsetY = (Math.random() - 0.5) * maxOffsetY * 2;
      const rotate = (Math.random() - 0.5) * 8; // -4〜+4度
      // flowを崩さず transform のみで“散らかす”
      item.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
      item.style.transition = "transform 1.8s cubic-bezier(.16,.84,.44,1)";
    });

    // ====== STEP 2: 数秒後にリセット（ふわっと整列） ======
    setTimeout(() => {
      items.forEach((item) => {
        item.style.transform = ""; // デフォルト位置へ戻す
      });
      // Isotope 再レイアウトを促すカスタムイベント
      window.dispatchEvent(new Event("galleryReset"));
    }, 5000); // 5秒後に整列開始
  }

  // =========================
  // 1) 遅延表示（タイトル／ポートフォリオ）
  // =========================
  function initDelayedReveal() {
    const title = qs(".sec-title-works");
    const portfolio = qs(".portfolio");
    setTimeout(() => title?.classList.add("active"), CONFIG.delayedTitleMs);
    setTimeout(
      () => portfolio?.classList.add("active"),
      CONFIG.delayedPortfolioMs
    );
  }

  // =========================
  // 2) fade-in-up まとめ監視
  // =========================
  function initFadeInUp() {
    const animatedItems = qsa(".fade-in-up");
    if (!hasIO) {
      animatedItems.forEach((el) => el.classList.add("show"));
      return;
    }
    const fadeInUpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: CONFIG.fadeInUpThreshold }
    );
    animatedItems.forEach((el) => fadeInUpObserver.observe(el));
  }

  // =========================
  // 3) Works内に入ったらボタン表示
  // =========================
  function initWorksButtonObserver() {
    const worksSection = qs("#works");
    const btnGroup = qs(".button-group");
    if (!btnGroup) return;

    if (worksSection && hasIO) {
      const worksBtnObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio > CONFIG.worksBtnMinRatio
            ) {
              btnGroup.classList.add("in-works");
            } else {
              btnGroup.classList.remove("in-works");
            }
          });
        },
        { threshold: CONFIG.worksBtnThresholds }
      );
      worksBtnObserver.observe(worksSection);
    } else {
      // フォールバック：常時表示
      btnGroup.classList.add("in-works");
    }
  }

  // =========================
  // 4) Works タイトルのスライドイン
  // =========================
  function initWorksTitleReveal() {
    const el = qs("#works-title");
    if (!el) return;

    if (hasIO) {
      const titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.remove("opacity-0", "-translate-x-20");
              el.classList.add("opacity-100", "translate-x-0");
            }
          });
        },
        { threshold: CONFIG.worksTitleThreshold }
      );
      titleObserver.observe(el);
    } else {
      el.classList.remove("opacity-0", "-translate-x-20");
      el.classList.add("opacity-100", "translate-x-0");
    }
  }

  // =========================
  // 5) Isotope（Pinterest風レイアウト）
  // =========================
  function initIsotopeLayout() {
    const grid = qs(".gallery");
    if (!grid || !window.Isotope) return;

    const iso = new Isotope(grid, {
      itemSelector: ".item",
      layoutMode: "masonry",
      percentPosition: true,
      masonry: { columnWidth: ".item" },
    });

    // 散らかし演出終了後のレイアウト更新（カスタムイベント）
    on(window, "galleryReset", () => iso.layout());

    // フィルター
    const buttons = qsa(".button-group .button");
    buttons.forEach((btn) => {
      on(btn, "click", function () {
        buttons.forEach((b) =>
          b.classList.remove("active", "bg-gray-900", "text-white")
        );
        this.classList.add("active", "bg-gray-900", "text-white");
        const filterValue = this.getAttribute("data-filter");
        iso.arrange({ filter: filterValue });
      });
    });
  }

  // =========================
  // 6) ハンバーガーメニュー（スクロール含む）
  // =========================
  function initHamburgerMenu() {
    const menuToggle = qs("#menuToggle");
    const menuOverlay = qs("#menuOverlay");
    const worksSection = qs("#works");
    const body = document.body;

    // 開閉
    on(menuToggle, "click", () => {
      menuOverlay?.classList.toggle("active");
      body.classList.toggle("menu-open");
    });

    // 外側クリックで閉じる（イベントデリゲーション）
    on(document, "click", (e) => {
      if (!menuOverlay || !menuToggle) return;
      const isInsideMenu = menuOverlay.contains(e.target);
      const isOnToggle = menuToggle.contains(e.target);
      if (!isInsideMenu && !isOnToggle) {
        menuOverlay.classList.remove("active");
        body.classList.remove("menu-open");
      }
    });

    // スクロールで見た目変更（単一ハンドラ）
    const handleScroll = rafDebounce(() => {
      const y = window.scrollY;
      const triggerY =
        (worksSection?.offsetTop ?? 0) - CONFIG.menuToggleTriggerOffset;

      // works 手前で切り替え
      if (menuToggle) {
        if (y > triggerY) menuToggle.classList.add("scrolled");
        else menuToggle.classList.remove("scrolled");
      }

      // 一定量スクロールしたら overlay も調整
      if (menuOverlay) {
        if (y > CONFIG.menuScrolledY) {
          menuOverlay.classList.add("scrolled");
        } else {
          menuOverlay.classList.remove("scrolled");
        }
      }
    });

    on(window, "scroll", handleScroll, { passive: true });

    // グローバル関数（移動＋クローズ）
    window.navigateTo = function (sectionId) {
      const target =
        sectionId === "top"
          ? document.body
          : document.getElementById(sectionId);
      target?.scrollIntoView({ behavior: "smooth" });
      menuOverlay?.classList.remove("active");
      body.classList.remove("menu-open");
    };
  }

  // =========================
  // 7) 各カテゴリ1枚だけサムネ表示
  // =========================
  function initThumbnailSelection() {
    const CATEGORIES = new Set([
      "grapefruit",
      "germany1",
      "germany2",
      "germany3",
      "germany4",
      "germany5",
      "ice",
      "shadow1",
      "aida",
      "event1",
      "event2",
      "mataai",
      "twofaces",
      "gomi",
      "garigari",
      "club",
      "cartoon",
      "drawing",
    ]);

    const shown = new Set();
    qsa(".item").forEach((item) => {
      const category = [...item.classList].find((c) => CATEGORIES.has(c));
      if (!category) return;
      const isFirst = !shown.has(category);
      item.setAttribute("data-thumbnail", isFirst ? "true" : "false");
      if (isFirst) shown.add(category);
    });
  }

  // =========================
  // 8) ポップアップ（グループ単位の前後移動）
  // =========================
  function initPopup() {
    const popup = qs("#popup");
    const popupImage = qs("#popup-image");
    const popupDescription = qs("#popup-description");
    const overlay = qs(".popup-overlay");
    const prevBtn = qs("#prev-button");
    const nextBtn = qs("#next-button");

    if (!popup || !overlay || !popupImage || !popupDescription) return;

    // ベースカテゴリ（除外対象）
    const BASE = new Set(["item", "photo", "video", "design", "other"]);

    const allItems = qsa(".gallery .item");
    const GROUPS = new Set(
      allItems.flatMap((el) => [...el.classList]).filter((c) => !BASE.has(c))
    );

    const getGroupClass = (el) =>
      [...el.classList].find((c) => GROUPS.has(c)) || null;

    let currentGroup = [];
    let currentIndex = 0;

    const showPopup = () => {
      const cur = currentGroup[currentIndex];
      if (!cur) return;
      const img = qs("img", cur);
      const description = cur.getAttribute("data-description") || "";
      popupImage.src = img ? img.src : "";
      popupDescription.textContent = description;
      popup.classList.remove("hidden", "fade-out");
    };

    // サムネクリック（.overlay a）
    qsa(".overlay a").forEach((link) => {
      on(link, "click", (e) => {
        e.preventDefault();
        const item = e.target.closest(".item");
        if (!item) return;
        const groupClass = getGroupClass(item);
        if (!groupClass) return;
        currentGroup = qsa(`.item.${groupClass}`);
        currentIndex = currentGroup.indexOf(item);
        showPopup();
      });
    });

    on(prevBtn, "click", () => {
      if (!currentGroup.length) return;
      currentIndex =
        (currentIndex - 1 + currentGroup.length) % currentGroup.length;
      showPopup();
    });

    on(nextBtn, "click", () => {
      if (!currentGroup.length) return;
      currentIndex = (currentIndex + 1) % currentGroup.length;
      showPopup();
    });

    on(overlay, "click", () => popup.classList.add("hidden"));

    // キーボード操作（Esc/←/→）
    on(document, "keydown", (e) => {
      if (popup.classList.contains("hidden")) return;
      if (e.key === "Escape") popup.classList.add("hidden");
      if (e.key === "ArrowLeft") prevBtn?.click();
      if (e.key === "ArrowRight") nextBtn?.click();
    });
  }

  // =========================
  // 9) .item in-view 監視
  // =========================
  function initItemInView() {
    const items = qsa(".item");
    if (!items.length) return;

    if (!hasIO) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const itemInViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: CONFIG.itemInViewThreshold }
    );
    items.forEach((el) => itemInViewObserver.observe(el));
  }

  // =========================
  // Boot
  // =========================
  initRandomScatter();
  initDelayedReveal();
  initFadeInUp();
  initWorksButtonObserver();
  initWorksTitleReveal();
  initIsotopeLayout();
  initHamburgerMenu();
  initThumbnailSelection();
  initPopup();
  initItemInView();
});
