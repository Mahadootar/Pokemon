const dialogRef = document.getElementById("dialog_id"); 
const pokemonContainer = document.getElementById("pokemonContent"); 
let pokemonData = [];  /* The array first stores the Pokémon list from the API.*/
let loadedPokemonData = {} /*This Object will later store the complete detailed data of the Pokémon. */
let evolutionDataCache = {} /*This Object is used to store the evolution data that has been loaded. */
let currentPokemon;
let filteredNames = [];
let currentIndex = 0;

/*fetchData() is executed. await waits until the data is loaded. The Pokémon are then rendered. */
async function init() {
   await fetchData(20,0);
   filteredNames = pokemonData;
   renderPokemons();
}

/* This function loads Pokémon data from an API and saves the results.*/
 async function fetchData(limit = 20, offset = 0) {
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

async function renderPokemons(){
    let pokemonContainer = document.getElementById('pokemonContent');
    pokemonContainer.innerHTML = '';

    for (let index = 0; index < filteredNames.length; index++) {
        let pokemon = filteredNames[index];
        let data = await loadPokemonDetails(pokemon);
        pokemonContainer.innerHTML += createPokemonCard(data, index);
    }  
}

async function loadPokemonDetails(pokemon){
    let response = await fetch(pokemon.url);
        let data = await response.json();
        loadedPokemonData[data.id] = data;

        return data;

}

function createPokemonCard(pokemon, index){
    let id = pokemon.id;
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

    let type = pokemon.types[0].type.name;
        let icons = getTypeOfIcon(pokemon.types);
        let colorClass = getColor(type);

    return pokemonTemplate(pokemon, imgURL, colorClass, icons, index);
}

function getTypeOfIcon(types){
   let icons = "";

   for (let index = 0; index < types.length; index++) {
    const type = types[index].type.name;
    icons += typeOfIcons[type] ;
   }
   return icons;
}

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

function getTheIdOfUrl(url){
    let parts = url.split("/");
    
    return Number(parts[6]);
}

function updateDialogContent(pokemon){
    currentPokemon = pokemon;
    updateDialogHeader(pokemon);
    renderMainTab(currentPokemon);
    renderStatsTab(currentPokemon);
    renderEvoTab(currentPokemon)
    showTabsInfo('main');

}

function updateDialogHeader(pokemon){
    
    let icons = getTypeOfIcon(pokemon.types);
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`;
    document.getElementById("dialog-title").innerHTML = `#${pokemon.id} ${pokemon.name}`;
    document.getElementById("dialog_img").src = imgURL;
    document.getElementById("dialog_img").alt = pokemon.name;
    document.getElementById("type_pokemon_dialog").innerHTML = `<div class="pokemon_type">${icons}</div>`;

}

function showTabsInfo(tabName){
    console.log("showTabsInfo läuft:", tabName);
    document.getElementById('tab_main').classList.add('d_none');
    document.getElementById('tab_stats').classList.add('d_none');
    document.getElementById('tab_evo').classList.add('d_none');

    document.getElementById('tab_' + tabName).classList.remove('d_none');
}

function renderMainTab(pokemon){
    let height = pokemon.height / 10;
    let weight = pokemon.weight / 10;
    let abilities = getAbilities(pokemon.abilities);
    document.getElementById("tab_main").innerHTML = renderMainTemplate(height, weight, pokemon.base_experience, abilities);
}

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

async function loadEvoChain(pokemon){
    let speciesResponse = await fetch(pokemon.species.url);
    let speciesPokemonData = await speciesResponse.json();

    let evolutionsChainResponse = await fetch(speciesPokemonData.evolution_chain.url);
    let evolutionsData = await evolutionsChainResponse.json();

    return evolutionsData.chain;
}

function createEvolutionData(species){
    let id = getTheIdOfUrl(species.url)
    let img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
    return {name : species.name, img: img};
     

}

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

 async function renderEvoTab(pokemon){
    let chain = await loadEvoChain(pokemon)
    let evolutions = getEvoNamesAndImages(chain);
    document.getElementById("tab_evo").innerHTML = renderEvoChain(evolutions);
}

function stopEventBubbling(event){
    event.stopPropagation();
}

function closeDialog(){
    dialogRef.close();
}

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

function filterAndShowPokemon(filterWord){
    filteredNames = pokemonData.filter(pokemon => pokemon.name.includes(filterWord));
    renderPokemons();

}

function searchPokemon(){
    let searchInput = document.querySelector('#search-input');
    let filterWord = searchInput.value.toLowerCase().trim();

    if (filterWord.length < 3) {
        filteredNames = pokemonData;
        renderPokemons();
        
    }else{
        filterAndShowPokemon(filterWord);
    }
}

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

