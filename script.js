const dialogRef = document.getElementById("dialog_id");
const pokemonContainer = document.getElementById("pokemonContent");
let pokemonData = [];
let loadedPokemonData = [];



async function init() {
   await fetchData();
   renderPokemons();
}

 async function fetchData() {
   try {
     const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";

    let response = await fetch(BASE_URL);
    let data = await response.json();
    pokemonData = data.results;
    
   } catch (error) {
    console.log('Failed To Fetch Pokemon :(', error);
    
    pokemonContainer.innerHTML = `<li>Failed To Load:(</li>`
   } 
}

async function renderPokemons(){
    let pokemonContainer = document.getElementById('pokemonContent');
    pokemonContainer.innerHTML = '';
    loadedPokemonData = [];

    for (let index = 0; index < pokemonData.length; index++) {
        let pokemon = pokemonData[index];
        let data = await loadPokemonDetails(pokemon);

        pokemonContainer.innerHTML += createPokemonCard(data, index);
    }  
}

async function loadPokemonDetails(pokemon){
    let response = await fetch(pokemon.url);
        let data = await response.json();
        loadedPokemonData.push(data);

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

function openDialog(pokemon){
    currentPokemonIndex = loadedPokemonData.indexOf(pokemon);
    updateDialogContent(pokemon);
    dialogRef.showModal();

}

function updateDialogContent(pokemon){
    updateDialogHeader(pokemon);
    rendertMainTab(pokemon);
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

function rendertMainTab(pokemon){
    let height = pokemon.height / 10;
    let weight = pokemon.weight / 10;
    let abilities = getAbilities(pokemon.abilities);
    document.getElementById("tab_main").innerHTML = renderMainTamplate(height, weight, pokemon.base_experience, abilities);
}

function showTabsInfo(tabName){
    document.getElementById('tab_main').classList.add('d_none');
    document.getElementById('tab_stats').classList.add('d_none');
    document.getElementById('tab_evo').classList.add('d_none');

    document.getElementById('tab_' + tabName).classList.remove('d_none');
}

function logDownBubblingProtection(event){
    event.stopPropagation();
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