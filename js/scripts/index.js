const API_KEY = '01fa44983892420ecbcc6eaae70820a5';
const IMAGE_PATH = 'https://image.tmdb.org/t/p/original/';
const language = 'pt-BR';
const region = 'BR';

function ramdomNumber() {
  return Math.floor(Math.random()*30) + 1;
}

const urlMovieDiscover = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
const urlTopRatedMovies = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${language}&page=1`
const urlUpcomingMovies = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=${language}&page=1`;
const urlNowPlaying = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${language}&page=1`;
const urlAllGenres = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=${language}`;
const urlHeroRecomendations = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=true&page=${ramdomNumber()}&watch_region=${region}&with_watch_monetization_types=flatrate`;


const moviesDiscoverSection = document.getElementById('js-all-discover-movies');
const popularMoviesSection = document.getElementById('js-popular-movies');
const topRatedMoviesArea = document.getElementById('js-top-rated-movies');
const nowPlayingArea = document.getElementById('js-now-playing-area');
const genreArea = document.getElementById('js-genre-area');

const itemSelected = document.querySelectorAll('#js-item-selected');

const htmlDiv = document.documentElement;

const breakpointsValues = {
  300: {
    slidesPerView: 1.4,

  },
  500: {
    slidesPerView: 2.2,
  },
  600: {
    slidesPerView: 3,
  },
  850: {
    slidesPerView: 4,
  },
  1100: {
    slidesPerView: 5,
  }
}

const movieModal = document.getElementById('js-movie-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseTrailerModal = document.getElementById('btn-close-trailer');

const trailerModal = document.getElementById('js-modal-trailer');

const selectGenreArea = document.querySelectorAll('#js-select-genre');
const dropdownSelectArea = document.querySelectorAll('#js-dropdown-select');

const slidesHeroArea = document.getElementById('js-slides-hero');

const imgModalBg = document.getElementById('js-modal-bg');
const modalTitle = document.getElementById('js-modal-title');
const modalGenres = document.getElementById('js-modal-genres');
const modalOverview = document.getElementById('js-modal-overview');
const modalTagRating = document.getElementById('js-tag-rating');
const modalTagRuntime= document.getElementById('js-tag-runtime');
const modalTagReleaseDate = document.getElementById('js-tag-release-date');
const prodCompaniesArea = document.getElementById('js-production-companies');
const parentProdCompanies = document.getElementById('js-production-companies-div');

const loading = document.getElementById('js-loading');




/////////////

const actorsArea = document.getElementById('js-actors-area');

const iframeArea = document.getElementById('js-video-iframe');

const watchprovidersArea = document.getElementById('js-watch-providers-list');
const watchprovidersAreaDesktop = document.getElementById('js-watch-providers-list-desktop');
const textWhereToWatch = document.querySelectorAll('#js-watch-text');

async function returnMovieTrailers(movieId) {
  let urlTrailers = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=${language}`;

  let trailers = {};

  let trailersReturn = await fetch(urlTrailers).then(res => {return res.json()})
  .then(data => {return data.results})
  .catch(err => {
    console.log(err.message);
    loading.classList.remove('active');
  })

  let legendaryTrailer = await trailersReturn.find(trailer => {
    return trailer.name == 'Trailer Legendado' || 'Trailer Oficial Legendado';
  });

  let dubbedTrailer = await trailersReturn.find(trailer => {
    return trailer.name == 'Trailer Dublado';
  });

  let oficialDubbedTrailer = await trailersReturn.find(trailer => {
    return trailer.name == 'Trailer Oficial Dublado';
  });

  let allTrailers = {
    legendaryTrailer,
    dubbedTrailer,
    oficialDubbedTrailer
  }

  trailers.allTrailers = allTrailers;

  return trailers;
}

async function returnMovieDetails(movieId) {

  let urlDetails = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${language}`;
  let urlGetWatchProviders = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;
  let urlCast = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=${language}`;

  let movieDetails = {};

  let detailsReturn = await fetch(urlDetails).then(res => {return res.json()})
  .then(data => {return data})
  .catch(err => {
    console.log(err.message);
    movieModal.classList.remove('active');
    loading.classList.remove('active');
  });


  let {backdrop_path, genres, id, title, overview, production_companies, release_date, runtime, vote_average} = await detailsReturn;

  let details = {
    backdrop_path, genres, id, title, overview, production_companies, release_date: formatReleaseDate(release_date), 
    runtime: calculateDuration(runtime), 
    vote_average
  };

  movieDetails.details = details;

  let watchProvidersReturn = await fetch(urlGetWatchProviders).then(res => {return res.json()})
  .then(data => {return data.results})
  .catch(err => {
    console.log(err.message);
    movieModal.classList.remove('active');
    loading.classList.remove('active');
  });

  let {BR, US} = await watchProvidersReturn;



  if(BR) {
    let streamers = await BR.flatrate;


    let allBRProviders = [];

    streamers.forEach((streamer, index) => {
      if(index < 3) {
        let {logo_path, provider_name} = streamer;
        let {link} = BR;

        let providerBR = {
          logo_path, provider_name, link
        }

        allBRProviders.push(providerBR);
      }
    });



    movieDetails.allBRProviders = allBRProviders;
  } else if(US){
    let {link} = await US;

    let providerUS = {
      link
    }

    movieDetails.providerUS = providerUS;

  }

  let castReturn = await fetch(urlCast).then(res => {return res.json()})
  .then(data => {return data.cast})
  .catch(err => {
    console.log(err.message);
    movieModal.classList.remove('active');
    loading.classList.remove('active');
  })

  let actorsArray = [];


  castReturn.forEach(person => {
    if(person.known_for_department == 'Acting') {
      actorsArray.push(person);
    }
  })

  movieDetails.actors = actorsArray;


  return movieDetails;
}

function clearModalData() {
  modalTitle.textContent = '';
  modalOverview.textContent = '';
  modalTagRating.textContent = '';
  modalTagReleaseDate.textContent = '';
  modalTagRuntime.textContent = '';
  imgModalBg.innerHTML = '';
  prodCompaniesArea.innerHTML = '';
  actorsArea.innerHTML = '';
  watchprovidersArea.innerHTML = '';
  watchprovidersAreaDesktop.innerHTML = '';


}

const btnWatchTrailer = document.getElementById('btn-watch-trailer-modal');

