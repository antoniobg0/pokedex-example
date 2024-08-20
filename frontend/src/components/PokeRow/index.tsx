import { useMemo } from "react";
import Pokemon from "../../models/pokemon";
import Favorite from "../../assets/fav.png";
import NoFavorite from "../../assets/no-fav.png";
import typeColor from "../../utilities/typeColor";

type PorRowProps = Pokemon & {
  onFavoriteClick: () => void;
};

const PokeRow = ({
  id,
  name,
  sprite,
  types,
  favorite,
  onFavoriteClick,
}: PorRowProps): JSX.Element => {
  const typeText = useMemo(() => {
    return types.reduce((str, it) => `${str} ${it}-type`, "");
  }, [types]);

  return (
    <div className="pokemon-card">
      <img className="pokemon-sprite" src={sprite} alt={`${name}`} />
      <div className="pokemon-info">
        <h2>
          #{id} {name}
        </h2>
        <p>A {typeText} Pokémon.</p>
        {types.map((type) => {
          return (
            <div
              key={type}
              className="pokemon-type"
              style={{ backgroundColor: typeColor[type] }}
            >
              {type}
            </div>
          );
        })}
      </div>
      <img
        className="pokemon-favorite"
        src={favorite ? Favorite : NoFavorite}
        alt={`${name}-${favorite ? "Favorite" : "NoFavorite"}`}
        onClick={onFavoriteClick}
      />
    </div>
  );
};

export default PokeRow;
