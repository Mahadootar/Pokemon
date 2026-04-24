const dialogRef = document.getElementById("dialog_id"); 
const pokemonContainer = document.getElementById("pokemonContent"); 
let pokemonData = [];  /* The array first stores the Pokémon list from the API.*/
let loadedPokemonData = {} /*This Object will later store the complete detailed data of the Pokémon. */
let filteredNames = []; 
let currentIndex = 0;
let currenOffset = 0;
let limit = 20;

/*fetchData() is executed. await waits until the data is loaded. The Pokémon are then rendered. */
async function init() {
   showLoadingSpinner();
   await fetchData(limit,0);
   filteredNames = pokemonData;
   await renderPokemons();
   currenOffset = 20;
}

/* This function loads Pokémon data from an API and saves the results.*/
 async function fetchData(limit, offset = 0) {
   try {
     const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    let response = await fetch(BASE_URL);
    let data = await response.json();
    pokemonData.push(...data.results);
    
   } catch (error) {
    console.log('Failed To Fetch Pokemon :(', error);
    
    pokemonContainer.innerHTML = `<li>Failed To Load:(</li>`
   } 
}

/* This function renders the Pokémons*/
async function renderPokemons(){
    let pokemonContainer = document.getElementById('pokemonContent');
    let pokemonsConHml = "";

    for (let index = 0; index < filteredNames.length; index++) {
        let pokemon = filteredNames[index];
        let data = await loadPokemonDetails(pokemon);
        pokemonsConHml += createPokemonCard(data, index);
    }  
    pokemonContainer.innerHTML = pokemonsConHml;
    hideLoadingSpinner();
}

/* This function loads the details of a Pokémon and saves it in the loadedPokemonData object. */
async function loadPokemonDetails(pokemon){
    let response = await fetch(pokemon.url);
        let data = await response.json();
        loadedPokemonData[data.id] = data;

        return data;

}

/* This function creates a card for a Pokémon. It uses the pokemonTemplate to create the HTML structure */
function createPokemonCard(pokemon, index){
    let id = pokemon.id;
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

    let type = pokemon.types[0].type.name;
        let icons = getTypeOfIcon(pokemon.types);
        let colorClass = getColor(type);

    return pokemonTemplate(pokemon, imgURL, colorClass, icons, index);
}

/* This function returns the icons for the types of a Pokémon*/
function getTypeOfIcon(types){
   let icons = "";

   for (let index = 0; index < types.length; index++) {
    const type = types[index].type.name;
    icons += typeOfIcons[type] ;
   }
   return icons;
}

/* This function is called when a Pokémon card is clicked/opens the dialog*/
function openDialog(pokemonId){
    let selectedPokemon = loadedPokemonData[pokemonId];

    for (let i = 0; i < pokemonData.length; i++) {
        let idOfPokemonInList = getTheIdOfUrl(pokemonData[i].url);
        
        if (idOfPokemonInList === pokemonId) {
            currentIndex = i;
            break;
        }
    }
    updateDialogContent(selectedPokemon);
    dialogRef.showModal();
}

/* This function extracts the ID of a Pokémon from its URL*/
function getTheIdOfUrl(url){
    let parts = url.split("/");
    
    return Number(parts[6]);
}

/* This function updates the content of the dialog*/
function updateDialogContent(pokemon){
    currentPokemon = pokemon;
    updateDialogHeader(pokemon);
    renderMainTab(currentPokemon);
    renderStatsTab(currentPokemon);
    renderEvoTab(currentPokemon)
    showTabsInfo('main');

}

/* This function updates the header of the dialog with the Pokémon */
function updateDialogHeader(pokemon){
    let icons = getTypeOfIcon(pokemon.types);
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`;
    document.getElementById("dialog-title").innerHTML = `#${pokemon.id} ${pokemon.name}`;
    document.getElementById("dialog_img").src = imgURL;
    document.getElementById("dialog_img").alt = pokemon.name;
    document.getElementById("type_pokemon_dialog").innerHTML = `<div class="pokemon_type">${icons}</div>`;

}

/* This function shows the content of the selected tab and hides the content of the other tabs. */
function showTabsInfo(tabName){
    document.getElementById('tab_main').classList.add('d_none');
    document.getElementById('tab_stats').classList.add('d_none');
    document.getElementById('tab_evo').classList.add('d_none');

    document.getElementById('tab_' + tabName).classList.remove('d_none');
}

/* This function renders the content of the main tab of the dialog*/
function renderMainTab(pokemon){
    let height = pokemon.height / 10;
    let weight = pokemon.weight / 10;
    let abilities = getAbilities(pokemon.abilities);
    document.getElementById("tab_main").innerHTML = renderMainTemplate(height, weight, pokemon.base_experience, abilities);
}

/* This function extracts the names of the abilities of a Pokémon*/
function getAbilities(abilities){
    let abilityNames = "";

    for (let i = 0; i < abilities.length; i++) {

        abilityNames += abilities[i].ability.name;

        if(i < abilities.length - 1){
            abilityNames += ", ";
        }
    }
    return abilityNames;
}