async function handleModal(movieId) {
  htmlDiv.classList.add('lock-screen');
  loading.classList.add('active');
  let movieDetails = await returnMovieDetails(movieId);
  let trailers = await returnMovieTrailers(movieId);
  
  let {details} = movieDetails;
  let {allTrailers} = trailers;
  let {providerUS} = movieDetails;
  let {allBRProviders} = movieDetails;
  let {actors} = movieDetails;


  if(allTrailers.legendaryTrailer == undefined &&  allTrailers.dubbedTrailer == undefined && allTrailers.oficialDubbedTrailer == undefined ) {
    btnWatchTrailer.style.display = 'none';
  } else {
    btnWatchTrailer.style.display = 'inline-block';

    btnWatchTrailer.setAttribute('movie-id', '');
    btnWatchTrailer.children[0].children[0].setAttribute('movie-id', '');
    btnWatchTrailer.children[0].children[1].setAttribute('movie-id', '');
  
    btnWatchTrailer.setAttribute('movie-id', movieId);
    btnWatchTrailer.children[0].children[0].setAttribute('movie-id', movieId);
    btnWatchTrailer.children[0].children[1].setAttribute('movie-id', movieId);
  }

      
  let {backdrop_path, genres, overview, production_companies, release_date, runtime, title, vote_average} = details;

  let imgBg = document.createElement('img');
  imgBg.setAttribute('src', IMAGE_PATH+backdrop_path);
  imgBg.style.animation = 'scaleIn .8s cubic-bezier(.42,.61,.27,1.03)'
  imgModalBg.appendChild(imgBg);
  modalTitle.textContent = title;
  modalOverview.textContent = overview;

  
  if(modalOverview.textContent.length <= 181) {
    btnViewAllOverView.style.display = 'none';
  } else {
    btnViewAllOverView.style.display = 'block';

  }
  modalTagRating.textContent = vote_average.toFixed(1);
  modalTagRuntime.textContent = runtime;
  modalTagReleaseDate.textContent = release_date;

  prodCompaniesArea.innerHTML = '';

  modalGenres.textContent = '';

  genres.forEach((genre, index )=> {

    if(index < 5) {
      modalGenres.textContent += genre.name + ' - ';

    }

  })
  let genreMovieSliced = modalGenres.textContent.slice(0, -3)
  modalGenres.textContent = genreMovieSliced;

  production_companies.forEach((company, index) => {
    if(index < 3) {
      if(company.logo_path) {
        let li = document.createElement('li');
        let img = document.createElement('img');
        img.setAttribute('src', IMAGE_PATH+company.logo_path);
        li.append(img);
        parentProdCompanies.style.display = 'block';
        prodCompaniesArea.appendChild(li);
      }

    } 


  })


  if(allBRProviders) {

    allBRProviders.forEach((streamer) => {
      let {logo_path, provider_name, link} = streamer;

        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('href', link)
        let img = document.createElement('img');
        img.setAttribute('alt', provider_name);
        img.setAttribute('src', IMAGE_PATH+logo_path);
        a.appendChild(img);
        li.appendChild(a);
        li.style.animation = 'scaleOut .6s cubic-bezier(.42,.61,.27,1.03)'
        watchprovidersArea.appendChild(li);

        let liDesktop = document.createElement('li');
        let aDesktop = document.createElement('a');
        aDesktop.setAttribute('href', link)
        let imgDesktop = document.createElement('img');
        imgDesktop.setAttribute('alt', provider_name);
        imgDesktop.setAttribute('src', IMAGE_PATH+logo_path);
        aDesktop.appendChild(imgDesktop);
        liDesktop.appendChild(aDesktop);
        liDesktop.style.animation = 'scaleOut .6s cubic-bezier(.42,.61,.27,1.03)'

        watchprovidersAreaDesktop.appendChild(liDesktop);

        textWhereToWatch.forEach(text => {
          text.textContent = 'Onde assistir:';

        })
      
    })


  } else if(providerUS) {
    let {link} = providerUS;
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('href', link)
    let img = document.createElement('img');
    img.setAttribute('src', './assets/backdrops/the-db-movie-logo.png');
    a.appendChild(img);
    li.appendChild(a);
    li.style.animation = 'scaleOut .6s cubic-bezier(.42,.61,.27,1.03)'
    watchprovidersArea.appendChild(li);

    let liDesktop = document.createElement('li');
    let aDesktop = document.createElement('a');
    aDesktop.setAttribute('href', link)
    let imgDesktop = document.createElement('img');
    imgDesktop.setAttribute('src', './assets/backdrops/the-db-movie-logo.png');
    aDesktop.appendChild(imgDesktop);
    liDesktop.appendChild(imgDesktop);
    liDesktop.style.animation = 'scaleOut .6s cubic-bezier(.42,.61,.27,1.03)'
    watchprovidersAreaDesktop.appendChild(liDesktop);

    textWhereToWatch.forEach(text => {
      text.textContent = 'Onde assistir:';

    })

  } else if(!allBRProviders && !providerUS) {
    textWhereToWatch.forEach(text => {
      text.textContent = 'Indisponível nos streamings';

    })
  } else {
    textWhereToWatch.forEach(text => {
      text.textContent = '';

    });

  }

  actors.map((actor,index) => {

    if(index < 15) {
      if(actor.profile_path) {
            let swiperSlide = document.createElement('div');
            swiperSlide.classList = 'swiper-slide'
            let people = document.createElement('div');
            people.classList = 'people';
            let image = document.createElement('div');
            image.classList = 'image';
            let img = document.createElement('img');
            img.setAttribute('src', IMAGE_PATH+actor.profile_path);
            image.appendChild(img);
            let span = document.createElement('span');
            span.textContent = actor.name;
    
            people.append(image, span);
            swiperSlide.style.animation = 'fadeIn .6s cubic-bezier(0.65,0.05,0.36,1)'
            swiperSlide.append(people);
    
    
            actorsArea.appendChild(swiperSlide);
          }
    }

  })




  if(actorsArea.innerHTML !== '' && imgModalBg.innerHTML !== '') {
    loading.classList.remove('active');

  }


  movieModal.classList.add('active');
}

var swiperActors = new Swiper(".actors-swiper", {
  slidesPerView: 5,
  spaceBetween: 20,
  navigation: {
      nextEl: ".actors-swiper .swiper-button-next",
      prevEl: ".actors-swiper .swiper-button-prev",
    },
    breakpoints: {
      300: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      550: {
        slidesPerView: 3.5,
        spaceBetween: 15,
      },
      680: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      800: {
        slidesPerView: 4.7,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 20,
      }
    }
});

var swiperDiscover = new Swiper(".slide-movie-discover", {
  slidesPerView: 2,
  spaceBetween: 24,
  navigation: {
      nextEl: ".s-discover .swiper-button-next",
      prevEl: ".s-discover .swiper-button-prev",
    },
  breakpoints: {
    250: {
      slidesPerView: 1
    },
    560: {
      slidesPerView: 1.2
    },
    720: {
      slidesPerView: 1.5
    },
    991: {
      slidesPerView: 2
    }
  }

  
});

var swiperTopRated = new Swiper(".slide-movie.top-rated", {
  slidesPerView: 5,
  spaceBetween: 24,
  navigation: {
      nextEl: ".s-movie-cards.top-rated .swiper-button-next",
      prevEl: ".s-movie-cards.top-rated .swiper-button-prev",
    },
  breakpoints: breakpointsValues,
    
});

