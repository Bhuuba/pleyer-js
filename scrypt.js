const seekSlider = document.getElementById("seek-slider");
const audio = document.getElementById("aud");
const btnSearch = document.getElementById("btnc");
const searchInput = document.getElementById("searchInput");
const btnNext = document.getElementById("myButton");
const btnPrev = document.getElementById("myButtonE");
const artistN = document.getElementById("artistN");
const imgCover = document.getElementById("img");
const nameMusic = document.getElementById("nameMusic");
const currentTimeDisplay = document.getElementById("current-time");
const durationTimeDisplay = document.getElementById("duration-time");
const playPauseButton = document.querySelector(".play-pause-button");
const audioPlayer = document.querySelector(".audio-player");
let counterNum = 0;

// переписуємо наше ооп на функціональне
playPauseButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
  } else {
    audioPlayer.pause();
    playPauseButton.innerHTML = '<i class="bi bi-play-fill"></i>';
  }
});
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}
function searchTrack(e) {
  e.preventDefault();
  const term = encodeURIComponent(searchInput.value);
  fetch(`https://itunes.apple.com/search?term=${term}&media=music&country=UA`)
    .then((res) =>
      res.ok ? res.json() : Promise.reject("Біда біда немає треків інет ліг")
    )
    .then((data) => {
      if (data.results.length > 0) {
        let trackCount = data.results.length;
        if (counterNum < 0) {
          counterNum = trackCount - 1;
        } else if (counterNum >= trackCount) {
          counterNum = 0;
        }
        const track = data.results[counterNum];
        audio.src = track.previewUrl;
        audio.load();
        audio.play();
        playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
        artistN.textContent = track.artistName;
        imgCover.src = track.artworkUrl100;
        nameMusic.textContent = track.collectionCensoredName;
      } else {
        alert("Нічого не знайдено(");
      }
    })
    .catch((err) => console.error("Помилка:", err));
}
btnSearch.addEventListener("click", searchTrack);

btnNext.addEventListener("click", () => {
  playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
  counterNum++;
  searchTrack(new Event("click"));
});
btnPrev.addEventListener("click", () => {
  playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
  counterNum--;
  searchTrack(new Event("click"));
});

// тут я трохі обікав стек оверфлоу
audio.addEventListener("loadedmetadata", () => {
  seekSlider.max = Math.floor(audio.duration);
  durationTimeDisplay.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTimeDisplay.textContent = formatTime(audio.currentTime);
});
seekSlider.addEventListener("input", () => {
  audio.currentTime = seekSlider.value;
});
