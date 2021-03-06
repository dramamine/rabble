import React, { useState, useEffect } from "react";
import styles from "./Buttons.module.css";
import { useSelector, useDispatch } from "react-redux";
import { shuffleRack, updateRackTiles } from "./rackSlice";
import {
  clearPlayTiles,
  changeSquareSelection,
  selectPlaySquares,
} from "./boardSlice";
import { playTilesFromSquares } from "../../../game/play";

type ButtonsProps = {
  currentPlayIsValid: boolean;
  currentPlayerHasTurn: boolean;
  tileRack: Tile[];
  playWord: (playSquares: Square[]) => void;
  checkWord: (playSquares: Square[]) => void;
  exchangeTiles: (playTiles: Tile[]) => void;
  endTurn: () => {};
  cleanUp: () => void;
  currentPlayTilesLaid: Tile[];
  currentPlay: any;
  setErrorMessage: (message: string) => void;
};

const Buttons = ({
  currentPlayIsValid,
  currentPlayerHasTurn,
  exchangeTiles,
  playWord,
  checkWord,
  endTurn,
  cleanUp,
  tileRack,
  currentPlayTilesLaid,
  currentPlay,
  setErrorMessage,
}: ButtonsProps) => {
  const dispatch = useDispatch();

  const [played, setPlayed] = useState(false);

  const playSquares = useSelector(selectPlaySquares);

  // If the current play is marked valid, run playWord
  useEffect(() => {
    if (currentPlayIsValid && playSquares.length > 0) {
      playWord(playSquares);
      dispatch(clearPlayTiles());
      dispatch(changeSquareSelection(null));
      setPlayed(true);
      cleanUp();
    }
  }, [currentPlayIsValid, playSquares, dispatch, playWord, cleanUp]);

  // If the user has played but the word is invalid, clear tiles
  useEffect(() => {
    if (!currentPlayIsValid && currentPlayTilesLaid?.length) {
      dispatch(clearPlayTiles());
      dispatch(changeSquareSelection(null));
      setErrorMessage(currentPlay.invalidReason);
      cleanUp();
    }
  }, [
    currentPlayIsValid,
    currentPlayTilesLaid,
    currentPlay.invalidReason,
    cleanUp,
    dispatch,
    setErrorMessage,
  ]);

  // end turn when played is true
  // TODO - timing issue, otherwise endTurn comes too soon after playWord
  // If we try to do this on the server, we get "ERROR: invalid stateID"
  useEffect(() => {
    if (played) {
      setTimeout(() => {
        endTurn();
        setPlayed(false);
      }, 500);
    }
  }, [played, endTurn]);

  return (
    <div className={styles.buttons}>
      {currentPlayerHasTurn && (
        <button
          onClick={() => {
            checkWord(playSquares);
          }}
        >
          play tiles
        </button>
      )}
      <button
        onClick={() => {
          dispatch(shuffleRack());
        }}
      >
        shuffle tiles
      </button>
      <button
        onClick={() => {
          dispatch(clearPlayTiles());
          dispatch(changeSquareSelection(null));
          dispatch(updateRackTiles(tileRack));
          cleanUp();
        }}
      >
        recall tiles
      </button>
      {currentPlayerHasTurn && (
        <button
          onClick={() => {
            dispatch(clearPlayTiles());
            exchangeTiles(playTilesFromSquares(playSquares));
            dispatch(changeSquareSelection(null));
            setPlayed(true);
            cleanUp();
          }}
        >
          exchange tiles
        </button>
      )}
      {currentPlayerHasTurn && (
        <button onClick={() => endTurn()}>pass turn</button>
      )}
    </div>
  );
};

export default Buttons;
