   // Holt das HTML-Element mit der ID "dialog_id"
   // Dieses Element ist für das Popup
const dialogRef = document.getElementById("dialog_id");

   // Holt das HTML-Element, in dem später die Pokémon-Karten angezeigt werden
const pokemonContainer = document.getElementById("pokemonContent");

   // Leeres Array für die erste Pokémon-Liste aus der API
   // Hier landen später z. B. Name und URL der Pokémon
let pokemonData = [];

   // Leeres Array für die vollständigen Detaildaten der geladenen Pokémon
   // Hier landen später z. B. ID, Typ, Gewicht, Fähigkeiten usw.
let loadedPokemonData = [];

   // Startfunktion der App
   // "async" bedeutet: In dieser Funktion dürfen wir "await" benutzen
async function init() {

   // Ruft fetchData() auf und wartet, bis die Daten fertig geladen sind
   // Das ist wichtig, damit renderPokemons() erst startet, wenn pokemonData gefüllt ist
   await fetchData();

   // Zeigt nach dem Laden die Pokémon auf der Seite an
   renderPokemons();
}

async function fetchData() {
   try {
     // Hier steht die Internet-Adresse von der API
     const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";

     // Hole Daten von der API
     let response = await fetch(BASE_URL);

     // Mache aus der Antwort echte JavaScript-Daten
     let data = await response.json();

     // Speichere nur die Pokémon-Liste in pokemonData
     pokemonData = data.results;
    
   } catch (error) {
     // Falls etwas schiefgeht, zeige den Fehler in der Konsole
     console.log('Failed To Fetch Pokemon :(', error);

     // Zeige eine Fehlermeldung auf der Webseite
     pokemonContainer.innerHTML = `<li>Failed To Load:(</li>`;
   } 
}

async function fetchData() {                    // Erstellt eine asynchrone Funktion namens fetchData
   try {                                        // Versucht den Code im Block auszuführen
     const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"; // API-URL für 10 Pokémon

     let response = await fetch(BASE_URL);      // Schickt eine Anfrage an die API und wartet auf die Antwort
     let data = await response.json();          // Wandelt die JSON-Antwort in ein JavaScript-Objekt um
     pokemonData = data.results;                // Speichert das results-Array in pokemonData
    
   } catch (error) {                            // Falls ein Fehler passiert, springt der Code hierhin
     console.log('Failed To Fetch Pokemon :(', error); // Gibt den Fehler in der Konsole aus
    
     pokemonContainer.innerHTML = `<li>Failed To Load:(</li>`; // Zeigt eine Fehlermeldung im HTML an
   } 
}

async function renderPokemons() {                    // Erstellt eine asynchrone Funktion namens renderPokemons
    let pokemonContainer = document.getElementById('pokemonContent'); // Holt das HTML-Element mit der ID "pokemonContent"
    
    pokemonContainer.innerHTML = '';                 // Leert den aktuellen Inhalt des Containers, damit nichts doppelt angezeigt wird
    
    loadedPokemonData = [];                          // Setzt das Array für geladene Pokémon-Details zurück

    for (let index = 0; index < pokemonData.length; index++) { // Geht mit einer Schleife durch alle Einträge in pokemonData
        let pokemon = pokemonData[index];            // Holt das aktuelle Pokémon aus dem Array
        
        let data = await loadPokemonDetails(pokemon); // Lädt die Detaildaten des aktuellen Pokémon und wartet auf das Ergebnis

        pokemonContainer.innerHTML += createPokemonCard(data, index); // Erstellt eine Pokémon-Karte und fügt sie dem Container hinzu
    }  
}

async function loadPokemonDetails(pokemon) {              // Erstellt eine asynchrone Funktion, die Detaildaten zu einem Pokémon lädt
    let response = await fetch(pokemon.url);              // Sendet eine Anfrage an die URL des Pokémon und wartet auf die Antwort
    
    let data = await response.json();                     // Wandelt die Antwort in ein JavaScript-Objekt um
    
    loadedPokemonData.push(data);                         // Speichert die geladenen Detaildaten im Array loadedPokemonData

    return data;                                          // Gibt die geladenen Daten zurück
}

