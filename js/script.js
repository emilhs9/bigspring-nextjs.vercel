const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const dropdowns = document.querySelectorAll(".dropdown");
const themeToggle = document.querySelector(".theme-toggle");
const scrollTop = document.querySelector(".scroll-top");
const videoThumb = document.querySelector(".video-thumb");
const videoModal = document.querySelector(".video-modal");
const modalClose = document.querySelector(".modal-close");
const modalIframe = document.querySelector(".video-modal iframe");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const savedTheme = localStorage.getItem("bigspring-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
  body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
}

function closeNav() {
  navPanel.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown
      .querySelector(".dropdown-toggle")
      ?.setAttribute("aria-expanded", "false");
  });
}

navToggle.addEventListener("click", () => {
  navPanel.classList.toggle("open");
  const isOpen = navPanel.classList.contains("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector(".dropdown-toggle");
  button.addEventListener("click", (event) => {
    if (window.innerWidth > 991) return;
    event.preventDefault();

    dropdowns.forEach((item) => {
      if (item === dropdown) return;
      item.classList.remove("open");
      item
        .querySelector(".dropdown-toggle")
        ?.setAttribute("aria-expanded", "false");
    });

    dropdown.classList.toggle("open");
    button.setAttribute(
      "aria-expanded",
      String(dropdown.classList.contains("open")),
    );
  });
});

document.querySelectorAll(".nav-menu a, .nav-actions a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const dark = body.classList.contains("dark");
  localStorage.setItem("bigspring-theme", dark ? "dark" : "light");
  themeToggle.innerHTML = dark
    ? '<i class="fa-regular fa-moon"></i>'
    : '<i class="fa-regular fa-sun"></i>';
});

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".slides img"));
  const dots = slider.querySelector(".slider-dots");
  let activeIndex = 0;
  let timer = null;

  slides.forEach((_, index) => {
    if (slides.length < 2) return;
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showSlide(index));
    dots.appendChild(dot);
  });

  const dotButtons = Array.from(dots.querySelectorAll("button"));

  function showSlide(index) {
    if (index === activeIndex || slides.length < 2) return;
    slides[activeIndex].classList.remove("active");
    dotButtons[activeIndex].classList.remove("active");
    activeIndex = index;
    slides[activeIndex].classList.add("active");
    dotButtons[activeIndex].classList.add("active");
  }

  function startSlider() {
    if (timer || slides.length < 2 || reduceMotion) return;
    timer = window.setInterval(() => {
      showSlide((activeIndex + 1) % slides.length);
    }, 4500);
  }

  function stopSlider() {
    window.clearInterval(timer);
    timer = null;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        slider.dataset.visible = String(entry.isIntersecting);
        if (entry.isIntersecting && !document.hidden) {
          startSlider();
        } else {
          stopSlider();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(slider);
  } else {
    startSlider();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden || slider.dataset.visible === "false") {
      stopSlider();
    } else {
      startSlider();
    }
  });
});

function openVideo() {
  videoModal.classList.add("active");
  videoModal.setAttribute("aria-hidden", "false");
  modalIframe.src = `${modalIframe.dataset.src}?autoplay=1`;
}

function closeVideo() {
  videoModal.classList.remove("active");
  videoModal.setAttribute("aria-hidden", "true");
  modalIframe.src = "";
}

videoThumb.addEventListener("click", openVideo);
modalClose.addEventListener("click", closeVideo);
videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) closeVideo();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoModal.classList.contains("active")) {
    closeVideo();
  }
});

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      scrollTop.classList.toggle("visible", window.scrollY > 700);
      ticking = false;
    });
    ticking = true;
  },
  { passive: true },
);

scrollTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 991) closeNav();
});
