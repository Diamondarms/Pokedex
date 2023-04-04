
const pokemonApi = {}

function convertPokeDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
    pokemon.types = types;
    pokemon.type = type;
    pokemon.photo = pokeDetail.sprites.other.home.front_default;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.abilities = pokeDetail.abilities;
    pokemon.hp = pokeDetail.stats[0].base_stat;
    pokemon.attack = pokeDetail.stats[1].base_stat;
    pokemon.defense = pokeDetail.stats[2].base_stat;
    pokemon.specialAttack = pokeDetail.stats[3].base_stat;
    pokemon.specialDefense = pokeDetail.stats[4].base_stat;
    pokemon.speed = pokeDetail.stats[5].base_stat;
    return pokemon;
}

pokemonApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeDetailToPokemon)
}

pokemonApi.getPokemon = (offset = 0, limit = 1) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    //debugger        
    return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemon) => pokemon.map(pokemonApi.getPokemonDetail))
    .then((detailsRequests) => Promise.all(detailsRequests))
    .then((pokemonDetails) => pokemonDetails)
    .catch((error) => console.error(error))

}
//////////////////////////////////////////////////////////////////////////////
function queryString(parameter) {  
    var loc = location.search.substring(1, location.search.length);   
    var param_value = false;   
    var params = loc.split("&");   
    for (i=0; i<params.length;i++) {   
        param_name = params[i].substring(0,params[i].indexOf('='));   
        if (param_name == parameter) {                                          
            param_value = params[i].substring(params[i].indexOf('=')+1)   
        }   
    }   
    if (param_value) {   
        return param_value;   
    }   
    else {   
        return undefined;   
    }   
}

var pokemonAtual = queryString("pokemon");
//////////////////////////////////////////////////////////////////////////////
const d = document.getElementById('pokemonCont')

const maxRecords = 151
const limit = 1;
let offset = pokemonAtual == null || pokemonAtual < 0 ? 0 : pokemonAtual-1;

function convertPokemonHTML(pokemon){
    return `
    <div class="pokemonDisplay ${pokemon.type}">
        <a href="pokedex.html"> <span class="material-symbols-outlined voltarBtn">
        arrow_back </span> </a>
            <div class="nameNumber">
                <span class="name">${pokemon.name}</span>
                <span class="number">${pokemon.number}</span>
            </div>
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
        <section class="pokemonInfo">
            <div class="about">
                <h2>About</h2>
                <table>
                    <tbody>
                        <tr>
                            <td class="infoName">Height</td>
                            <td class="info">${(pokemon.height*10).toFixed(1)+' cm'}</td>
                        </tr>
                        <tr>
                            <td class="infoName">Weight</td>
                            <td class="info">${(pokemon.weight*0.1).toFixed(1)+' kg'}</td>
                        </tr>
                        <tr>
                            <td class="infoName">Abilities</td>
                            <td class="info">${pokemon.abilities.map((abilitie) => abilitie.ability.name).join(", ")}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="stats">
                <h2>Stats</h2>
                <table>
                    <tbody>
                        <tr>
                            <td class="infoName">HP</td>
                            <td class="info">${pokemon.hp}</td>
                        </tr>
                        <tr>
                            <td class="infoName">Attack</td>
                            <td class="info">${pokemon.attack}</td>
                        </tr>
                        <tr>
                            <td class="infoName">Defense</td>
                            <td class="info">${pokemon.defense}</td>
                        </tr>
                        <tr>
                            <td class="infoName">Special-Attack</td>
                            <td class="info">${pokemon.specialAttack}</td>
                        </tr>
                        <tr>
                            <td class="infoName">Special-Defense</td>
                            <td class="info">${pokemon.specialDefense}</td>
                        </tr>
                        <tr>
                            <td class="infoName">Speed</td>
                            <td class="info">${pokemon.speed}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `
}

function loadPokemon(offset){
    pokemonApi.getPokemon(offset,limit).then((pokemon = []) => {
    
    d.innerHTML += convertPokemonHTML(pokemon[0])
    })
}
console.log(loadPokemon(offset))

