import React, { useState } from "react";
import EvolutionList from "./EvolutionList";
import { isEmpty } from "lodash";

const { Card, CardImg, CardBody, CardTitle, CardText } = require("reactstrap");

const Pokemon = ({ pokemonItem, evolutionUrl }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <React.Fragment>
      <Card
        className="cursor-pointer"
        onClick={!isEmpty(evolutionUrl) ? toggle : null}
      >
        <CardImg
          top
          className="pokemon-img"
          src={pokemonItem.sprites.other.dream_world.front_default}
          alt={pokemonItem.name}
        />
        <CardBody>
          <CardTitle tag="h5">{pokemonItem.name}</CardTitle>
          <CardText>
            <div>
              Types:
              <ul>
                {pokemonItem.types.map((type) => {
                  return (
                    <li key={`${pokemonItem.id}_${type.type.name}`}>
                      {type.type.name}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              Abilities:
              <ul>
                {pokemonItem.abilities.map((ability) => {
                  return (
                    <li key={`${pokemonItem.id}_${ability.ability.name}`}>
                      {ability.ability.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardText>
        </CardBody>
      </Card>
      {modal && (
        <EvolutionList
          modal={modal}
          evolutionUrl={evolutionUrl}
          toggle={toggle}
          childName={pokemonItem.name}
        />
      )}
    </React.Fragment>
  );
};

export default Pokemon;
