import React, { useState, useEffect } from "react";
import "./App.css";
import SelectedPokemon from "./Selected Pokemon/SelectedPokemon";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [pokemonData, setPokemonData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);
  const [showList, setShowList] = useState(true);
  const [isPokemonSelected, setIsPokemonSelected] = useState(false);

  const loadAllPokemonData = (pokemonsList) => {
    pokemonsList.forEach((pokemon) => {
      fetch(pokemon.url)
        .then((resp) => resp.json())
        .then((data) => {
          setPokemonData((prevData) => ({
            ...prevData,
            [pokemon.name]: data,
          }));
        });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typeResponse = await fetch("https://pokeapi.co/api/v2/type");
        if (!typeResponse.ok) {
          throw new Error("Failed to fetch types data");
        }
        const typeData = await typeResponse.json();
        setTypes(typeData.results.map((type) => type.name));

        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFilteredPokemon(data.results);
        setPokemonList(data.results);
        loadAllPokemonData(data.results);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handlePokemonClick = async (pokemonName) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pokemon details");
      }
      const data = await response.json();

      // Fetch the image URL separately
      const imageResponse = await fetch(data.sprites.front_default); // Corrected URL here
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch pokemon image");
      }
      const imageData = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageData);

      // Update the Pokemon object to include the image URL
      const pokemonWithImage = {
        ...data,
        image: imageUrl,
      };

      setSelectedPokemon(pokemonWithImage);
      setShowList(false);
      setIsPokemonSelected(true);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch pokemon details");
      }
      const searchedPokemon = await response.json();
      if (searchedPokemon) {
        handlePokemonClick(searchedPokemon.name);
      } else {
        setError("Pokemon not found");
      }
      setIsPokemonSelected(false);
      setSelectedPokemon(null);
      setSearchTerm("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilteredType = async (e) => {
    const type = e.target.value;
    if (type === "") {
      setFilteredPokemon(pokemonList);
    } else {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const pokemonFiltered = data.pokemon.map((entry) => entry.pokemon);
        const filteredPokemon = pokemonFiltered
          .filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 20);
        setFilterType(type);
        setIsPokemonSelected(false);
        setSelectedPokemon(null);
        setShowList(true);
        setError(null);
        setFilteredPokemon(filteredPokemon);
        loadAllPokemonData(filteredPokemon);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
    <div className="header">
        <img
          className="logo"
          src="https://pnghq.com/wp-content/uploads/pikachu-pokemon-transparent-png-free-png-images.png"
        ></img>
        <div className="searchBox">
          <input
            className="input"
            type="text"
            placeholder="Search Pokémon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="searchButton" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    <div className="container">
      <div className="filterDropdown">
        <label>Select Type: </label>
        <select onChange={(e) => handleFilteredType(e)}>
          <option value="">All Types</option>
          {types.length > 0 &&
            types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      {!isPokemonSelected && showList && (
        <ul className="pokemon-list">
          {filteredPokemon.map((pokemon, index) => (
            <li
              key={index}
              onClick={() => handlePokemonClick(pokemon.name)}
              className="pokemon-card"
            >
              <img
                src={
                  pokemonData[pokemon.name]?.sprites.other.dream_world
                    .front_default
                }
                alt={pokemon.name}
              />
              <div className="pokemon-name">{pokemon.name.toUpperCase()}</div>
            </li>
          ))}
        </ul>
      )}

      {selectedPokemon && <SelectedPokemon selectedPokemon={selectedPokemon} />}
    </div>
    </>
  );
};

export default App;
