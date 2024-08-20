class Pokemon {
  id: number;

  name: string;

  sprite: string;

  types: string[];

  favorite?: boolean;

  constructor({ id, name, sprite, types, favorite }: Pokemon) {
    this.id = id;
    this.name = name;
    this.sprite = sprite;
    this.types = types;
    this.favorite = favorite;
  }
}

export default Pokemon;