import React, { useState, useEffect } from "react";

import { Client } from "boardgame.io/react";
import GameScreen from "./GameScreen";
import Rabble from "../../../game/rabble";
import { SocketIO } from "boardgame.io/multiplayer";

import { useHistory, useParams } from "react-router-dom";

import { getPlayerGame } from "../../app/asyncStorage";

import Loader from "react-loader-spinner";

const RabbleGameView = () => {
  const { gameID } = useParams();
  const history = useHistory();

  const [playerID, setPlayerID] = useState('');
  const [playerCredentials, setPlayerCredentials] = useState('');
  // When mobile clients are locked, they sometimes lose connection to the server.
  // The 'visibilitychange' event happens when a browser tab becomes visible again
  // after the phone is locked (or the user switches back to this tab).
  const [visibleAt, setVisibleAt] = useState(0);
  const onVisibilityChange = (ev: any) => {
    setVisibleAt(ev.timeStamp);
  };
  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  });

  const checkPlayerGame = async () => {
    const gameInfo = await getPlayerGame(gameID);

    if (!gameInfo) {
      history.push(`/join/${gameID}`);
    }
    setPlayerID(gameInfo.playerID);
    setPlayerCredentials(gameInfo.playerCredentials);
  }

  useEffect(() => {
    if (!playerID) {
      checkPlayerGame();
    }
  });
  
  if (!gameID || !playerCredentials) {
    return <Loader type="Grid" color="#00BFFF" height={100} width={100} />
  };

  // Render the game engine. There's an extra layer of function calling
  // here because React was too smart to rerender when we passed in visibleAt
  // (which after all is an unnecessary prop) to the BGIO game client.
  // The below will rerender the engine when the 'visibleAt' timestamp updates.
  const SOCKET_ROOT = `${process.env?.REACT_APP_SOCKET_ROOT || ""}`;
  const socket = SocketIO({ server: SOCKET_ROOT });
  const getEngine = (visibleAt: number) => {
    return Client({
      debug: false,
      game: Rabble({}),
      board: GameScreen,
      multiplayer: socket,
      visibleAt,
    });
  };
  const Engine = getEngine(visibleAt);

  return (
    <Engine
      playerID={playerID}
      gameID={gameID}
      credentials={playerCredentials}
      visibleAt={visibleAt}
    />
  );
};

export default RabbleGameView;
