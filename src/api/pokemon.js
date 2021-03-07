import * as network from "./network";

const getPokemons = (params) => {
  return network.get(`pokemon`, params);
};

const getPokemonEvolutionChain = (params) => {
  return network.get(`evolution-chain`, params);
};

const getPokemonByName = (name) => {
  return network.get(`pokemon/${name}`);
};

const getPokemonEvolutionChainById = (id) => {
  return network.get(`evolution-chain/${id}`);
};

export default {
  getPokemons,
  getPokemonEvolutionChain,
  getPokemonByName,
  getPokemonEvolutionChainById,
};
