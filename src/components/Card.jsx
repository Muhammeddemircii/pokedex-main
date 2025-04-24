import React, { useEffect, useState } from "react";
import axios from "../axios/axios";
import { useNavigate } from "react-router-dom";
import Search from "./Search";

function Card() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = localStorage.getItem('pokemonCards');

      if (cachedData) {
        setCards(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/pokemon");
        const pokemonList = response.data.results || [];
        const detailedPokemonData = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const idMatch = pokemon.url.match(/\/pokemon\/(\d+)\//);
            const id = idMatch ? idMatch[1] : "Bilinmiyor";
            const [pokemonDetails, speciesDetails] = await Promise.all([
              axios.get(`/pokemon/${id}`),
              axios.get(`/pokemon-species/${id}/`)
            ]);

            const types = pokemonDetails.data.types.map(type => type.type.name);

            const descriptionEntry = speciesDetails.data.flavor_text_entries.find(
              (entry) => entry.language.name === "en"
            );
            const description = descriptionEntry
              ? descriptionEntry.flavor_text.replace(/\n|\f/g, " ")
              : "Açıklama bulunamadı";

            return {
              name: pokemon.name,
              id,
              types,
              description
            };
          })
        );

        localStorage.setItem('pokemonCards', JSON.stringify(detailedPokemonData));
        setCards(detailedPokemonData);
        setLoading(false);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (item) => {
    navigate(`/details/${item.name}`, { state: { id: item.id } });
  };

  const filteredCards = cards.filter((item) =>
    item.name.toLowerCase().includes(search)
  );

  if (loading) {
    return (
      <div className="skeleton">
        <img src="/skeleton.png" alt="" />
      </div>
    );
  }

  return (
    <div>
      <Search setSearch={setSearch} />
      <div className="cards">
        {filteredCards.map((item) => (
          <div className="card" key={item.id}>
            <div className="card-header">
              <div className="label">
                {item.types.map((type) => (
                  <span key={type}>{type}</span>
                ))}
              </div>
              <p>#{item.id}</p>
            </div>
            <div className="contents">
              <div className="content-text">
                <h1>{item.name}</h1>
                <p>{item.description}</p>
              </div>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`}
                alt="pokemon-monster"
              />
            </div>
            <button className="know-more" onClick={() => handleClick(item)}>
              Know More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;