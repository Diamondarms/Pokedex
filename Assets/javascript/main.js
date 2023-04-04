const d = document.getElementById('pokemons')
const loadMoreButton = document.getElementById('loadMorebtn')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonHTML(pokemon){
    return `
    <a href="pokedex-pokemon.html?pokemon=${pokemon.number}"><li class="pokemon ${pokemon.type}">
                <span class="number">${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li></a>
    `
}

function loadMoreItems(offset, limit){
    pokeApi.getPokemons(offset,limit).then((pokemonsList = []) => {
    
    d.innerHTML += pokemonsList.map(convertPokemonHTML).join('')
    })
}

loadMoreItems(offset,limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordNextPage = offset + limit

    if (qtdRecordNextPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadMoreItems(offset,newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    }else{
        loadMoreItems(offset,limit)
    }
})