var swiperPopular = new Swiper(".slide-movie.popular", {
  slidesPerView: 5,
  spaceBetween: 24,
  navigation: {
      nextEl: ".s-movie-cards.popular .swiper-button-next",
      prevEl: ".s-movie-cards.popular .swiper-button-prev",
    },
    breakpoints: breakpointsValues,
});

var swiperNowPlaying = new Swiper(".slide-movie.now-playing", {
  slidesPerView: 5,
  spaceBetween: 24,
  navigation: {
      nextEl: ".s-movie-cards.now-playing .swiper-button-next",
      prevEl: ".s-movie-cards.now-playing .swiper-button-prev",
    },
    breakpoints: breakpointsValues,
});

var swiperByGenre = new Swiper(".slide-movie.by-genre", {
  slidesPerView: 5,
  spaceBetween: 24,
  navigation: {
      nextEl: ".s-movie-cards.by-genre .swiper-button-next",
      prevEl: ".s-movie-cards.by-genre .swiper-button-prev",
    },
    breakpoints: breakpointsValues,
});

var swiperByGenre = new Swiper(".slide-movie.by-genre", {
  slidesPerView: 5,
  spaceBetween: 24,
  navigation: {
      nextEl: ".s-movie-cards.by-genre .swiper-button-next",
      prevEl: ".s-movie-cards.by-genre .swiper-button-prev",
    },
    breakpoints: breakpointsValues,
});

btnWatchTrailer.addEventListener('click', (e) => {
  handleTrailerModal(e.target.getAttribute('movie-id'));
})

async function handleTrailerModal(movieId) {
  loading.classList.add('active');

  iframeArea.innerHTML = '';

  let {allTrailers} = await returnMovieTrailers(movieId);

  let {dubbedTrailer, legendaryTrailer, oficialDubbedTrailer} = allTrailers;

  function createIframe(key) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${key}`)
    iframe.setAttribute('title', 'Youtube video player');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', true);

    iframeArea.appendChild(iframe);


    btnCloseTrailerModal.addEventListener('click', () => {
      trailerModal.classList.remove('active');
      iframe.setAttribute('src', '');
    })

    if(iframeArea.innerHTML !== '') {
      trailerModal.classList.add('active');
      loading.classList.remove('active');
    }
  }

  if(dubbedTrailer) {
    createIframe(dubbedTrailer.key)
  } else if(oficialDubbedTrailer) {
    createIframe(oficialDubbedTrailer.key)
  } else if(legendaryTrailer) {
    createIframe(legendaryTrailer.key)
  }

  

}

function createMovieDiscoverCards(imgSource, name, movieId, genreIds, vote_average) {
  loading.classList.add('active');


  let genresMovie = [];

  let urlMovieGetDetails = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${language}`;


  let swiperSlide = document.createElement('div');
  swiperSlide.classList = 'swiper-slide';

  let cardMovie = document.createElement('button');
  cardMovie.classList = 'card-movie-discover';
  cardMovie.id = 'js-card-movie';
  cardMovie.setAttribute('movie-id', movieId);

  let image = document.createElement('div');
  image.classList = 'image';
  let imgCard = document.createElement('img');
  imgCard.setAttribute('src', IMAGE_PATH+imgSource);
  imgCard.setAttribute('movie-id', movieId);

  image.appendChild(imgCard);



  let about = document.createElement('div');
  about.classList = 'about';
  let tag = document.createElement('div');
  tag.classList = 'tag';
  let content = document.createElement('div');
  content.classList = 'content';
  let icon = document.createElement('div');
  icon.classList = 'icon';
  let imgIcon = document.createElement('img');
  imgIcon.setAttribute('src', './assets/icon-star.svg');
  let span = document.createElement('span');
  span.classList = 'info';
  span.textContent = vote_average.toFixed(1);
  icon.appendChild(imgIcon);
  content.appendChild(icon);
  if(vote_average != 0) {
    content.appendChild(span);
  }
  tag.appendChild(content);
  let titleDiv = document.createElement('div');
  titleDiv.classList = 'title';
  let titleMovie = document.createElement('h3');
  titleMovie.textContent = name;
  let genreMovie = document.createElement('p');

  axios({
    method: 'GET',
    url: urlMovieGetDetails
  })
  .then(res => {

    let genres = res.data.genres;
    genres.forEach((genre, index )=> {
      genresMovie.push(genre)

      if(index < 2) {
        genreMovie.textContent += genre.name + ' - ';

      }

    })
    let genreMovieSliced = genreMovie.textContent.slice(0, -3)
    genreMovie.textContent = genreMovieSliced;

    loading.classList.remove('active');

  })




    cardMovie.addEventListener('click', (e) => {
      handleModal(e.target.getAttribute('movie-id'));

      

    })
  


  titleDiv.appendChild(titleMovie);
  titleDiv.appendChild(genreMovie);
  about.appendChild(titleDiv);


  let infoBtn = document.createElement('div');
  infoBtn.classList = 'info-btn';
  infoBtn.setAttribute('movie-id', movieId);
  let imgInfobtn = document.createElement('img');
  imgInfobtn.setAttribute('src', './assets/icon-info.svg');
  infoBtn.appendChild(imgInfobtn);

  cardMovie.appendChild(image);
  cardMovie.appendChild(tag);
  cardMovie.appendChild(about);
  cardMovie.appendChild(infoBtn);
  


  swiperSlide.appendChild(cardMovie);
  swiperSlide.style.animation = 'fadeIn 1s cubic-bezier(.42,.61,.27,1.03)'



  moviesDiscoverSection.appendChild(swiperSlide);



  // moviesDiscoverSection.style.transform = 'translate3d(0px, 0px, 0px)';
}

