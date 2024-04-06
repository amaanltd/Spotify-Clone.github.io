console.log("Hello World");
let currentMusic = new Audio();
let songs;

let getSongs = async () => {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
};

const playMusic = (track) => {
  currentMusic.src = "/songs/" + track + ".mp3";
  currentMusic.play();
  play.src = "pause.svg";
  document.querySelector(".songtitle").innerHTML = track;
};
async function main() {
  songs = await getSongs();

  let songsUL = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songsUL.innerHTML =
      songsUL.innerHTML +
      `<li>
           <img class="invert" src="music.svg" alt="" srcset="">
           <div class="info">
         <div class="sName">${song
           .split("/songs/")[1]
           .replaceAll("%20", " ")
           .replaceAll(".mp3", "")}</div>
         <div class="aName">Amaan</div>
         </div>
         <img src="play.svg" class="invert" alt="">
         </li>  `;
  }

  // function to list all the songs
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  // function to use play, previous and forward buttons
  play.addEventListener("click", () => {
    if (currentMusic.paused) {
      currentMusic.play();
      play.src = "pause.svg";
    } else {
      currentMusic.pause();
      play.src = "play.svg";
    }
  });

  // Update the current time display every second
  currentMusic.addEventListener("timeupdate", function () {
    // Get the current time of the audio in seconds
    const currentTimeInSeconds = Math.floor(currentMusic.currentTime);
    const durationInSeconds = Math.floor(currentMusic.duration);

    // Convert the time to minutes and seconds
    const minutes = Math.floor(currentTimeInSeconds / 60);
    const dMinutes = Math.floor(durationInSeconds / 60);
    const seconds = currentTimeInSeconds % 60;
    const dSeconds = durationInSeconds % 60;

    // Display the current time
    document.querySelector(".songtime").innerHTML = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} / ${dMinutes
      .toString()
      .padStart(2, "0")}:${dSeconds.toString().padStart(2, "0")}`;

    // Control the seekbar
    document.querySelector(".circle").style.left =
      (currentMusic.currentTime / currentMusic.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentMusic.currentTime = (currentMusic.duration * percent) / 100;
  });

  document.querySelector(".hamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // previous and forward btns
  previous.addEventListener("click", (e) => {
    currentMusic.pause();
    let index = songs.indexOf(currentMusic.src);
    if (index - 1 >= 0) {
      playMusic(
        songs[index - 1]
          .split("/songs/")[1]
          .replace(".mp3", "")
          .replaceAll("%20", " ")
      );
    }
  });

  forward.addEventListener("click", (e) => {
    currentMusic.pause();
    let index = songs.indexOf(currentMusic.src);
    if (index + 1 < songs.length) {
      playMusic(
        songs[index + 1]
          .split("/songs/")[1]
          .replace(".mp3", "")
          .replaceAll("%20", " ")
      );
    }
  });

  vol.addEventListener("change", (e) => {
    console.log(e.target.value);
    currentMusic.volume = e.target.value / 100;
    if (currentMusic.volume == 0) {
      document.querySelector(".volBar").firstElementChild.src = "mute.svg";
    } else if (currentMusic.volume > 0) {
      document.querySelector(".volBar").firstElementChild.src = "sound.svg";
    }
  });
  document
    .querySelector(".volBar")
    .firstElementChild.addEventListener("click", (e) => {
      if (currentMusic.volume !== 0) {
        console.log("if happened");
        currentMusic.volume = 0;
        document.querySelector(".volBar").firstElementChild.src = "mute.svg";
      } else if (currentMusic.volume == 0) {
        console.log("else happened");
        currentMusic.volume = vol.value / 100;
        document.querySelector(".volBar").firstElementChild.src = "sound.svg";
      }
    });
}
main();
