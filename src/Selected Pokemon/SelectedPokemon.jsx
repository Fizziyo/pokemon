import Stats from "../Stats/Stats";

function SelectedPokemon({ selectedPokemon }) {
    return (
        <div className="pokemon-details">
            <h2>{selectedPokemon.name.toUpperCase()}</h2>
            <img src={selectedPokemon.sprites.other.home.front_default} alt={selectedPokemon.name} />
            <div><h3>Types:</h3> {selectedPokemon.types.map(type => type.type.name).join(', ')}</div>
            <div className="moves-section">
                <h3>Moves:</h3>
                <ul className="move-list">
                    {selectedPokemon.moves.slice(0, 8).map((move, index) => (
                        <li key={index} className="move-item">
                            <span className="move-name">{move.move.name}</span> - <span className="move-level-learned">Learned at level {move.version_group_details[0].level_learned_at}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Stats name={selectedPokemon.name} />
        </div>
    );
}

export default SelectedPokemon;
