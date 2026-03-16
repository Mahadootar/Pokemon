function pokemonTemplate(pokemon, imgURL, colorClass, icons, index){
    return `<div class="pokemon_card" onclick="openDialog(${pokemon.id})">
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

function renderMainTamplate(height, weight, base_Exp, abilities){
   return `
       <div class="main_info"> 
       <div >
        <p>Height</p>
        </div>
        <div>
        <p>:${height} m</p>
        </div>
         </div>
        <div class="main_info">
           <div>
               <p>Weight</p>
           </div>
           <div>
               <p>: ${weight} kg</p>
           </div>
       </div>
        <div class="base_exp_main_info">
           <div >
               <p>Base Experience</p>
           </div>
           <div>
               <p>: ${base_Exp}</p>
           </div>
       </div>
        <div class="main_info">
           <div >
               <p>Abilities</p>
           </div>
           <div>
               <p>: ${abilities}</p>
           </div>
       </div>
         
    `;
}

function renderStatsTemplate(hp, attack, defense, specialAttack, specialDefense,speed){
    return `
    <div>
    <p>HP :${hp}</p>
    </div>`
}