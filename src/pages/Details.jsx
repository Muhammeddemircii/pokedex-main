import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../axios/axios";
import Header from "../components/Header";

function Details() {
  const { state } = useLocation();
  const { id } = state;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/pokemon/${id}`);
        const pokemonData = response.data;

        const types = pokemonData.types.map((type) => type.type.name);
        const imageUrl = pokemonData.sprites.front_default;
        const height = pokemonData.height / 10 + "m";
        const weight = pokemonData.weight / 10 + "kg";
        const stats = pokemonData.stats.map(stat => ({
          name: stat.stat.name.toUpperCase(),
          value: stat.base_stat
        }));
        const abilities = pokemonData.abilities.map(ability => ability.ability.name);

        let description = "Açıklama yükleniyor...";
        try {
          const speciesResponse = await axios.get(`/pokemon-species/${id}`);
          description = speciesResponse.data.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
          )?.flavor_text || "Açıklama bulunamadı.";
        } catch (error) {
          console.error("Açıklama çekme hatası:", error);
        }

        setPokemon({
          name: pokemonData.name,
          id: pokemonData.id,
          types,
          description,
          imageUrl,
          height,
          weight,
          stats,
          abilities
        });
        setLoading(false);
      } catch (error) {
        console.error("Pokemon detayları çekme hatası:", error);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) {
    return <div className="skeleton"><img src="/skeleton.png" alt="Loading..." /></div>;
  }

  if (!pokemon) {
    return <div>Pokemon bulunamadı.</div>;
  }

  const statColors = {
    hp: "#f43444",    
    attack: "orange", 
    defense: "yellow",
    "special-attack": "lightblue", 
    "special-defense": "darkgreen",
    speed: "pink",    
  };

  const evolutionImages = [
    pokemon.imageUrl,
    pokemon.imageUrl,
    pokemon.imageUrl  
  ];

  return (
    <div>
      <Header />
      <div className="details-card">
        <div className="details-image">
          <img src={pokemon.imageUrl} alt={pokemon.name} />
        </div>
        <div className="details-content" style={{ padding: '20px' }}>
          <p>#{pokemon.id}</p>
          <h1>{pokemon.name}</h1>
          <div className="label">
            {pokemon.types.map((type) => (
              <span key={type}>{type}</span>
            ))}
          </div>
          <p>{pokemon.description}</p>
          <div className="height-weight">
            <p><span>Height</span> <span>{pokemon.height}</span></p>
            <p><span>Weight</span> <span>{pokemon.weight}</span></p>
          </div>
          <h2>Stats</h2>
          <div className="stats">
            {pokemon.stats.map(stat => (
              <p
                key={stat.name}
                className={stat.name.toLowerCase()}
                style={{ backgroundColor: statColors[stat.name.toLowerCase()] || 'transparent' }}
              >
                <span>{stat.name}</span> <span>{stat.value}</span>
              </p>
            ))}
          </div>
          <h2>Abilities</h2>
          <div className="ability">
            {pokemon.abilities.map(ability => (
              <p key={ability}>{ability}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="evolution">
        <h1>Evolution</h1>
        <div className="evolution-img">
          {evolutionImages.map((image, index) => (
            <React.Fragment key={index}>
              <img src={image} alt={`pokemon-monster-${index}`} />
              {index < evolutionImages.length - 1 && <img src="/arrow-right.png" alt="arrow-right" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Details;
