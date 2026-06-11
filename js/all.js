// document.addEventListener("DOMContentLoaded", () => {
//   const wrapper = document.querySelector(".gallery-wrapper");
//   const items = wrapper.querySelectorAll(".item");
//   const rect = wrapper.getBoundingClientRect();

//   const maxOffsetX = rect.width * 0.01;   // 横幅の10%
//   const maxOffsetY = rect.height * 0.01;  // 高さの10%

//   items.forEach((item) => {
//     const offsetX = (Math.random() - 0.5) * maxOffsetX * 2;
//     const offsetY = (Math.random() - 0.5) * maxOffsetY * 2;
//     const rotate = (Math.random() - 0.5) * 8;    // -4〜+4度
//     // 位置(flow)は変えず transform のみで“散らかす”
//     item.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
//     item.style.transition = "transform 1.8s cubic-bezier(.16,.84,.44,1)";
//   });

//   // ====== STEP 2: 数秒後にリセット（ふわっと整列） ======
//   setTimeout(() => {
//     items.forEach((item) => {
//       item.style.transform = "";  // デフォルト位置へ
//     });
//   // Isotope 再レイアウトを促すカスタムイベント
//   window.dispatchEvent(new Event('galleryReset'));
//   }, 5000); // ← 3秒後に開始（トランジション1.5秒かけて動く）
// });


// ==================== カーソル制御 ====================
const cursor = document.querySelector(".custom-cursor");
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
const speed = 0.15;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button, .nav-btn").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

document.addEventListener("mousedown", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 400);
});

// ==================== DOMが読み込まれたら実行 ====================
// document.addEventListener("DOMContentLoaded", () => {



//   // ========== 遅延表示 ==========
//   const title = document.querySelector('.sec-title-works');
//   const portfolio = document.querySelector('.portfolio');
//   setTimeout(() => title?.classList.add('active'), 100);
//   setTimeout(() => portfolio?.classList.add('active'), 600);


//   // タイトルと経歴アイテムをまとめて監視
// const animatedItems = document.querySelectorAll('.fade-in-up');

// const observer = new IntersectionObserver(entries => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('show');
//     }
//   });
// }, { threshold: 0.2 });

// animatedItems.forEach(item => observer.observe(item));

//   // ========== IntersectionObserverでボタン表示 ==========
//   const worksSection = document.getElementById('works');
//   const btnGroup = document.querySelector('.button-group');
//   if (worksSection && btnGroup && 'IntersectionObserver' in window) {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting && entry.intersectionRatio > 0.12) {
//           btnGroup.classList.add('in-works');
//         } else {
//           btnGroup.classList.remove('in-works');
//         }
//       });
//     }, { threshold: [0, 0.12, 0.5] });
//     observer.observe(worksSection);
//   } else {
//     btnGroup?.classList.add('in-works');
//   }
//   // タイトルのスクロールアニメーション（内側DOM Ready を統合）
//   const worksTitleEl = document.getElementById("works-title");
//   if (worksTitleEl) {
//     const titleObserver = new IntersectionObserver(entries => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           worksTitleEl.classList.remove("opacity-0", "-translate-x-20");
//           worksTitleEl.classList.add("opacity-100", "translate-x-0");
//         }
//       });
//     }, { threshold: 0.3 });
//     titleObserver.observe(worksTitleEl);
//   }

//   // IsotopeでPinterest風レイアウト初期化
//   const grid = document.querySelector('.gallery');
//   if (grid && window.Isotope) {
//     const iso = new Isotope(grid, {
//       itemSelector: '.item',
//       layoutMode: 'masonry',
//       percentPosition: true,
//       masonry: { columnWidth: '.item' }
//     });
//   // 散らかし演出終了後に再レイアウト
//   window.addEventListener('galleryReset', () => iso.layout());

//     // フィルターボタン設定
//     const buttons = document.querySelectorAll('.button-group .button');
//     buttons.forEach(btn => {
//       btn.addEventListener('click', function () {
//         buttons.forEach(b => b.classList.remove('active', 'bg-gray-900', 'text-white'));
//         this.classList.add('active', 'bg-gray-900', 'text-white');
//         const filterValue = this.getAttribute('data-filter');
//         iso.arrange({ filter: filterValue });
//       });
//     });
//   }
//   // ========== ハンバーガーメニュー ==========
//   document.addEventListener("scroll", () => {
//   const menuIcon = document.getElementById("menuToggle");
//   const worksSection = document.getElementById("works");

//   const scrollY = window.scrollY;
//   const triggerY = worksSection.offsetTop - 800;

//   if (scrollY > triggerY) {
//     menuIcon.classList.add("scrolled");
//   } else {
//     menuIcon.classList.remove("scrolled");
//   }
// });
//   const menuToggle = document.getElementById('menuToggle');
//   const menuOverlay = document.getElementById('menuOverlay');

