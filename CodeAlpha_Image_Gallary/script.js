/**
 * Image Gallery - Task-1
 * Features: category filters, lightbox with prev/next, keyboard navigation
 */

const galleryData = [
  { id: 1, title: "Mountain Sunrise", category: "nature", src: "https://picsum.photos/seed/mountain/800/600" },
  { id: 2, title: "Forest Path", category: "nature", src: "https://picsum.photos/seed/forest/800/600" },
  { id: 3, title: "Ocean Waves", category: "nature", src: "https://picsum.photos/seed/ocean/800/600" },
  { id: 4, title: "City Skyline", category: "architecture", src: "https://picsum.photos/seed/skyline/800/600" },
  { id: 5, title: "Modern Bridge", category: "architecture", src: "https://picsum.photos/seed/bridge/800/600" },
  { id: 6, title: "Historic Tower", category: "architecture", src: "https://picsum.photos/seed/tower/800/600" },
  { id: 7, title: "Coastal Village", category: "travel", src: "https://picsum.photos/seed/coast/800/600" },
  { id: 8, title: "Desert Road", category: "travel", src: "https://picsum.photos/seed/desert/800/600" },
  { id: 9, title: "Alpine Lake", category: "travel", src: "https://picsum.photos/seed/alpine/800/600" },
  { id: 10, title: "Color Burst", category: "abstract", src: "https://picsum.photos/seed/color/800/600" },
  { id: 11, title: "Geometric Light", category: "abstract", src: "https://picsum.photos/seed/geo/800/600" },
  { id: 12, title: "Soft Blur", category: "abstract", src: "https://picsum.photos/seed/blur/800/600" },
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let visibleItems = [];
let currentIndex = 0;

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function renderGallery() {
  gallery.innerHTML = galleryData
    .map(
      (item) => `
    <article
      class="gallery-item"
      data-id="${item.id}"
      data-category="${item.category}"
      tabindex="0"
      role="button"
      aria-label="View ${item.title}"
    >
      <img src="${item.src}" alt="${item.title}" loading="lazy" width="800" height="600">
      <div class="gallery-overlay">
        <span class="gallery-category">${formatCategory(item.category)}</span>
        <h2 class="gallery-title">${item.title}</h2>
      </div>
      <span class="gallery-zoom-icon" aria-hidden="true">&#128269;</span>
    </article>
  `
    )
    .join("");

  attachGalleryListeners();
  applyFilter(currentFilter);
}

function getVisibleItems() {
  return Array.from(gallery.querySelectorAll(".gallery-item:not(.hidden)"));
}

function applyFilter(filter) {
  currentFilter = filter;
  const items = gallery.querySelectorAll(".gallery-item");

  items.forEach((item) => {
    const category = item.dataset.category;
    const show = filter === "all" || category === filter;
    item.classList.toggle("hidden", !show);
    if (show) {
      item.classList.remove("filter-in");
      void item.offsetWidth;
      item.classList.add("filter-in");
    } else {
      item.classList.remove("filter-in");
    }
  });

  visibleItems = getVisibleItems();
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  if (visibleItems.length === 0) return;

  currentIndex = index;
  lightbox.removeAttribute("hidden");
  requestAnimationFrame(() => lightbox.classList.add("open"));
  document.body.style.overflow = "hidden";
  updateLightboxContent();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => {
    lightbox.setAttribute("hidden", "");
    lightboxImage.src = "";
  }, 350);
}

function updateLightboxContent() {
  const item = visibleItems[currentIndex];
  if (!item) return;

  const id = parseInt(item.dataset.id, 10);
  const data = galleryData.find((d) => d.id === id);
  if (!data) return;

  lightboxImage.classList.add("loading");
  lightboxImage.onload = () => lightboxImage.classList.remove("loading");
  lightboxImage.src = data.src;
  lightboxImage.alt = data.title;
  lightboxTitle.textContent = data.title;
  lightboxCategory.textContent = formatCategory(data.category);
  lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
}

function showPrev() {
  visibleItems = getVisibleItems();
  if (visibleItems.length === 0) return;
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightboxContent();
}

function showNext() {
  visibleItems = getVisibleItems();
  if (visibleItems.length === 0) return;
  currentIndex = (currentIndex + 1) % visibleItems.length;
  updateLightboxContent();
}

function attachGalleryListeners() {
  gallery.querySelectorAll(".gallery-item").forEach((item, index) => {
    const open = () => {
      visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      openLightbox(idx >= 0 ? idx : 0);
    };

    item.addEventListener("click", open);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);

    if (lightbox.classList.contains("open")) {
      visibleItems = getVisibleItems();
      if (visibleItems.length === 0) {
        closeLightbox();
      } else if (currentIndex >= visibleItems.length) {
        currentIndex = 0;
        updateLightboxContent();
      }
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrev);
lightboxNext.addEventListener("click", showNext);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;

  switch (e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      showPrev();
      break;
    case "ArrowRight":
      showNext();
      break;
  }
});

renderGallery();
