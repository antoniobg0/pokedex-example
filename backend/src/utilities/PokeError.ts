class PokeError extends Error {
  name: string;

  message: string;

  code: number;

  constructor(name: string, message: string, code: number) {
    super(message);
    this.message = message;
    this.name = name;
    this.code = code;
  }
}

export default PokeError;