//   menuToggle?.addEventListener('click', () => {
//     menuOverlay.classList.toggle('active');
//     document.body.classList.toggle('menu-open');
//   });

//   document.addEventListener('click', (e) => {
//     const isClickInsideMenu = menuOverlay.contains(e.target);
//     const isClickOnToggle = menuToggle.contains(e.target);
//     if (!isClickInsideMenu && !isClickOnToggle) {
//       menuOverlay.classList.remove('active');
//       document.body.classList.remove('menu-open');
//     }
//   });
//   window.addEventListener('scroll', function () {
//     const menuIcon = document.getElementById('menuToggle');
//     const menuOverlay = document.getElementById('menuOverlay');

//     if (window.scrollY > 50) {
//       menuIcon.classList.add('scrolled');
//       menuOverlay.classList.add('scrolled');
//     } else {
//       menuIcon.classList.remove('scrolled');
//       menuOverlay.classList.remove('scrolled');
//     }
//   });
//   // メニュー内スクロール関数
//   window.navigateTo = function(sectionId) {
//     const target = sectionId === 'top' ? document.body : document.getElementById(sectionId);
//     if (target) {
//       target.scrollIntoView({ behavior: 'smooth' });
//     }
//     menuOverlay.classList.remove("active");
//     document.body.classList.remove('menu-open');
//   };

//   // ========== サムネイル1枚制御 ==========
//   const shownCategories = new Set();
//   document.querySelectorAll(".item").forEach(item => {
//     const category = Array.from(item.classList).find(c =>
//       ["grapefruit", "germany1", "germany2", "germany3", "germany4", "germany5", "ice","shadow1","aida","event1","event2","mataai","twofaces","gomi","garigari","club","cartoon","drawing"].includes(c)
//     );
//     if (!category) return;
//     if (shownCategories.has(category)) {
//       item.setAttribute("data-thumbnail", "false");
//     } else {
//       shownCategories.add(category);
//       item.setAttribute("data-thumbnail", "true");
//     }
//   });

//   // ========== ポップアップ処理 ==========
//   (() => {
//     const popup = document.getElementById("popup");
//     const popupImage = document.getElementById("popup-image");
//     const popupDescription = document.getElementById("popup-description");
//     const overlay = document.querySelector(".popup-overlay");
//     const prevBtn = document.getElementById("prev-button");
//     const nextBtn = document.getElementById("next-button");

//     const BASE = new Set(["item", "photo", "video", "design", "other"]);
//     const GROUPS = new Set(
//       [...document.querySelectorAll(".gallery .item")]
//         .flatMap(el => [...el.classList])
//         .filter(c => !BASE.has(c))
//     );

//     function getGroupClass(el) {
//       return [...el.classList].find(c => GROUPS.has(c)) || null;
//     }

//     let currentGroup = [];
//     let currentIndex = 0;
//     let isPopupVisible = false;
//     let scrollTimeout;

//     function showPopup() {
//   const currentItem = currentGroup[currentIndex];
//   if (!currentItem) return;

//   const img = currentItem.querySelector("img");
//   const description = currentItem.getAttribute("data-description") || "";

//   popupImage.src = img ? img.src : "";
//   popupDescription.textContent = description;

//   popup.classList.remove("hidden", "fade-out");
//   isPopupVisible = true;
// }

//     document.querySelectorAll(".overlay a").forEach(link => {
//       link.addEventListener("click", e => {
//         e.preventDefault();
//         const item = e.target.closest(".item");
//         if (!item) return;
//         const groupClass = getGroupClass(item);
//         if (!groupClass) return;
//         currentGroup = Array.from(document.querySelectorAll(`.item.${groupClass}`));
//         currentIndex = currentGroup.indexOf(item);
//         showPopup();
//       });
//     });

//     prevBtn?.addEventListener("click", () => {
//       if (!currentGroup.length) return;
//       currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
//       showPopup();
//     });

//     nextBtn?.addEventListener("click", () => {
//       if (!currentGroup.length) return;
//       currentIndex = (currentIndex + 1) % currentGroup.length;
//       showPopup();
//     });

//     overlay?.addEventListener("click", () => {
//       popup.classList.add("hidden");
//       isPopupVisible = false;
//     });


//   })();

//   // ========== IntersectionObserverで in-view クラス追加 ==========
//   const items = document.querySelectorAll('.item');
//   if ('IntersectionObserver' in window) {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('in-view');
//         }
//       });
//     }, { threshold: 0.1 });
//     items.forEach(item => observer.observe(item));
//   } else {
//     items.forEach(item => item.classList.add('in-view'));
//   }

//   // ========== jQuery（Isotope） ==========
//   // jQuery版の二重初期化は不要のため削除（上部で vanilla Isotope 済）
// });

