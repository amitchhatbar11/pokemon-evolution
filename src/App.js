import "./App.css";
import { Component } from "react";
import api from "./api/api";
import { get, isEqual } from "lodash";
import axios from "axios";
import Pokemon from "./components/Pokemon";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemons: [],
      offsetValue: 0,
    };
  }

  componentDidMount() {
    this.getPokemon();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.offsetValue, this.state.offsetValue)) {
      this.getPokemon();
    }
  }

  handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.setState({
        offsetValue: this.state.offsetValue + 10,
      });
    }
  };

  getPokemon = () => {
    if (this.state.offsetValue === 0) {
      api
        .getPokemonEvolutionChain({ offset: 0, limit: 10 })
        .then((response) => {
          const results = get(response, "results", []);
          let promises = results.map((result) => {
            return axios.get(result.url).then((itemByName) => {
              return axios
                .get(
                  `https://pokeapi.co/api/v2/pokemon/${itemByName.data.chain.species.name}`
                )
                .then(
                  (res) =>
                    new Promise((resolve) =>
                      resolve({ data: res.data, url: result.url })
                    )
                );
            });
          });
          Promise.all(promises).then((response) => {
            this.setState({
              pokemons: response,
            });
          });
        });
    } else {
      const params = {
        offset: this.state.offsetValue + 10,
        limit: 10,
      };

      api.getPokemonEvolutionChain(params).then((response) => {
        const results = get(response, "results", []);
        let promises = results.map((result) => {
          return axios.get(result.url).then((itemByName) => {
            return axios
              .get(
                `https://pokeapi.co/api/v2/pokemon/${itemByName.data.chain.species.name}`
              )
              .then(
                (res) =>
                  new Promise((resolve) =>
                    resolve({ data: res.data, url: result.url })
                  )
              );
          });
        });
        Promise.all(promises).then((response) => {
          this.setState({
            pokemons: [...this.state.pokemons, ...response],
          });
        });
      });
    }
  };
  render() {
    return (
      <div className="container-fluid">
        <h2 className="text-center mt-3">Pokemons</h2>
        <div className="row">
          {this.state.pokemons.map((pokemon, index) => {
            const item = get(pokemon, "data", {});
            return (
              <div
                className="col-md-3 col-sm-4 col-xs-12 p-3"
                key={`${item.name}_${item.id}${index}`}
              >
                <Pokemon pokemonItem={item} evolutionUrl={pokemon.url} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
