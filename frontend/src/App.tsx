/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import Pokemon from "./models/pokemon";
import PokeRow from "./components/PokeRow";
import PokeSearch from "./components/PokeSearch";
import useRequest from "./hooks/useRequest";

function App() {
  const mounted = useRef(false);
  const { loading, makeRequest } = useRequest();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [pokemonCache, setPokemonCache] = useState<{
    [key: string]: Pokemon[];
  }>({});
  const [nextOffset, setNextOffset] = useState(0);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState("");

  const loadPokemon = useCallback(
    async (q?: string) => {
      try {
        const { data, status, error } = await makeRequest({
          method: "get",
          url: `${q ? `?search=${q}&` : "?"}offset=${offset}`,
        });

        if (status !== 200) {
          throw new Error(error);
        }

        if (!q) {
          // set cache
          setPokemonCache((prev) => {
            const next: { [key: string]: Pokemon[] } = {
              ...prev,
              [offset]: data.items,
            };
            const nextMerged = Object.values(next).reduce(
              (acc: Pokemon[], it) => acc.concat(it),
              []
            );

            setPokemon(nextMerged);

            return next;
          });
        } else {
          setPokemon((prev) => (q ? data.items : prev.concat(data.items)));
        }

        if (data.offset) {
          setNextOffset(data.offset);
        }
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      }
    },
    [offset, makeRequest]
  );

  const addToFavorite = (pokemonId: number) =>
    makeRequest({ method: "post", url: `/${pokemonId}/favorite/add` });

  const removeFromFavorite = (pokemonId: number) =>
    makeRequest({ method: "post", url: `/${pokemonId}/favorite/remove` });

  const onSearchHandler = useCallback((q: string) => {
    setError("");

    // search on cache
    const cachePokemon = Object.values(pokemonCache).reduce(
      (acc, it) => acc.concat(it),
      []
    );
    const filtered = cachePokemon.filter(
      (pk) => pk.name.toLowerCase().includes(q) || `${pk.id}` === q
    );

    if (!filtered.length) {
      loadPokemon(q);
    } else {
      setPokemon(filtered);
    }
  }, [loadPokemon, pokemonCache]);

  const onFavoriteClickHandler = (index: number) => {
    let localPokemon = [...pokemon];
    localPokemon = localPokemon.map((p, i) => {
      if (index === i) {
        const isFav = !p.favorite;

        if (isFav) {
          addToFavorite(p.id);
        } else {
          removeFromFavorite(p.id);
        }

        p.favorite = isFav;
      }

      return {
        ...p,
      };
    });

    setPokemon(localPokemon);
  };

  useEffect(() => {
    if (mounted.current) {
      loadPokemon();
    }

    mounted.current = true;
  }, [mounted, loadPokemon]);

  return (
    <>
      <div className="pokedex-container">
        <h1 className="pokedex-title">Pokédex</h1>
        <PokeSearch disabled={loading} onSearch={onSearchHandler} />
        <div className={`pokedex-list ${loading || error ? "loading" : ""}`}>
          {error && <div>{error}</div>}
          {loading && <div>loading</div>}
          {!error && !loading && (
            <>
              {pokemon.map((pokemon, index) => (
                <PokeRow
                  key={pokemon.name}
                  id={pokemon.id}
                  name={pokemon.name}
                  sprite={pokemon.sprite}
                  types={pokemon.types}
                  favorite={pokemon.favorite}
                  onFavoriteClick={() => onFavoriteClickHandler(index)}
                />
              ))}
              {pokemon.length > 1 && (
                <div
                  className="pokedex-load-more"
                  onClick={() => setOffset(nextOffset)}
                >
                  Load More
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
