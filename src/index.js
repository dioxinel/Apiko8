let baseURL = "https://api.themoviedb.org/3/";
let APIKEY = "21f53b102f9fcc68f706abfc92770539";
let baseImageURL = "https://image.tmdb.org/t/p/";
let posterSize = "w300";

let getMainList = function() {
  //Check input, if it empty create url for trending movie, else create url to search
  let url;
  let search = document.getElementById("search");
  if (!search.value) {
    url = "".concat(baseURL, "trending/movie/week?api_key=", APIKEY);
  } else {
    url = "".concat(
      baseURL,
      "search/movie?api_key=",
      APIKEY,
      "&query=",
      search.value
    );
  }

  fetch(url)
    .then(result => result.json())
    .then(data => {
      refreshOutput();
      let output = document.getElementById("output");
      for (let movie in data.results) {
        createTitle(movie, data, output);
      }
    });
};

let refreshOutput = function() {
  let output = document.getElementById("output");
  output.remove();
  let outputObj = document.createElement("div");
  outputObj.id = "output";
  let page = document.getElementById("page");
  page.append(outputObj);
};

let createTitle = function(movie, data, outputObj) {
  let dataName = data.results[movie];
  let TV_Show = displayName(dataName);
  let TV = TV_Show.lastChild;
  TV.data = data;
  TV.movie = movie;
  TV.addEventListener("click", discription);
  outputObj.append(TV_Show);
};

let displayName = function(data) {
  let name = data.original_title;
  let object = document.createElement("li");
  let objectName = document.createElement("a");
  objectName.innerHTML = name;
  object.append(objectName);
  return object;
};

let discription = function() {
  refreshOutput();
  let discrip = document.createElement("div");
  discrip.append(displayPoster(this.data.results[this.movie]));
  let name = document.createElement("h1");
  name.innerHTML = this.innerHTML;
  discrip.append(name);
  discrip.append(displayOverview(this.data.results[this.movie]));
  discrip.append(displayRecommendations(this.data.results[this.movie]));
  let output = document.getElementById("output");
  output.append(discrip);
};

let displayOverview = function(data) {
  let overviewObj = document.createElement("p");
  let overview = data.overview;
  overviewObj.innerHTML = overview;
  return overviewObj;
};

let displayPoster = function(data) {
  let posterShow = document.createElement("img");
  posterShow.alt = "Постер відсутній";
  let posterPath = data.poster_path;
  posterShow.src = "".concat(baseImageURL, posterSize, posterPath);
  return posterShow;
};

let displayRecommendations = function(data) {
  let recommendations = document.createElement("div");
  let recom = document.createElement("h3");
  recom.innerHTML = "Recomendations";
  recommendations.append(recom);
  let movieId = data.id;
  let numOfRecomendations = 3;
  let url = "".concat(
    baseURL,
    "movie/",
    movieId,
    "/recommendations?api_key=",
    APIKEY,
    "&language=en-US&page=1"
  );
  fetch(url)
    .then(result => result.json())
    .then(data => {
      for (let movie in data.results) {
        numOfRecomendations--;
        createTitle(movie, data, recommendations);
        if (numOfRecomendations === 0) {
          break;
        }
      }
    });
  return recommendations;
};

document.addEventListener("DOMContentLoaded", getMainList);

let button = document.getElementById("but");
button.addEventListener("click", getMainList);
window.setTimeout(getMainList, 3000);
