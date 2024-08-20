import { SyntheticEvent, useCallback } from "react";
import { debounce } from "lodash";

interface PokeSearchProp {
  disabled: boolean;
  onSearch: (query: string) => void;
}

const PokeSearch = ({ onSearch, disabled }: PokeSearchProp): JSX.Element => {
  const handleSearch = useCallback(
    debounce((searchTerm) => onSearch(searchTerm), 300),
    [onSearch]
  );

  const handleChange = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement;
    handleSearch(value);
  };

  return (
    <div className="pokedex-search">
      <input
        disabled={disabled}
        className="pokedex-search_input"
        placeholder="Search by name or number"
        onChange={handleChange}
      />
    </div>
  );
};

export default PokeSearch;
