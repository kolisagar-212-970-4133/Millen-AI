// FRAME / AI interactions — no framework or plugin required
document.body.classList.add("loading");
const loader = document.getElementById("loader");
const loaderCount = document.getElementById("loaderCount");
const loaderBar = document.getElementById("loaderBar");
let progress = 0;
const loaderTimer = setInterval(() => {
  progress = Math.min(progress + Math.ceil(Math.random() * 13), 100);
  loaderCount.textContent = String(progress).padStart(2, "0");
  loaderBar.style.width = progress + "%";
  if (progress >= 100) {
    clearInterval(loaderTimer);
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.remove("loading");
      setTimeout(() => loader.remove(), 1100);
    }, 250);
  }
}, 75);

// Sticky navigation
const header = document.getElementById("header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 50), {
  passive: true
});

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => mobileMenu.classList.remove("open")));

// Custom cursor on desktop
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
if (window.matchMedia("(pointer:fine)").matches) {
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  window.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });
  const follow = () => {
    rx += (mx - rx) * .16;
    ry += (my - ry) * .16;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(follow);
  };
  follow();
  document.querySelectorAll("a,button,.work-thumb").forEach(el => {
    el.addEventListener("mouseenter", () => {
      ring.style.width = "55px";
      ring.style.height = "55px";
    });
    el.addEventListener("mouseleave", () => {
      ring.style.width = "30px";
      ring.style.height = "30px";
    });
  });
} else {
  dot.remove();
  ring.remove();
}

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: .12
});
document.querySelectorAll(".reveal,.reveal-image").forEach(el => revealObserver.observe(el));

// Subtle hero image parallax
const parallaxImage = document.querySelector(".image-parallax");
let ticking = false;
window.addEventListener("scroll", () => {
  if (!parallaxImage || ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const rect = parallaxImage.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) {
      const speed = Number(parallaxImage.dataset.speed || .05);
      parallaxImage.style.transform = `translateY(${(rect.top-innerHeight/2)*-speed}px)`;
    }
    ticking = false;
  });
}, {
  passive: true
});

// Portfolio category filter
const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");
filterButtons.forEach(button => button.addEventListener("click", () => {
  filterButtons.forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  const filter = button.dataset.filter;
  workCards.forEach(card => card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter));
}));

// Portfolio video modal
const videoModal = document.getElementById("videoModal");
const modalFrame = document.getElementById("modalFrame");

function closeVideo() {
  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
  modalFrame.src = "";
  document.body.style.overflow = "";
}
document.querySelectorAll(".work-card").forEach(card => card.addEventListener("click", () => {
  modalFrame.src = card.dataset.video;
  videoModal.classList.add("open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}));
document.getElementById("modalClose").addEventListener("click", closeVideo);
videoModal.addEventListener("click", e => {
  if (e.target === videoModal) closeVideo();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeVideo();
});

// Live script character / word / line counter
const scriptInput = document.getElementById("scriptInput");
const charCount = document.getElementById("charCount");
const charNoSpace = document.getElementById("charNoSpace");
const wordCount = document.getElementById("wordCount");
const lineCount = document.getElementById("lineCount");
const limitText = document.getElementById("limitText");
const counterProgress = document.getElementById("counterProgress");

function updateCounts() {
  const value = scriptInput.value;
  const chars = value.length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lines = value.length ? value.split(/\n/).length : 0;
  charCount.textContent = chars.toLocaleString();
  charNoSpace.textContent = value.replace(/\s/g, "").length.toLocaleString();
  wordCount.textContent = words.toLocaleString();
  lineCount.textContent = lines.toLocaleString();
  limitText.textContent = `${chars.toLocaleString()} / 5,000 characters`;
  counterProgress.style.width = (chars / 50) + "%";
}
scriptInput.addEventListener("input", updateCounts);
document.getElementById("clearScript").addEventListener("click", () => {
  scriptInput.value = "";
  updateCounts();
  scriptInput.focus();
});

// Contact form: front-end validation + mailto handoff (replace with backend integration for real submissions)
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const projectType = document.getElementById("projectType").value;
  const budget = document.getElementById("budget").value;
  const message = document.getElementById("message").value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (name.length < 2 || !validEmail || message.length < 10) {
    formMessage.textContent = "Please enter a valid name, email address and message (at least 10 characters).";
    formMessage.className = "form-message error";
    return;
  }
  const recipient = "hello@frameai.example"; // CHANGE to the client's real email address
  const subject = encodeURIComponent("New website enquiry from " + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject: ${projectType}\nBudget: ${budget}\n\nMessage:\n${message}`);
  formMessage.textContent = "Your email app will open with the enquiry. Replace the demo email address before launch.";
  formMessage.className = "form-message success";
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

// Dynamic footer year
document.getElementById("year").textContent = new Date().getFullYear();