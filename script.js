/* ===== COUNTDOWN ===== */
const weddingDate = new Date("2026-03-24T16:00:00").getTime();

const dEl = document.getElementById("days");
const hEl = document.getElementById("hours");
const mEl = document.getElementById("minutes");
const sEl = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date().getTime();
  let distance = weddingDate - now;

  // ✅ Nếu đã quá ngày → khóa về 0
  if (distance <= 0) {
    dEl.innerText = "00";
    hEl.innerText = "00";
    mEl.innerText = "00";
    sEl.innerText = "00";
    clearInterval(timer); // dừng luôn
    return;
  }

  // Tính thời gian còn lại
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  dEl.innerText = days;
  hEl.innerText = hours;
  mEl.innerText = minutes;
  sEl.innerText = seconds;
}

// chạy mỗi giây
const timer = setInterval(updateCountdown, 1000);

// chạy ngay lần đầu (tránh phải đợi 1s)
updateCountdown();

/* #region Hero */

const hero = document.querySelectorAll(".hero")[0];
const images = [
  "assets/images/couple1.jpg",
  "assets/images/bride.jpg",
  "assets/images/groom.jpg"
];

let currentIndex = 0;

function changeBackground() {
  const nextImage = images[currentIndex];

  // Set ảnh mới
  hero.style.backgroundImage = `url(${nextImage})`;

  // Reset animation
  hero.style.animation = "none";
  void hero.offsetWidth;
  hero.style.animation = "zoomEffect 3s linear forwards";

  currentIndex = (currentIndex + 1) % images.length;
}

// Ảnh đầu tiên
hero.style.backgroundImage = `url(${images[0]})`;

currentIndex = 1;

// Cứ 6 giây đổi ảnh
setInterval(changeBackground, 3000);


/* AUTO PLAY MUSIC (fix cho iOS / Chrome chặn autoplay) */
const music = document.getElementById("bg-music");
const btn = document.getElementById("music-btn");

// /* nếu bị chặn → user click để bật */
btn.addEventListener("click", ()=>{  
  if(music.paused) music.play();
  else music.pause();
});

/* SCROLL ANIMATION */
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("active");
    }
  });
},{ threshold:0.2 });

reveals.forEach(el => observer.observe(el));

// /* DISABLE RIGHT CLICK */
// document.addEventListener("contextmenu", e => e.preventDefault());

// /* DISABLE F12 / DEVTOOLS */
// document.addEventListener("keydown", function(e){

//   if(e.key === "F12") e.preventDefault();

//   if(e.ctrlKey && e.shiftKey && e.key === "I") e.preventDefault();

//   if(e.ctrlKey && e.shiftKey && e.key === "J") e.preventDefault();

//   if(e.ctrlKey && e.key === "U") e.preventDefault();

// });

/* #region GALLERY */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".gallery .dot");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let index = -1;
let interval;

/* show slide */
function showSlide(i){
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  slides[i].classList.add("active");
  dots[i].classList.add("active");

  index = i;
}

/* next */
function nextSlide(){
  index++;
  if(index >= slides.length) index = 0;
  showSlide(index);
}

/* prev */
function prevSlide(){
  index--;
  if(index < 0) index = slides.length - 1;
  showSlide(index);
}

/* auto play */
function startAuto(){
  interval = setInterval(nextSlide, 3000);
}

function resetAuto(){
  clearInterval(interval);
  startAuto();
}

/* events */
nextBtn.onclick = () => { nextSlide(); resetAuto(); };
prevBtn.onclick = () => { prevSlide(); resetAuto(); };

dots.forEach((dot,i)=>{
  dot.onclick = () => {
    showSlide(i);
    resetAuto();
  };
});

/* start */
startAuto();
/* #endregion */

const API_URL = "https://script.google.com/macros/s/AKfycbyP0b6_imW1okDEaMj-H0B-Jn-Jlor3QUxUk7qj5R4ZP_APFS5myAUSDSiAbeFjSNoA/exec";

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadInviteName() {
  const id = getIdFromUrl();

  if (!id || id === "index.html") {
    document.querySelector(".invitation-custom")?.remove();
    return
  };

  try {
    const res = await fetch(`${API_URL}?t=${Date.now()}`);
    const data = await res.json();

    if (data.length > 0) {
      var guest = data.find(x => x.id === id);
      const name = guest.name;
      const role = guest.role;

      document.getElementsByClassName("invite-line")[0].innerHTML =
        `<strong>${name}</strong>`;
      document.getElementsByClassName("role")[0].innerHTML =
        `${role}`;        
    }else{
      document.querySelector(".invitation-custom")?.remove();
    }
  } catch (err) {
    document.querySelector(".invitation-custom")?.remove();
  }
}

loadInviteName();