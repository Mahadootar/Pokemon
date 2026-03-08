function pokemonTemplate(pokemon, type){
    let id = pokemon.url.split('/')[6];
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return `<div class="pokemon_card">
    <div>
    <h3>#${id} ${pokemon.name}</h3>
    </div>
     <div class="pokemon_img_container ${type}">
     <img class="pokemon_img" src="${imgURL}" alt="${pokemon.name}">
     </div>
    
    </div>`
} 