/* This function renders the content of the stats tab of the dialog*/
function renderStatsTab(pokemon){
    let hp = pokemon.stats[0].base_stat;
    let attack = pokemon.stats[1].base_stat;
    let defense = pokemon.stats[2].base_stat;
    let specialAttack = pokemon.stats[3].base_stat;
    let specialDefense = pokemon.stats[4].base_stat;
    let speed = pokemon.stats[5].base_stat;
    document.getElementById("tab_stats").innerHTML = renderStatsTemplate(hp, attack, defense, specialAttack, specialDefense,speed);
    console.log(pokemon.stats);
}

/* This function loads the evolution chain of a Pokémon and returns it. */
async function loadEvoChain(pokemon){
    let speciesResponse = await fetch(pokemon.species.url);
    let speciesPokemonData = await speciesResponse.json();

    let evolutionsChainResponse = await fetch(speciesPokemonData.evolution_chain.url);
    let evolutionsData = await evolutionsChainResponse.json();

    return evolutionsData.chain;
}

/* This function creates an object with the name and image of a Pokémon from its species data. */
function createEvolutionData(species){
    let id = getTheIdOfUrl(species.url)
    let img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
    return {name : species.name, img: img};
     

}

/* This function extracts Pokémon evolution data and returns them in an array. */
function getEvoNamesAndImages(chain){
    let evolutions = [createEvolutionData(chain.species)]

    if (chain.evolves_to.length > 0) {
        evolutions.push(createEvolutionData(chain.evolves_to[0].species));
    }

    if (chain.evolves_to.length > 0 && chain.evolves_to[0].evolves_to.length > 0) {
         evolutions.push(createEvolutionData(chain.evolves_to[0].evolves_to[0].species));

    }
    return evolutions;
}

/* This function renders the content of the evolution tab of the dialog*/
 async function renderEvoTab(pokemon){
    let chain = await loadEvoChain(pokemon)
    let evolutions = getEvoNamesAndImages(chain);
    document.getElementById("tab_evo").innerHTML = renderEvoChain(evolutions);
}

/* This function is called when the user clicks on the dialog. It stops the event from bubbling up to the parent elements*/
function stopEventBubbling(event){
    event.stopPropagation();
}

/* This function closes the dialog*/
function closeDialog(){
    dialogRef.close();
}

/* This function is called when the user clicks on the next button in the dialog*/
function nextPokemon(){
    if (currentIndex < pokemonData.length -1 ) {
        currentIndex++
    }else{
        currentIndex = 0;
    }
    let pokemonFromTheList = pokemonData[currentIndex];
    let pokemonId = getTheIdOfUrl(pokemonFromTheList.url)
    let selectedPokemon = loadedPokemonData[pokemonId];
    
    updateDialogContent(selectedPokemon);
}

/* This function is called when the user clicks on the previous button in the dialog*/
function previousPokemon(){
    if (currentIndex > 0) {
        currentIndex--;
    }else{
        currentIndex = pokemonData.length -1
    }
    let pokemonFromTheList = pokemonData[currentIndex];
    let pokemonId = getTheIdOfUrl(pokemonFromTheList.url)
    let selectedPokemon = loadedPokemonData[pokemonId];
    updateDialogContent(selectedPokemon);

}

/* This function filters the Pokémon list based on the search input */
function filterAndShowPokemon(filterWord){
    filteredNames = pokemonData.filter(pokemon => pokemon.name.includes(filterWord));
    renderPokemons();

}

/* This function is called when the user types in the search input. It checks if the input is at least 3 characters*/
function searchPokemon(){
    let searchInput = document.querySelector('#search-input');
    let searchHint = document.getElementById('search-hint');
    let filterWord = searchInput.value.toLowerCase().trim();

    if (filterWord.length < 3) {
        searchHint.classList.remove("d_none");
        filteredNames === pokemonData;
        renderPokemons();  
    }else{
        searchHint.classList.add("d_none");
        filterAndShowPokemon(filterWord);
    }
}

/* This function loads more Pokémon*/
async function loadMorePokedex(){
    showLoadingSpinner();
    pokemonContainer.classList.add('loading_none');
    await fetchData(limit, currenOffset);
    filteredNames = pokemonData;
    await renderPokemons();
    currenOffset += limit;
    pokemonContainer.classList.remove('loading_none');
    
}

/* This function shows the loading spinner */
function showLoadingSpinner(){
    document.getElementById('loading-sphere').classList.remove('loading_none');
}

/* This function hides the loading spinner */
function hideLoadingSpinner(){
    document.getElementById('loading-sphere').classList.add('loading_none');
}

/*/ This function returns the color class for a Pokémon type*/
function getColor(type){
    switch (type) {
        case "grass":
            return "grass";
        case "fire":
            return "fire";
        case "water":
            return "water";
        case "electric":
            return "electric";
        case "bug":
            return "bug";
        default:
            return "normal";
    }
}