function createTopRatedCards(imgSource, id, voteAvarage, index) {


  let swiperSlide = document.createElement('div');
  swiperSlide.classList = 'swiper-slide';
  
  let cardMovie = document.createElement('button');
  cardMovie.classList = 'card-movie-poster rating';
  cardMovie.id = 'js-card-movie';
  cardMovie.setAttribute('movie-id', id);

  let image = document.createElement('div');
  image.classList = 'image';
  let imgCard = document.createElement('img');
  imgCard.setAttribute('src', IMAGE_PATH+imgSource);
  imgCard.setAttribute('movie-id', id);

  image.appendChild(imgCard);

  let positionRating = document.createElement('div');
  positionRating.classList = 'position-rating';
  let spanPosition = document.createElement('span');
  spanPosition.textContent = index + 1;
  positionRating.appendChild(spanPosition);

  let tag = document.createElement('div');
  tag.classList = 'tag';
  let content = document.createElement('div');
  content.classList = 'content';
  let icon = document.createElement('div');
  icon.classList = 'icon';
  let imgIcon = document.createElement('img');
  imgIcon.setAttribute('src', './assets/icon-star.svg');
  let span = document.createElement('span');
  span.classList = 'info';
  span.textContent = voteAvarage.toFixed(1);
  icon.appendChild(imgIcon);
  content.appendChild(icon);
  if(voteAvarage != 0) {
    content.appendChild(span);
  }
  tag.appendChild(content);

  cardMovie.appendChild(image);
  cardMovie.appendChild(positionRating);
  cardMovie.appendChild(tag);
  swiperSlide.appendChild(cardMovie);
  swiperSlide.style.animation = 'fadeIn 1s cubic-bezier(.42,.61,.27,1.03)'



  topRatedMoviesArea.appendChild(swiperSlide);





  cardMovie.addEventListener('click', (e) => {
    handleModal(e.target.getAttribute('movie-id'));


  })

  // topRatedMoviesArea.style.transform = 'translate3d(0px, 0px, 0px)';

}

function createUpcomingCards(imgSource, id, voteAvarage, index) {


  let swiperSlide = document.createElement('div');
  swiperSlide.classList = 'swiper-slide';
  
  let cardMovie = document.createElement('button');
  cardMovie.classList = 'card-movie-poster';
  cardMovie.id = 'js-card-movie';
  cardMovie.setAttribute('movie-id', id);

  let image = document.createElement('div');
  image.classList = 'image';
  let imgCard = document.createElement('img');
  imgCard.setAttribute('src', IMAGE_PATH+imgSource);
  imgCard.setAttribute('movie-id', id);

  image.appendChild(imgCard);


  let tag = document.createElement('div');
  tag.classList = 'tag';
  let content = document.createElement('div');
  content.classList = 'content';
  let icon = document.createElement('div');
  icon.classList = 'icon';
  let imgIcon = document.createElement('img');
  imgIcon.setAttribute('src', './assets/icon-star.svg');
  let span = document.createElement('span');
  span.classList = 'info';
  span.textContent = voteAvarage.toFixed(1);
  icon.appendChild(imgIcon);
  content.appendChild(icon);
  if(voteAvarage != 0) {
    content.appendChild(span);
  }
  tag.appendChild(content);

  cardMovie.appendChild(image);
  cardMovie.appendChild(tag);
  swiperSlide.appendChild(cardMovie);
  swiperSlide.style.animation = 'fadeIn 1s cubic-bezier(.42,.61,.27,1.03)'


  popularMoviesSection.appendChild(swiperSlide);



  cardMovie.addEventListener('click', (e) => {
    handleModal(e.target.getAttribute('movie-id'));


  })

  // popularMoviesSection.style.transform = 'translate3d(0px, 0px, 0px)';
  
}

function createNowPlayingCards(imgSource, id, voteAvarage, index) {


  let swiperSlide = document.createElement('div');
  swiperSlide.classList = 'swiper-slide';
  
  let cardMovie = document.createElement('button');
  cardMovie.classList = 'card-movie-poster';
  cardMovie.id = 'js-card-movie';
  cardMovie.setAttribute('movie-id', id);

  let image = document.createElement('div');
  image.classList = 'image';
  let imgCard = document.createElement('img');
  imgCard.setAttribute('src', IMAGE_PATH+imgSource);
  imgCard.setAttribute('movie-id', id);

  image.appendChild(imgCard);


  let tag = document.createElement('div');
  tag.classList = 'tag';
  let content = document.createElement('div');
  content.classList = 'content';
  let icon = document.createElement('div');
  icon.classList = 'icon';
  let imgIcon = document.createElement('img');
  imgIcon.setAttribute('src', './assets/icon-star.svg');
  let span = document.createElement('span');
  span.classList = 'info';
  span.textContent = voteAvarage.toFixed(1);
  icon.appendChild(imgIcon);
  content.appendChild(icon);
  if(voteAvarage != 0) {
    content.appendChild(span);
  }
  tag.appendChild(content);

  cardMovie.appendChild(image);
  cardMovie.appendChild(tag);
  swiperSlide.appendChild(cardMovie);
  swiperSlide.style.animation = 'fadeIn 1s cubic-bezier(.42,.61,.27,1.03)'


  nowPlayingArea.appendChild(swiperSlide);




  cardMovie.addEventListener('click', (e) => {
    handleModal(e.target.getAttribute('movie-id'));


  })

  // nowPlayingArea.style.transform = 'translate3d(0px, 0px, 0px)';
  
}

function createDropdownSelect(genres) {
  genres.map(genre => {
    let li = document.createElement('li');
    let button = document.createElement('button');
    button.classList = 'genre-movie';
    button.id = 'js-genre-movie';
    let span = document.createElement('span');
    span.textContent = genre.name;
    span.setAttribute('genre-id', genre.id);

    button.appendChild(span);
    li.appendChild(button);

    dropdownSelectArea[0].appendChild(li);



    span.addEventListener('click', searchGenreMovie);
  })

}

function createDropdownSelectPage2(genres) {
  genres.map(genre => {
    let li = document.createElement('li');
    let button = document.createElement('button');
    button.classList = 'genre-movie';
    button.id = 'js-genre-movie';
    let span = document.createElement('span');
    span.textContent = genre.name;
    span.id = 'page-2';
    span.setAttribute('genre-id', genre.id);

    button.appendChild(span);
    li.appendChild(button);
    li.setAttribute('genre-id', genre.id);

    dropdownSelectArea[1].appendChild(li);

    

    span.addEventListener('click', (e) => {
      btnLoadMore.setAttribute('genre-id', '');

      searchGenreMovieAll(e);
    } );
  })

}

function createByGenreCards(imgSource, id, voteAvarage) {



  let swiperSlide = document.createElement('div');
  swiperSlide.classList = 'swiper-slide';
  
  let cardMovie = document.createElement('button');
  cardMovie.classList = 'card-movie-poster';
  cardMovie.id = 'js-card-movie';
  cardMovie.setAttribute('movie-id', id);

  let image = document.createElement('div');
  image.classList = 'image';
  let imgCard = document.createElement('img');
  imgCard.setAttribute('src', IMAGE_PATH+imgSource);
  imgCard.setAttribute('movie-id', id);

  image.appendChild(imgCard);


  let tag = document.createElement('div');
  tag.classList = 'tag';
  let content = document.createElement('div');
  content.classList = 'content';
  let icon = document.createElement('div');
  icon.classList = 'icon';
  let imgIcon = document.createElement('img');
  imgIcon.setAttribute('src', './assets/icon-star.svg');
  let span = document.createElement('span');
  span.classList = 'info';
  span.textContent = voteAvarage.toFixed(1);
  icon.appendChild(imgIcon);
  content.appendChild(icon);
  if(voteAvarage != 0) {
    content.appendChild(span);
  }
  tag.appendChild(content);



  cardMovie.appendChild(image);
  cardMovie.appendChild(tag);
  swiperSlide.appendChild(cardMovie); 
  swiperSlide.style.animation = 'fadeIn .6s cubic-bezier(.42,.61,.27,1.03)'
  genreArea.appendChild(swiperSlide);



  cardMovie.addEventListener('click', (e) => {
    
    handleModal(e.target.getAttribute('movie-id'));

  })




}

