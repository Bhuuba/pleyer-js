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
let counterNum = 0;
let currentResults = [];
let currentTerm = "";

function loadTrack() {
  if (!currentResults.length) return;
  const track = currentResults[counterNum];
  audio.src = track.previewUrl;
  audio.oncanplaythrough = () => {
    audio.play();
    if (audio.paused) {
      audio.play();
      playPauseButton.innerHTML = '<i class="bi bi-play-fill"></i>';
    } else {
      audio.play();
      playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
    }
  };
  audio.load();
  artistN.textContent = track.artistName;
  imgCover.src = track.artworkUrl100;
  nameMusic.textContent = track.trackName;
}

function fetchTracks(term) {
  const q = encodeURIComponent(term);
  fetch(
    `https://itunes.apple.com/search?term=${q}&media=music&limit=25&country=UA`
  )
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => {
      if (!data.results.length) {
        alert("Нічого не знайдено за запитом: " + term);
        return;
      }
      currentResults = data.results;
      currentTerm = term;
      counterNum = 0;
      loadTrack();
    })
    .catch((err) => {
      console.error(err);
      alert("Помилка при пошуку треків.");
    });
}
btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  fetchTracks(searchInput.value.trim());
});

fetchTracks("Wake Up, Girls!");
function changeTrack(chane) {
  if (!currentResults.length) return;
  counterNum =
    (counterNum + chane + currentResults.length) % currentResults.length;
  loadTrack();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
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

btnNext.addEventListener("click", () => changeTrack(1));
btnPrev.addEventListener("click", () => changeTrack(-1));
audio.addEventListener("ended", () => changeTrack(1));
playPauseButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
  } else {
    audio.pause();
    playPauseButton.innerHTML = '<i class="bi bi-play-fill"></i>';
  }
});
