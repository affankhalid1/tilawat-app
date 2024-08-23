
let currentTilawat = new Audio();
let Tilawats;
let currfolder;

function secondstoTime(seconds){

  if(isNaN(seconds) || seconds < 0){
    return "00:00"
  }
  // Calculate minutes and seconds 
  const minutes = Math.floor(seconds/60);
  const remainingSeconds = Math.floor(seconds%60);

  // Formatted minutes and seconds with leading zeroes if needed
  const formattedminutes = minutes<10? '0'+minutes: minutes;
  const formattedseconds = remainingSeconds<10? '0'+remainingSeconds: remainingSeconds;
   
  // Return the formatted time as a string
  return `${formattedminutes}:${formattedseconds}`;
}




async function getTilawat(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}`);
  let response = await a.text();


  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
     Tilawats = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      Tilawats.push(element.href.split(`/${currfolder}/`)[1]);
    }
  }



  // Show all the songs in the Playlist
  let tilawatUL = document.querySelector(".tilawatList").getElementsByTagName("ul")[0];
  tilawatUL.innerHTML = ""
  for (const tilawat of Tilawats) {
    tilawatUL.innerHTML = tilawatUL.innerHTML +
      `<li>
                <img src="img/Quran.svg" alt="" />
                <div class="info">
                  <div>${tilawat.replaceAll("%20", " ")}</div>
                  <div>${decodeURI(folder.split("/").slice(-1)[0])}</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                <img src="img/play.svg" alt="" />
              </div>
              
        </li>`;
  }
        // Attach an Eventlistener to each Tilawat
        Array.from(document.querySelector(".tilawatList").getElementsByTagName("li")).forEach(e => {
          
          e.addEventListener("click", element=> {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
          })
        });

        return Tilawats;
}


const playMusic = (track, pause = false) =>{

  currentTilawat.src = `/${currfolder}/`+track
  if(!pause){
    currentTilawat.play();
    play.src = "img/pause.svg"
  }

  document.querySelector(".Tilawatinfo").innerHTML = decodeURI(track)
  document.querySelector(".Tilawattime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
  let a = await fetch("/tilawat/")
  let response = await  a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let Anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(Anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if(e.href.includes("/tilawat"))
    {
      let folder = e.href.split("/").slice(-2)[0]
      // Get thje meat data of the folder
      let a = await fetch(`/tilawat/${folder}/info.json`);
      let response = await a.json()

      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 124.46 124.46"
                >
                  <defs>
                    <style>
                      .cls-1 {
                        fill: #1fdf64;
                      }
                      .cls-2 {
                        fill: #050505;
                      }
                    </style>
                  </defs>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                      <circle class="cls-1" cx="62.23" cy="62.23" r="62.23" />
                      <polygon
                        class="cls-2"
                        points="88.39 62.23 49.15 39.57 49.15 84.89 88.39 62.23"
                      />
                    </g>
                  </g>
                </svg>
              </div>

              <img src="/Tilawat/${folder}/cover.jpeg" alt="" />
              <h3>${response.title}</h3>
              
            </div>`
    }
  }
  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=> {
    e.addEventListener("click", async item=> {
     Tilawats = await getTilawat(`tilawat/${item.currentTarget.dataset.folder}`);
     playMusic(Tilawats[0])
    })
  })
}

async function main() {

          // Get The List of all the songs
          await getTilawat("tilawat/Abdul-Rahman-Al-sudais");

          playMusic(Tilawats[0], true)

          // Display All the Albums on the page
          displayAlbums()

          // Add an each EventListener to play, next and previous
          play.addEventListener("click",()=> {
            if(currentTilawat.paused){
              currentTilawat.play()
              play.src = "img/pause.svg";
            }
            else
            {
              currentTilawat.pause()
              play.src = "img/play.svg";
            }
          })

          // Listen for timeupdate event
          currentTilawat.addEventListener("timeupdate", ()=> {
            document.querySelector(".Tilawattime").innerHTML = `${secondstoTime( currentTilawat.currentTime)} / ${secondstoTime(currentTilawat.duration)}`
            document.querySelector(".circle").style.left = (currentTilawat.currentTime/currentTilawat.duration)*100 +"%"
          }) 

        // Add an Event Listener to Seekbar
        document.querySelector(".seekbar").addEventListener("click", e=> {
          let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
           document.querySelector(".circle").style.left = percent +"%"
           currentTilawat.currentTime = ((currentTilawat.duration)*percent/100)
        })

        // Add an Event listener to Hamburger
        document.querySelector(".hamburger").addEventListener("click", ()=> {
          document.querySelector(".left").style.left = "0"
        })

        // Add an Event Listener to close button
        document.querySelector(".close").addEventListener("click",()=> {
          document.querySelector(".left").style.left = "-120%"
        })

        // Add an Event Listener to previous button 
        previous.addEventListener("click", ()=> {
          currentTilawat.pause()
          console.log("Previous Clicked")
          let index = Tilawats.indexOf(currentTilawat.src.split("/").slice(-1) [0])
          if((index-1)>= 0){
            playMusic(Tilawats[index-1])
          }
        })

          // Add an Event Listener to next button 
          next.addEventListener("click", ()=> {
            console.log("Next clicked")
            currentTilawat.pause()
            let index = Tilawats.indexOf(currentTilawat.src.split("/").slice(-1)[0])
            if((index+1) < Tilawats.length){
              playMusic(Tilawats[index+1])
            }

          })

          // Add an Event Listener to volume
          document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            console.log("Setting volume to ", e.target.value, "/100")
            currentTilawat.volume = parseInt(e.target.value)/100
            if(currentTilawat.volume>0){
              document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
            }
          })
        
          // Add an Event Listener to mute the  track
           document.querySelector(".volume>img").addEventListener("click", e=> {
            if(e.target.src.includes("img/volume.svg"))
            {
              e.target.src = e.target.src.replaceAll("img/volume.svg","img/mute.svg");
              currentTilawat.volume = 0;
              document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else{
              e.target.src = e.target.src.replaceAll("img/mute.svg","img/volume.svg");
              currentTilawat.volume = .10
              document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            }
           })
        
          
      
}

main()
