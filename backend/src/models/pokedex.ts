import axios from "axios";
import Pokemon from "./pokemon";

class Pokedex {
  private readonly limit = 20;

  private pokemonNames = [];

  private pokemonDetails = [];

  private offset = 0;
  
  private detailsOffset = 0;

  async getNames(offset: number) {
    if(!offset ||this.offset !== offset) {
      this.offset = offset;

      const getPokemonDicReq = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${offset}`
      );
      const pokemonNames = getPokemonDicReq.data.results.map(
        (item: any) => item.name
      );
  
      this.pokemonNames = pokemonNames;
  
      return pokemonNames;
    } else {
      return this.pokemonNames;
    }
  }

  async getPokemonDetails() {
    if (!this.detailsOffset || this.detailsOffset !== this.offset) {
      this.detailsOffset = this.offset;

      const resolveResolutionPromises: Promise<any>[] = [];

      this.pokemonNames.forEach((pName) => {
        resolveResolutionPromises.push(
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pName}`).then(
            ({ data }) =>
              new Pokemon({
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                types: data.types.map((t: any) => t.type.name),
              })
          )
        );
      });

      // Wait until resolve all.
      const resolvedDetailsReq = await Promise.all(resolveResolutionPromises);

      const pokemonWithDetails = resolvedDetailsReq.reduce(
        (acc, it) => acc.concat(it),
        []
      );

      this.pokemonDetails = pokemonWithDetails;

      return pokemonWithDetails;
    } else {
      return this.pokemonDetails;
    }
  }
}

export default Pokedex;