function calculateDuration(runtime) {
  let h = (runtime/60)|0;
  let m = runtime % 60;

  return `${h}h ${m}min`;
}

function formatReleaseDate(date) {
  let year = date.slice(0,4);
  let month = date.slice(5, 7);
  let day = date.slice(8, 10);

  return `${day}-${month}-${year}`;
}

function formatOverview(str) {

  if(Array.from(str).length > 150) {
    let newStr = str.slice(0,150).replace(' ', '') + '...';
    return newStr;
  } else {
    return str;
  }

}


async function createSlidesHero(movieId) {
  loading.classList.add('active');

  let genresMovie = [];

  let movieDetails = await returnMovieDetails(movieId);
  let trailers = await returnMovieTrailers(movieId);

  let {details} = movieDetails;
  let {allTrailers} = trailers;

  if(details.backdrop_path && details.vote_average && details.overview) {

    let {legendaryTrailer} = allTrailers;
  
    // slidesHeroArea
    let swiperSlide = document.createElement('div');
    swiperSlide.classList = 'swiper-slide';
  
    let movie = document.createElement('div');
    movie.classList = 'movie';
  
    let infoContainer = document.createElement('div');
    infoContainer.classList = 'info-container';
  
    let container = document.createElement('div');
    container.classList = 'container';
  
  
    let tags = document.createElement('div');
    tags.classList = 'tags';


    let tagRating = document.createElement('div');
    tagRating.classList = 'tag';
    let contentTagRating = document.createElement('div');
    contentTagRating.classList = 'content';
    let iconTagRating = document.createElement('div');
    iconTagRating.classList = 'icon';
    let imgIconTagRating = document.createElement('img');
    imgIconTagRating.setAttribute('src', './assets/icon-star.svg');
    let spanTagRating = document.createElement('span');
    spanTagRating.classList = 'info';
    spanTagRating.textContent = details.vote_average.toFixed(1);
    iconTagRating.appendChild(imgIconTagRating);
    contentTagRating.appendChild(iconTagRating);
    contentTagRating.appendChild(spanTagRating);
    tagRating.appendChild(contentTagRating);
  
    let tagReleaseDate = document.createElement('div');
    tagReleaseDate.classList = 'tag';
    let contentTagReleaseDate = document.createElement('div');
    contentTagReleaseDate.classList = 'content';
    let iconTagReleaseDate = document.createElement('div');
    iconTagReleaseDate.classList = 'icon';
    let imgIconTagReleaseDate = document.createElement('img');
    imgIconTagReleaseDate.setAttribute('src', './assets/icon-calendar.svg');
    let spanTagReleaseDate = document.createElement('span');
    spanTagReleaseDate.classList = 'info';
    iconTagReleaseDate.appendChild(imgIconTagReleaseDate);
    contentTagReleaseDate.appendChild(iconTagReleaseDate);
    contentTagReleaseDate.appendChild(spanTagReleaseDate);
    tagReleaseDate.appendChild(contentTagReleaseDate);
  
    let tagRuntime = document.createElement('div');
    tagRuntime.classList = 'tag';
    let contentTagRuntime = document.createElement('div');
    contentTagRuntime.classList = 'content';
    let iconTagRuntime = document.createElement('div');
    iconTagRuntime.classList = 'icon';
    let imgIconTagRuntime = document.createElement('img');
    imgIconTagRuntime.setAttribute('src', './assets/icon-clock.svg');
    let spanTagRuntime = document.createElement('span');
    spanTagRuntime.classList = 'info';
    iconTagRuntime.appendChild(imgIconTagRuntime);
    contentTagRuntime.appendChild(iconTagRuntime);
    contentTagRuntime.appendChild(spanTagRuntime);
    tagRuntime.appendChild(contentTagRuntime);
  
  
    tags.append(tagRating, tagRuntime, tagReleaseDate);
  
    let text = document.createElement('div');
    text.classList = 'text';
    text.setAttribute('data-swiper-parallax', '-15%');
    let h1 = document.createElement('h1');
    h1.textContent = details.title;
    let genreMovie = document.createElement('strong');
    let overviewParagraph = document.createElement('p');
    overviewParagraph.textContent = formatOverview(details.overview);
    text.append(h1, genreMovie, overviewParagraph);


  
    (details.genres).forEach((genre, index )=> {
      genresMovie.push(genre)
  
      if(index < 4) {
        genreMovie.textContent += genre.name + ' - ';
  
      }
  
    })


  
    let genreMovieSliced = genreMovie.textContent.slice(0, -3)
    genreMovie.textContent = genreMovieSliced;
  
    spanTagReleaseDate.textContent = details.release_date;
  
    spanTagRuntime.textContent = details.runtime;
  
    let btns = document.createElement('div');
    btns.classList = 'btns';
    btns.setAttribute('data-swiper-parallax', '1%');
  
    let btnPrimary = document.createElement('button');
    btnPrimary.classList = 'btn call-to-action btn-primary';
    btnPrimary.setAttribute('movie-id', details.id);
    let contentBtnPrimary = document.createElement('div');
    contentBtnPrimary.classList = 'content';
    let iconBtnprimary = document.createElement('div');
    iconBtnprimary.classList = 'icon';
    let imgBtnPrimary = document.createElement('img');
    imgBtnPrimary.setAttribute('src', './assets/icon-play.svg');
    iconBtnprimary.append(imgBtnPrimary);
    let spanBtnPrimary = document.createElement('span');
    spanBtnPrimary.textContent = 'Assistir trailer';
    spanBtnPrimary.setAttribute('movie-id', details.id);
    contentBtnPrimary.append(iconBtnprimary, spanBtnPrimary);
    btnPrimary.append(contentBtnPrimary);
    
    let btnSecondary= document.createElement('button');
    btnSecondary.classList = 'btn call-to-action btn-secondary';
    btnSecondary.setAttribute('movie-id', details.id);
    let contentBtnSecondary = document.createElement('div');
    contentBtnSecondary.classList = 'content';
    let iconBtnSecondary = document.createElement('div');
    iconBtnSecondary.classList = 'icon';
    let imgBtnSecondary = document.createElement('img');
    imgBtnSecondary.setAttribute('src', './assets/icon-info.svg');
    iconBtnSecondary.append(imgBtnSecondary);
    let spanBtnSecondary = document.createElement('span');
    spanBtnSecondary.textContent = 'Ver detalhes';
    spanBtnSecondary.setAttribute('movie-id', details.id);
    contentBtnSecondary.append(iconBtnSecondary, spanBtnSecondary);
    btnSecondary.append(contentBtnSecondary);
  
    btns.append(btnPrimary, btnSecondary);

    btnPrimary.addEventListener('click', (e) => {
      handleTrailerModal(e.target.getAttribute('movie-id'));
  
    })
  
    btnSecondary.addEventListener('click', (e) => {
      handleModal(e.target.getAttribute('movie-id'));
  
    })
    
  
    let navSwiper = document.createElement('div');
    navSwiper.classList = 'nav-swiper';
  
    let swBtnPrev = document.createElement('div');
    swBtnPrev.classList = 'sw swiper-button-prev hero';
    let imgArrowLeft = document.createElement('img');
    imgArrowLeft.setAttribute('src', './assets/icon-arrow-left.svg')
    swBtnPrev.append(imgArrowLeft);
  
    let swBtnNext = document.createElement('div');
    swBtnNext.classList = 'sw swiper-button-next hero';
    let imgArrowRight = document.createElement('img');
    imgArrowRight.setAttribute('src', './assets/icon-arrow-right.svg')
    swBtnNext.append(imgArrowRight);
  
    navSwiper.append(swBtnPrev, swBtnNext);
  
    let image = document.createElement('div');
    image.classList = 'image parallax-bg';
    image.setAttribute('data-swiper-parallax', '5%');
    let imgBg = document.createElement('img');
    imgBg.setAttribute('src', IMAGE_PATH+details.backdrop_path);
    image.append(imgBg);
  
    container.append(tags, text, btns, navSwiper);
  
    infoContainer.append(container);
  
    movie.append(infoContainer, image);
  
    swiperSlide.append(movie);
  
    slidesHeroArea.appendChild(swiperSlide);
  
    if(allTrailers.legendaryTrailer == undefined &&  allTrailers.dubbedTrailer == undefined && allTrailers.oficialDubbedTrailer == undefined ) {
      btnPrimary.style.display = 'none';
    } else {
      btnPrimary.style.display = 'inline-block';
      let video = document.createElement('div');
      video.classList = 'video';

  
      function createIframe(key) {
        let iframeVideoEmbebed = document.createElement('iframe');
        video.appendChild(iframeVideoEmbebed);
        iframeVideoEmbebed.setAttribute('src', `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&loop=1&playlist=${key}`)
        iframeVideoEmbebed.setAttribute('title', 'Youtube video player');
        iframeVideoEmbebed.setAttribute('frameborder', 0);
        iframeVideoEmbebed.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframeVideoEmbebed.setAttribute('allowfullscreen', true);

        image.appendChild(video);
      }

      createIframe(legendaryTrailer.key);
    }

    loading.classList.remove('active');



  }

  window.addEventListener('keydown', (e) => {
    if(e.key == 'ArrowLeft') {
      swiperHero.slidePrev();
    } else if(e.key == 'ArrowRight') {
      swiperHero.slideNext();
    }
  })
  
  var swiperHero = new Swiper(".swiper-hero", {
    speed: 600,
    parallax: true,
    effect: 'fade',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // autoplay: {
    //   delay: 9000,
    //   disableOnInteraction: true,
    // },
    navigation: {
      nextEl: ".swiper-button-next.hero",
      prevEl: ".swiper-button-prev.hero",
    },
  });

}

