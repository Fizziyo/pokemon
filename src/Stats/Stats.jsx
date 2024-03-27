import React, { useState, useEffect } from 'react';
import './Stats.css'; // Import the CSS file

const PokemonStats = ({name}) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data');
        }
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPokemonData();
  }, []);

  return (
    <div className="pokemon-stats-container">
      {error && <p className="error">Error: {error}</p>}
      {pokemonData && (
        <div>
          <h2 className="pokemon-name">{pokemonData.name.toUpperCase()}'s STATS</h2>
          <ul className="stats-list">
            {pokemonData.stats.map((stat, index) => (
              <li key={index} className="stat-item">
                <span className="stat-name">{stat.stat.name.toUpperCase()}:</span>
                <span className="stat-value">{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PokemonStats;
