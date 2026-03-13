function pokemonTemplate(pokemon, imgURL, colorClass, icons, index){
    return `<div class="pokemon_card"  onclick="openDialog(loadedPokemonData[${index}])">
    <div>
    <h3>#${pokemon.id} ${pokemon.name}</h3>
    </div>
     <div class="pokemon_img_container ${colorClass}">
     <img class="pokemon_img" src="${imgURL}" alt="${pokemon.name}">
     </div>
    <div class="pokemon_info"> 
    <div class="pokemon_type">${icons}</div>
    </div>
    </div>`
} 