/////////////

function searchDiscoverMovies(url) {

  axios({
    method: 'GET',
    url
  })
  .then(res => {
    const {data} = res;
    const {results} = data;
    loading.classList.add('active');


    results.forEach(result => {
      let {backdrop_path, title, id, genre_ids, vote_average} = result;
      if(backdrop_path && vote_average != 0) {
        createMovieDiscoverCards(backdrop_path, title, id, genre_ids, vote_average);
      }



    })

    loading.classList.remove('active');

  })

  
}


function searchTopRatedMovies(url) {

  axios({
    method: 'GET',
    url
  })
  .then(res => {
    const {data} = res;
    const {results} = data;
    loading.classList.add('active');


    results.forEach((result, index) => {
      let {poster_path, id, vote_average} = result;
      if(poster_path && vote_average != 0) {
        createTopRatedCards(poster_path, id, vote_average, index);

      }


    })
    loading.classList.remove('active');

  })
}

function searcUpcomingMovies(url) {
  axios({
    method: 'GET',
    url
  })
  .then(res => {
    const {data} = res;
    const {results} = data;
    loading.classList.add('active');


    results.forEach((result, index) => {
      let {poster_path, id, vote_average} = result;
      if(poster_path && vote_average != 0) {
        createUpcomingCards(poster_path, id, vote_average, index);

      }


    })

    loading.classList.remove('active');

  })
}

function searchNowPlayingMovies(url) {

  axios({
    method: 'GET',
    url
  })
  .then(res => {
    const {data} = res;
    const {results} = data;
    loading.classList.add('active');


    results.forEach((result, index) => {
      let {poster_path, id, vote_average} = result;
      if(poster_path && vote_average != 0) {
        createNowPlayingCards(poster_path, id, vote_average, index);

      }


    })
    loading.classList.remove('active');

  })
}

function searchAllGenres(url) {
  axios({
    method: 'GET',
    url
  })
  .then(res => {
    const {genres} = res.data
    createDropdownSelect(genres);
    createDropdownSelectPage2(genres);
  })
}

function searchGenreMovie() {

  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${this.getAttribute('genre-id')}&watch_region=BR&with_watch_monetization_types=flatrate`;

  let allMovies = [];
 

  itemSelected[0].textContent = this.textContent;
  itemSelected[0].setAttribute('genre-id', this.getAttribute('genre-id'));



  loading.classList.add('active');

  genreArea.innerHTML = ''; 

  axios({
    method: 'GET',
    url
  })
  .then(res => {
    let {results} = res.data;

    results.forEach(result => {
      let {poster_path, id, vote_average} = result;
      if(poster_path && vote_average != 0) {
        let iMovie = {
          poster_path, id, vote_average
        }
        
        allMovies.push(iMovie);
        
        
      }

      
    })
    loading.classList.remove('active');

  });

  let url2 = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=2&with_genres=${this.getAttribute('genre-id')}&watch_region=BR&with_watch_monetization_types=flatrate`;
  
  axios({
    method: 'GET',
    url: url2
  })
  .then(res => {
    let {results} = res.data;
  
    results.forEach(result => {
      let {poster_path, id, vote_average} = result;
      if(poster_path && vote_average != 0) {
        let iMovie = {
          poster_path, id, vote_average
        }
        allMovies.push(iMovie)

      }
  
    })
      
    allMovies.forEach(movie => {
      let {poster_path, id, vote_average} = movie;
      createByGenreCards(poster_path, id, vote_average);

    })
    loading.classList.remove('active');

  })



}

