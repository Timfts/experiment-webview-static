import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

// Função para buscar a lista de Pokémons
const fetchPokemonList = async (): Promise<Pokemon[]> => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
  if (!response.ok) {
    throw new Error('Erro ao buscar lista de Pokémons');
  }
  const data = await response.json();
  return data.results;
};

// Função para buscar detalhes de um Pokémon específico
const fetchPokemonDetails = async (url: string): Promise<PokemonDetails> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao buscar detalhes do Pokémon');
  }
  return response.json();
};

// Componente para um card de Pokémon individual
const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const { data: details, isLoading, error } = useQuery({
    queryKey: ['pokemon-details', pokemon.url],
    queryFn: () => fetchPokemonDetails(pokemon.url),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading) {
    return (
      <div className="pokemon-card loading">
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="pokemon-card error">
        <p>Erro ao carregar Pokémon</p>
      </div>
    );
  }

  return (
    <div className="pokemon-card">
      <img 
        src={details.sprites.front_default} 
        alt={details.name}
        loading="lazy"
      />
      <h3>{details.name}</h3>
      <p>#{details.id.toString().padStart(3, '0')}</p>
      <div className="types">
        {details.types.map((type, index) => (
          <span key={index} className={`type type-${type.type.name}`}>
            {type.type.name}
          </span>
        ))}
      </div>
    </div>
  );
};

// Componente principal da lista de Pokémons
export default function PokemonList() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: pokemonList, isLoading, error } = useQuery({
    queryKey: ['pokemon-list'],
    queryFn: fetchPokemonList,
    staleTime: 1000 * 60 * 10, // 10 minutos
    enabled: mounted, // Só executa quando o componente for montado no cliente
  });

  // Renderiza esqueleto estático no SSR e enquanto carrega
  if (!mounted || isLoading) {
    return (
      <div className="pokemon-container">
        <h1>Pokédex</h1>
        <div className="pokemon-grid">
          {/* Esqueleto estático enquanto carrega */}
          {Array.from({ length: 20 }, (_, index) => (
            <div key={index} className="pokemon-card loading">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-container">
        <h1>Pokédex</h1>
        <div className="error-message">
          <p>Erro ao carregar a lista de Pokémons. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-container">
      <h1>Pokédex</h1>
      <div className="pokemon-grid">
        {pokemonList?.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}