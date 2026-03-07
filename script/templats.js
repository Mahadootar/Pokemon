function pokemonTemplate(pokemon, type){
    let id = pokemon.url.split('/')[6];
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return `<div class="pokemon_card ${type}">
    <div>
    <h3>#${id} ${pokemon.name}</h3>
     <div class="pokemon_img ${type}">
     <img src="${imgURL}" alt="${pokemon.name}">
     </div>
    </div>
    </div>`
} 