function searchGenreMovieAll(e) {
  paginator2 = 1;

  let genreId = e.target.getAttribute('genre-id');

  btnLoadMore.setAttribute('genre-id', genreId);

  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${e.currentTarget.getAttribute('genre-id')}&watch_region=BR&with_watch_monetization_types=flatrate`;

  let movieArray = [];

  itemSelected[1].textContent = e.currentTarget.textContent;

  itemSelected[1].setAttribute('genre-id', e.currentTarget.getAttribute('genre-id'));

  btnLoadMore.style.display = 'block';

  allMoviesArea.innerHTML = '';

  let lenghtAllMovies = allMoviesArea.querySelectorAll('.card-movie-poster').length;



  btnLoadMore.style.display = 'block';


  if(lenghtAllMovies == '') {
    axios({
      method: 'GET',
      url
    })
    .then(res => {
      let {results} = res.data;
  
      results.forEach(result => {
        let {poster_path, id, vote_average} = result;
        if(poster_path && vote_average != 0) {
          createAllCardsMovie(id, poster_path, vote_average, false);
        }
  
        
      })
      loading.classList.remove('active');
  
    });

    
  } 







}

async function searchHeroRecomendations(url) {

  let heroRecomendations = await fetch(url)
  .then(res => {
    return res.json();
  })
  .then(data => {
    let {results} = data;

    return results;

  })
  .catch(err => {
    console.log(err.message);
    movieModal.classList.remove('active');
    loading.classList.remove('active');
  })

  heroRecomendations.forEach((result, index) => {
    let {id}= result;

    if(index<10) {
      createSlidesHero(id);
    }

  })

  
}

/////////////

if(moviesDiscoverSection) {
  searchDiscoverMovies(urlMovieDiscover)

}

if(topRatedMoviesArea) {
  searchTopRatedMovies(urlTopRatedMovies);

}

if(popularMoviesSection) {
  searcUpcomingMovies(urlUpcomingMovies);

}

if(nowPlayingArea) {
  searchNowPlayingMovies(urlNowPlaying);

}

if(genreArea) {
  searchAllGenres(urlAllGenres);

}

// searchActionMovies();

if(slidesHeroArea) {
  searchHeroRecomendations(urlHeroRecomendations);

}


/////////////


if(selectGenreArea) {
  selectGenreArea.forEach(select => {
    select.addEventListener('click', (e) => {
      selectGenreArea.forEach(select => {
        select.classList.toggle('active');
      })
    })
  })

}


btnCloseModal.addEventListener('click', () => {
  htmlDiv.classList.remove('lock-screen');
  movieModal.classList.remove('active');
  clearModalData();
  loading.classList.remove('active');
})



const btnOpenMenu = document.getElementById('js-btn-menu');
const btnCloseMenu = document.getElementById('js-btn-close-menu');
const menuMobile = document.getElementById('js-mobile-menu');

btnOpenMenu.addEventListener('click', () => {
  menuMobile.classList.add('active');
});

btnCloseMenu.addEventListener('click', () => {
  menuMobile.classList.remove('active');
})

const btnViewAllOverView = document.getElementById('js-btn-view-all-overview');
const boxModal = document.getElementById('js-modal-box');

if(btnViewAllOverView) {
  btnViewAllOverView.addEventListener('click', (e) => {
    boxModal.classList.toggle('active');
    
  })
}

const btnViewAllMovies = document.querySelectorAll('#btn-view-all-movies');
const allMoviesSection = document.getElementById('js-all-movies-section');
const mainArea = document.getElementById('main-area');
const navHeader = document.getElementById('js-nav-header');
const titleAllMovies = document.getElementById('title-type-all-movies');
const allMoviesArea = document.getElementById('js-all-movies-area');
const btnLoadMore = document.getElementById('btn-load-more');
const btnBack = document.getElementById('js-back-btn');
const header = document.getElementById('js-header');
let isSearchArea = false;
const searchResultArea = document.getElementById('js-movies-search-result');


if(allMoviesArea.querySelectorAll('.card-movie-poster').length == '') {
  btnLoadMore.style.display = 'none';
} else {
  btnLoadMore.style.display = 'block';

}

const sectionClassification = [
  {
    typeSection:  'vale-a-pena-ver',
    titleSection: 'Descubra',
    url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  },
  {
    typeSection:  'top-mais-avaliados',
    titleSection: 'Top mais avaliados',
    url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${language}&page=1`
  },
  {
    typeSection:  'novos',
    titleSection: 'Novos',
    url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=${language}&page=1`
  },
  {
    typeSection:  'nos-cinemas',
    titleSection: 'Nos cinemas',
    url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${language}&page=1`
  },
  {
    typeSection:  'por-genero',
    titleSection: 'Populares por gênero',
    url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${language}&page=1`
  },
];

function createAllCardsMovie(id, imgSource, voteAvarage, isSearchArea) {
  let cardMovie = document.createElement('button');
  cardMovie.classList = 'card-movie-poster all-movies';
  cardMovie.id = 'js-card-movie';
  cardMovie.setAttribute('movie-id', id);

  let image = document.createElement('div');
  image.classList = 'image';
  let imgCard = document.createElement('img');
  imgCard.setAttribute('src', IMAGE_PATH+imgSource);
  imgCard.setAttribute('movie-id', id);

  image.appendChild(imgCard);


  let tag = document.createElement('div');
  tag.classList = 'tag';
  let content = document.createElement('div');
  content.classList = 'content';
  let icon = document.createElement('div');
  icon.classList = 'icon';
  let imgIcon = document.createElement('img');
  imgIcon.setAttribute('src', './assets/icon-star.svg');
  let span = document.createElement('span');
  span.classList = 'info';
  span.textContent = voteAvarage.toFixed(1);
  icon.appendChild(imgIcon);
  content.appendChild(icon);
  if(voteAvarage != 0) {
    content.appendChild(span);
  }
  tag.appendChild(content);

  cardMovie.appendChild(image);
  cardMovie.appendChild(tag);
  cardMovie.style.animation = 'fadeIn .8s cubic-bezier(0.79,0.14,0.15,0.86)';

  if(isSearchArea) {
    searchResultArea.appendChild(cardMovie);
  } else {
    allMoviesArea.appendChild(cardMovie);
  }

  cardMovie.addEventListener('click', (e) => {
    handleModal(e.target.getAttribute('movie-id'));
    
  })

}

let paginator = 2;

btnBack.addEventListener('click', () => {
  mainArea.classList.remove('disabled');
  navHeader.classList.remove('disabled');
  allMoviesSection.classList.remove('active');
  header.classList.remove('disabled');
  header.classList.remove('search-mode')
  searchMovieSection.classList.remove('active');
  btnLoadMore.classList.remove('normal');
  paginator2 = 1;
  allMoviesArea.innerHTML = '';
  btnLoadMore.setAttribute('genre-id', '');
});

function listGridMovies(url) {
  loading.classList.add('active');

  axios({
    method: 'GET',
    url
  })
  .then(res => {

    let {results} = res.data;

    results.forEach(result => {
      let {poster_path, id, vote_average} = result;
      if(poster_path && vote_average != 0) {
        createAllCardsMovie(id, poster_path, vote_average, false);
      }

      
    })
    loading.classList.remove('active');

  });
}


btnViewAllMovies.forEach(btn => {
  btn.addEventListener('click', () => {


    let pageTypeBtnLoadMore = btnLoadMore.classList;

    titleAllMovies.textContent = '';
    allMoviesArea.innerHTML = '';

    btnLoadMore.setAttribute('section-type', btn.getAttribute('section-type'));

    mainArea.classList.add('disabled');
    navHeader.classList.add('disabled');
    allMoviesSection.classList.add('active');
    let getType = btn.getAttribute('section-type');
    header.classList.add('disabled');
    let classification = sectionClassification.find(item => {
      return item.typeSection == getType;
    })

    titleAllMovies.textContent = classification.titleSection;


    if(classification.typeSection == 'por-genero') {
      selectGenreArea[1].style.display = 'block';
      btnLoadMore.setAttribute('page', 'select-genre');

      btnLoadMore.style.display = 'none';
      if(itemSelected[0].textContent != 'Selecione um gênero') {
        itemSelected[1].textContent = itemSelected[0].textContent; 
        itemSelected[1].setAttribute('genre-id', itemSelected[0].getAttribute('genre-id'));

        btnLoadMore.setAttribute('genre-id', '');

        btnLoadMore.style.display = 'block';
        btnLoadMore.setAttribute('genre-id', itemSelected[0].getAttribute('genre-id'));
        

        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${itemSelected[0].getAttribute('genre-id')}&watch_region=BR&with_watch_monetization_types=flatrate`;

        listGridMovies(url);
      }

    } else {
      loading.classList.add('active');
      selectGenreArea[1].style.display = 'none';
      btnLoadMore.setAttribute('page', 'normal');
      btnLoadMore.classList.add('normal');


      axios({
        method: 'GET',
        url: classification.url
      })
      .then(res => {
        const {results} = res.data;
        results.forEach((result) => {
          let {id, poster_path, vote_average} = result;
          createAllCardsMovie(id, poster_path, vote_average, false)
  
        })
        if(getType == 'nos-cinemas') {
          btnLoadMore.style.display = 'none'
        } else {
          btnLoadMore.style.display = 'block';
  
        }
  
        loading.classList.remove('active');
  
      })



      allMoviesArea.innerHTML = '';
      searchResultArea.innerHTML = '';

      let newUrl = classification.url; 



      

      
    }

    
    })
    

})



