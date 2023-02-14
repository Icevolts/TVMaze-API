
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const noImg= "https://tinyurl.com/missing-tv";
	let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
	let shows = res.data.map(result => {let show = result.show;
	return{
	id : show.id,
	name : show.name,
	summary : show.summary,
	img : show.image ? show.image.medium : noImg
	};
});
	return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-6 col-lg-3">
         <div class="media">
           <img class="card-img-top" src="${show.img}">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

const $searchForm = $("#search-form"); 

$searchForm.on("submit", async function searchForShowAndDisplay(evt) {
  evt.preventDefault(); 
  let term = $("#search-query").val();
  let shows = await getShowsByTerm(term);

  $("#episodes-area").hide();
  populateShows(shows);
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  let response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

let episodes = response.data.map(episode => ({
	id : episode.id,
	name : episode.name,
	season : episode.season,
	number : episode.number
}));
  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
const $episodesList = $("#episodes-list");
$episodesList.empty();
  for(let episode of episodes){
		let $newEp = $(`<li>${episode.name} (Season ${episode.season}, Episode ${episode.number})</li>`
    );
  
    $episodesList.append($newEp)
  };
  $("#episodes-area").show()
};

$('#shows-list').on("click",".Show-getEpisodes", async function handleEpClick(e){
	let showTarget = $(e.target).closest('.Show').data('show-id')
	let episodes = await getEpisodesOfShow(showTarget);
  populateEpisodes(episodes);
});