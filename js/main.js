let elMovList = document.querySelector('.movies__list')
let partMovies = movies.slice(0, 100)
fnRender(partMovies)

let count = 0;

function fnRender(data) {
  let arrLocDataHeart = JSON.parse(window.localStorage.getItem('locdata')) || [];
  elMovList.innerHTML = ''
  data.forEach((item, index) => {
    let newLi = document.createElement('li')
    newLi.classList = "movies__item"
    newLi.innerHTML = `
    <div class="movies__card">
    <img src="https://i.ytimg.com/vi/${item.ytid}/hqdefault.jpg?" alt="">
    <div class="card__info">
      <h3 class="text-light">${item.Title.toString()
        .split("")
        .slice(0, 12)
        .join("")}</h3>
      <div class="d-flex align-items-center justify-content-between fs-4">
        <p class="text-secondary">${item.movie_year}</p>
        <b class="text-secondary text-warning">${item.imdb_rating}</b>
      </div>
        <p class="fs-4 text-light">${item.Categories
        .toString()
        .split("")
        .slice(0, 15)
        .join("")}</p>
      <div class="d-flex align-items-center justify-content-between text-light">
        <button onclick="fnMoreInfo('${item.ytid}')" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">more</button>
        <i onclick="fnAddLocData('${item.ytid}')" 
        class="${arrLocDataHeart.find((i)=>i.ytid == item.ytid) ? "bi bi-heart-fill": 
        "bi bi-heart"}"></i>
      </div>
    </div>
  </div>`
    elMovList.appendChild(newLi)
  })
}

function fnYear(value) {
  console.log(value);
  if (value == "New") {
    fnRender(partMovies.sort((a, b) => b.movie_year - a.movie_year))
  } else {
    fnRender(partMovies.sort((a, b) => a.movie_year - b.movie_year))
  }
}

function fnRating(value) {
  console.log(value);
  if (value == "Max") {
    fnRender(partMovies.sort((a, b) => b.imdb_rating - a.imdb_rating))
  } else {
    fnRender(partMovies.sort((a, b) => a.imdb_rating - b.imdb_rating))
  }
}

let arrCategory = []
partMovies.forEach((item) => {
  if (!arrCategory.includes(item.Categories)) {
    arrCategory.push(item.Categories);
  }
})
arrCategory.forEach((item) => {
  let newOption = document.createElement('option')
  newOption.textContent = item
  document.querySelector('.sel__category').appendChild(newOption)
})

function fnCategory(value) {
  let filMov = partMovies.filter((item) => item.Categories == value)
  fnRender(filMov)
  if (filMov.length <= 3) {
    elMovList.style.justifyContent = 'space-around';
  }
}


let elModalDialog = document.querySelector(".modal-dialog")
function fnMoreInfo(id){
  let item = partMovies.find(i=> i.ytid == id);
  elModalDialog.innerHTML =
    `<div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">${item.Title}</h1>
      <button onclick="pauseVideo()" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body " id="youtubePlayer">
      <iframe  width="100%" height="400" src="https://www.youtube.com/embed/${item.ytid}" title="КОГДА НОВЫЙ ВОЗВРАТ UC?! УТЕЧКИ НОВОЙ КОЛЛАБОРАЦИИ?! ТРАНСФОРМЕРЫ В PUBG MOBILE?!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      <p>${item.summary}</p>
    </div>
    <div class="modal-footer d-flex align-items-center justify-content-between">
      <span class="d-flex align-items-center">
        <p>${Math.floor(item.runtime / 60) +":" + item.runtime % 60}</p>
        <p class="ms-3 bg-success p-2 text-light ">${item.Categories}</p>
      </span>
      <span>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button class="btn btn-primary">${item.language}</button>
      </span>
    </div>
  </div>
  `
}

let elFavMov = document.querySelector('.favourite__move')
let locData = []
function fnAddLocData(id){
    if(window.localStorage.getItem('locdata')){
    locData = JSON.parse(window.localStorage.getItem('locdata'))
    }
    let item = partMovies.find(i=> i.ytid == id)
    if(locData.find((i)=> i.ytid == item.ytid)){
      window.localStorage.setItem('locdata', JSON.stringify(locData.filter((k)=> k.ytid != id)))
    }else{
    locData.push(item)
    window.localStorage.setItem('locdata', JSON.stringify(locData))
    }
    fnRender(partMovies)

}

function fnRenLoc() {
  elFavMov.innerHTML = ''
  let favouritMovie = JSON.parse(window.localStorage.getItem('locdata')) || [];
  if (favouritMovie !== null) {
    favouritMovie.forEach((item) => {
      let newLI = document.createElement('li')
      newLI.innerHTML = `
        <div class="border-1 d-flex align-items-center" onclick="fnMoreInfo('${item.ytid}')" 
        data-bs-toggle="modal" data-bs-target="#exampleModal"> 
          <img height="80" src="https://i.ytimg.com/vi/${item.ytid}/hqdefault.jpg?" alt="">
          <p class="ms-3">${item.Title.toString()
            .split("")
            .slice(0, 12)
            .join("")}</p>
            </div>
        `
      elFavMov.appendChild(newLI)
    })
  }
}
fnRenLoc()

function pauseVideo(){
    var youtubePlayer = document.getElementById('youtubePlayer');
    setTimeout(()=>{
      youtubePlayer.innerHTML = ''
    },500)
}

let countt = 0
function partPagenation(part){
  count = part
  fnRender(partMovies.slice((part - 1) * 10,part * 10));
}

function fnPagenation(val) {
  if (val === 'prev' && count > 1) {
    count = count - 1;
  } else if (val === 'next') {
    count = count + 1;
  }
  let startIndex = (count - 1) * 10;
  let endIndex = count * 10;
  fnRender(partMovies.slice(startIndex, endIndex));
}

for(let i = 1; i<= partMovies.length / 10; i++){
    document.querySelector('.pagenation__inner').innerHTML += `
    <li class="page-item"><button onclick="partPagenation(${i})"
    class="page-link bg-light text-black fw-bold">${i}</button></li>
      `
}