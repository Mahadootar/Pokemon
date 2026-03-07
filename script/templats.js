function pokemonTemplate(pokemon){
    let id = pokemon.url.split('/')[6];

    return `<div>
    <div>
    <h3>#${pokemon.id} ${pokemon.name}</h3>
     <div class="pokemon_img">
     <img src="${"https://pokeapi.co/api/v2/pokemon/1/"}" alt=""</div>
    </div>
    </div>`
} 