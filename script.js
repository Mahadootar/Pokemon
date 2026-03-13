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
    console.log(pokemonData);
    
   } catch (error) {
    console.log('Failed To Fetch Pokemon :(', error);
    
    pokemonContainer.innerHTML = `<li>Failed To Load:(</li>`
   } 
}

async function renderPokemons(){
    let pokemonContainer = document.getElementById('pokemonContent');
    pokemonContainer.innerHTML = '';

    for (let index = 0; index < pokemonData.length; index++) {
        let pokemon = pokemonData[index];
        let response = await fetch(pokemon.url);
        let data = await response.json();
        let type = data.types[0].type.name;
        let icons = getTypeOfIcon(data.types);
        loadedPokemonData.push(data);
        let colorClass = getColor(type);
        pokemonContainer.innerHTML += pokemonTemplate(pokemon, colorClass, icons, index);
    }  
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
    document.getElementById("dialog-title").innerHTML = pokemon.name; 
    document.getElementById("dialog_img").src = pokemon.sprites.front_default;
    document.getElementById("dialog_img").alt = pokemon.name;



}

function logDownBubblingProtection(event){
    console.log("logDown");
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