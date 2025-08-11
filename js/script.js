let currentsong = new Audio();

let songs;
let currfolder;
   
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Round to nearest whole second
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}



async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)

    // let a = await fetch("/songs/")

    let response = await a.text();

    console.log(response)

    let div = document.createElement("div")

    div.innerHTML = response;

    let as = div.getElementsByTagName("a")

    console.log(as)

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
    
       <img class="invert" src="img/music.svg" alt="">
                 <div class="info">
                    <div>  ${song.replaceAll("%20", " ")}</div>
                    <div>Harry</div>
                 </div>
                <div class="playnow">
                    <span>PLay Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
    
</li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });


}
const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg";
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"


}


async function displayAlbums() {
    let a = await fetch(`/songs/`)


    let response = await a.text();

    console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0]);
            let a = await fetch(`/songs/${folder}/info.json`)


            let response = await a.json();
            console.log(response)

            cardcontainer.innerHTML += `<div data-folder="${folder}"  class="card"> 
                        <div  class="play">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"
                                fill="none"
                                style="background-color: rgb(39, 207, 39); border-radius: 50%; padding: 6px; display: block; margin: auto;">
                                <path d="M8 5v14l11-7L8 5z" fill="black" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/logo.jpg.png" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    };

    Array.from(document.getElementsByClassName("card")).forEach(e => {
     
        e.addEventListener("click", async item => {
            await getsongs(`songs/${item.currentTarget.dataset.folder}`);
        });
    });


}
async function main() {
    await getsongs("songs/cs")
    playmusic(songs[0], true)

    displayAlbums()

    console.log(songs)



    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play(); // Corrected: added parentheses
            play.src = "img/pause.svg";
        } else {
            currentsong.pause(); // Corrected: added parentheses
            play.src = "img/play.svg";
        }
    });


    currentsong.addEventListener("timeupdate", () => {
        const currentTime = currentsong.currentTime;
        const duration = currentsong.duration;

        if (!isNaN(duration)) {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentTime)}/${formatTime(duration)}`;
        } else {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentTime)}/00:00`;
        }

        // Corrected line
        document.querySelector(".circle").style.left = (currentTime / duration) * 100 + "%";
    });
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration) * percent / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        console.log("previous clicked")
        console.log(currentsong)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1])
        }

    })

    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1])
        }
    });
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e);
        console.log(e, e.target, e.target.value);
        currentsong.volume = parseInt(e.target.value) / 100;
    });

document.querySelector(".volume >img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg")
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        currentsong.volume=0
    }
    else{
        e.target.src=e.target.src.replace("mute.svg" ,"volume.svg",)
          currentsong.volume=.10;
          document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }
})


}


main();

