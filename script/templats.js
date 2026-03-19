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
    <div class="stats_box">
    ${renderSingleStat("HP", hp)}
    ${renderSingleStat("Attack", attack)}
    ${renderSingleStat("Defense", defense)}
    ${renderSingleStat("Sp-Attack", specialAttack)}
    ${renderSingleStat("Sp-Defense", specialDefense)}
    ${renderSingleStat("Speed", speed)}
    </div>
    `;
}

function renderSingleStat(name, value){
    let percent = (value / 255) * 100;
    return `
    <div class="stat_row">
    <span class="stat_name">${name}</span>
    <div class="progress_bar">
    <div class="progress_fill" style="width: ${percent}%;">${value}</div>
    </div>
    </div>
    `;
    
}

function renderEvoChain(evolutions){
    let html = "";

    for (let i = 0; i < evolutions.length; i++) {
        html += `<div>
        <img class="evo_img" src="${evolutions[i].img}" alt="${evolutions[i].name}">
        <p><strong>${evolutions[i].name}</strong></p>
        </div>
        `; 
    }
    return html;

}