if(btnLoadMore.getAttribute('page') !== 'select-genre') {


  let item = sectionClassification.find(item => {
    return item.typeSection == btnLoadMore.getAttribute('section-type');
  })

  
} 

function scrollToSection(event) {
  event.preventDefault();

  menuMobile.classList.remove('active');

  const href = event.currentTarget.getAttribute('href');

  const section = document.querySelector(href);

  const initPosition = section.offsetTop;

  window.scrollTo({
    top: initPosition - 90,
    behavior: 'smooth'
  })
}

const itemsMenu = document.querySelectorAll('#js-menu-item');

itemsMenu.forEach(item => {
  item.addEventListener('click', scrollToSection);
})

window.addEventListener('scroll', () => {
  if(window.scrollY > 80) {
    header.classList.add('active');
  } else {
    header.classList.remove('active');

  }
})

const btnSearch = document.querySelectorAll('#js-search-btn');
const searchMovieSection = document.getElementById('js-search-movie-section');
const searchMovieArea = document.getElementById('js-search-input');
const btnSearchInput = document.getElementById('btn-search-input');

function formatSearch(string) {
  let stringWithoutSpaces = string.replace(/ /g, "%20");;

  return `query=${stringWithoutSpaces}&`;
}

btnSearch.forEach(btn => {
  btn.addEventListener('click', () => {
    allMoviesSection.classList.remove('active');
    mainArea.classList.add('disabled');
    navHeader.classList.add('disabled');
    header.classList.add('search-mode')
    searchMovieSection.classList.add('active');
    menuMobile.classList.remove('active');
  })
});


let urlSearch = '';

function handleSearch() {
  searchResultArea.innerHTML = '';

  let movieSearch = formatSearch(searchMovieArea.value);

  urlSearch = '';
  
  urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=${language}&${movieSearch}page=1&include_adult=false&region=${region}`;

  axios({
    method: 'GET',
    url: urlSearch
  })
  .then(res => {
    const {results} = res.data;
    results.map(result => {
      let {id, poster_path, vote_average} = result;

      if(poster_path && vote_average != 0) {
        createAllCardsMovie(id, poster_path, vote_average, true)

      }


    })
    loading.classList.remove('active');

  })
}

btnSearchInput.addEventListener('click', handleSearch);

searchMovieArea.addEventListener('keypress', (e) => {
  if(e.key == 'Enter') {
    handleSearch();
  }
});

const logoNav = document.querySelector('.logo');

logoNav.addEventListener('click', scrollToSection);

const btnScrollUp = document.getElementById('js-scroll-up');

btnScrollUp.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

let urlMainPage = '';

function addMoreMovies() {

  paginator2 = paginator2 + 1;

  let classification = sectionClassification.find(element => {
    return element.typeSection == btnLoadMore.getAttribute('section-type');
  });


  let type = classification.typeSection;

  if(type == 'vale-a-pena-ver') {
    urlMainPage = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=${paginator2}&with_watch_monetization_types=flatrate`;
  } else if(type == 'top-mais-avaliados') {
    urlMainPage = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${language}&page=${paginator2}`;
  } else if(type == 'novos') {
    urlMainPage == `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=${language}&page=${paginator2}`;
  } else if(type == 'nos-cinemas') {
    urlMainPage == `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${language}&page=${paginator2}`
  }

  let urlGenre = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&sort_by=popularity.desc&include_adult=false&include_video=false&page=${paginator2}&with_genres=${itemSelected[1].getAttribute('genre-id')}&watch_region=BR&with_watch_monetization_types=flatrate`;

  
  if(btnLoadMore.getAttribute('page') == 'select-genre') {
    listGridMovies(urlGenre);
    urlGenre = '';
  } else {

    listGridMovies(urlMainPage);

  }
}

let paginator2 = 1;

btnLoadMore.addEventListener('click',() => {


  addMoreMovies(paginator2);
});

