import { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "reactstrap";
import axios from "axios";
import { get, isEmpty } from "lodash";
import api from "../api/api";
import Pokemon from "./Pokemon";

class EvolutionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      evolListData: [],
    };
  }

  componentDidMount() {
    this.getEvolutionList();
  }

  getEvolutionList = () => {
    const result = axios.get(this.props.evolutionUrl).then((response) => {
      const pokeNames = this.flat([], response.data.chain.evolves_to);

      const promises = pokeNames.map((item) => {
        return api.getPokemonByName(item);
      });
      Promise.all(promises).then((response) => {
        this.setState({
          evolListData: response,
          loading: false,
        });
      });
    });
  };

  flat = (into, data) => {
    if (data === []) return into;
    if (Array.isArray(data)) return data.reduce(this.flat, into);
    into.push(data.species.name);
    return this.flat(into, data.evolves_to);
  };

  render() {
    const { modal, toggle } = this.props;

    return (
      <Modal
        size="xl"
        isOpen={modal}
        toggle={toggle}
        className="container-fluid"
      >
        <ModalHeader toggle={toggle}>
          Evolved versions of{" "}
          <span className="text-capitalize font-weight-bold">
            {this.props.childName}
          </span>
        </ModalHeader>
        {!this.state.loading ? (
          <div className="row justify-content-around">
            {this.state.evolListData.map((pokemon, index) => {
              return (
                <div
                  className="col-md-3 col-sm-4 col-xs-12 p-3"
                  key={`evolList${pokemon.name}_${pokemon.id}${index}`}
                >
                  <Pokemon pokemonItem={pokemon} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <Spinner
              style={{ width: "3rem", height: "3rem" }}
              type="grow"
              color="dark"
            />
          </div>
        )}

        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default EvolutionList;
