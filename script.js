const dialogRef = document.getElementById("dialog_id");
const pokemonContainer = document.getElementById("pokemonContent");
let pokemonData = [];

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

function renderPokemons(){
    let pokemonContainer = document.getElementById('pokemonContent');
    pokemonContainer.innerHTML = '';

    for (let index = 0; index < pokemonData.length; index++) {
        let pokemon = pokemonData[index];

        pokemonContainer.innerHTML += pokemonTemplate(pokemon);
        
    }
}







function openDialog(){
    dialogRef.showModal();

}