function createPokemonCard(pokemon, index) {             // Erstellt die Daten für eine Pokémon-Karte
    let id = pokemon.id;                                 // Speichert die ID des Pokémon in einer Variable
    
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`; // Erstellt die Bild-URL für das Pokémon

    let type = pokemon.types[0].type.name;               // Holt den ersten Typ des Pokémon
    let icons = getTypeOfIcon(pokemon.types);            // Holt die passenden Icons für alle Typen des Pokémon
    let colorClass = getColor(type);                     // Holt die passende CSS-Farbklasse für den ersten Typ

    return pokemonTemplate(pokemon, imgURL, colorClass, icons, index); // Übergibt alle Daten an das HTML-Template und gibt das Ergebnis zurück
}

function getTypeOfIcon(types) {                          // Erstellt die Icons für die Pokémon-Typen
   let icons = "";                                       // Startet mit einem leeren String für die Icons

   for (let index = 0; index < types.length; index++) { // Geht durch alle Typen im Array
      const type = types[index].type.name;               // Holt den Namen des aktuellen Typs
      icons += typeOfIcons[type];                        // Fügt das passende Icon aus typeOfIcons hinzu
   }

   return icons;                                         // Gibt alle gesammelten Icons zurück
}

function openDialog(pokemon) {                           // Öffnet das Dialogfenster für ein bestimmtes Pokémon
    currentPokemonIndex = loadedPokemonData.indexOf(pokemon); // Sucht die Position des Pokémon im Array und speichert sie
    
    updateDialogContent(pokemon);                        // Aktualisiert den Inhalt des Dialogs mit den Pokémon-Daten
    
    dialogRef.showModal();                               // Öffnet das Dialogfenster
}

function updateDialogContent(pokemon) {                  // Aktualisiert den gesamten Inhalt des Dialogfensters
    updateDialogHeader(pokemon);                         // Aktualisiert den Kopfbereich des Dialogs
    
    rendertMainTab(pokemon);                             // Rendert den Haupt-Tab mit den wichtigsten Daten
    
    showTabsInfo('main');                                // Zeigt den Tab "main" an
}

function updateDialogHeader(pokemon) {                   // Aktualisiert den Header des Dialogfensters
    let icons = getTypeOfIcon(pokemon.types);            // Holt die Typ-Icons des Pokémon
    
    let imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`; // Erstellt die Bild-URL des Pokémon
    
    document.getElementById("dialog-title").innerHTML = `#${pokemon.id} ${pokemon.name}`; // Setzt Titel mit ID und Name
    
    document.getElementById("dialog_img").src = imgURL; // Setzt das Bild im Dialog
    
    document.getElementById("dialog_img").alt = pokemon.name; // Setzt den Alternativtext des Bildes
    
    document.getElementById("type_pokemon_dialog").innerHTML = `<div class="pokemon_type">${icons}</div>`; // Fügt die Typ-Icons in den Dialog ein
}

function getAbilities(abilities) {                       // Erstellt einen Text mit allen Fähigkeiten des Pokémon
    let abilityNames = "";                               // Startet mit einem leeren String

    for (let i = 0; i < abilities.length; i++) {        // Geht durch alle Fähigkeiten
        abilityNames += abilities[i].ability.name;       // Fügt den Namen der aktuellen Fähigkeit hinzu

        if (i < abilities.length - 1) {                  // Prüft, ob es nicht die letzte Fähigkeit ist
            abilityNames += ", ";                        // Fügt ein Komma und Leerzeichen hinzu
        }
    }

    return abilityNames;                                 // Gibt den fertigen String zurück
}

function rendertMainTab(pokemon) {                       // Rendert den Inhalt des Haupt-Tabs im Dialog
    let height = pokemon.height / 10;                    // Rechnet die Größe in Meter um
    
    let weight = pokemon.weight / 10;                    // Rechnet das Gewicht in Kilogramm um
    
    let abilities = getAbilities(pokemon.abilities);     // Holt die Fähigkeiten als lesbaren Text
    
    document.getElementById("tab_main").innerHTML = renderMainTamplate(height, weight, pokemon.base_experience, abilities); // Fügt den Hauptinhalt in den Tab ein
}

function showTabsInfo(tabName) {                         // Zeigt genau einen Tab an und versteckt die anderen
    document.getElementById('tab_main').classList.add('d_none');  // Versteckt den Main-Tab
    document.getElementById('tab_stats').classList.add('d_none'); // Versteckt den Stats-Tab
    document.getElementById('tab_evo').classList.add('d_none');   // Versteckt den Evolutions-Tab

    document.getElementById('tab_' + tabName).classList.remove('d_none'); // Zeigt den gewünschten Tab an
}

function logDownBubblingProtection(event) {              // Verhindert, dass ein Klick-Event an übergeordnete Elemente weitergegeben wird
    event.stopPropagation();                             // Stoppt das Bubbling des Events
}

function getColor(type) {                                // Gibt passend zum Pokémon-Typ eine CSS-Klasse zurück
    switch (type) {                                      // Prüft den übergebenen Typ
        case "grass":
            return "grass";                              // Gibt die Klasse "grass" zurück
        case "fire":
            return "fire";                               // Gibt die Klasse "fire" zurück
        case "water":
            return "water";                              // Gibt die Klasse "water" zurück
        case "electric":
            return "electric";                           // Gibt die Klasse "electric" zurück
        case "bug":
            return "bug";                                // Gibt die Klasse "bug" zurück
        default:
            return "normal";                             // Falls kein passender Typ gefunden wird, wird "normal" zurückgegeben
    }
}