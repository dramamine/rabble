import React, { useEffect, useState } from "react";
import styles from "./home.module.css";
import { getUserInfo } from "../../app/asyncStorage";
import GameList from "./GameList";
import { Link } from "react-router-dom";

const Home = () => {
  const [nickname, setNickname] = useState('');
  const [gamesByID, setGamesByID] = useState<Games>({});
  const [hasRetrieved, setHasRetrieved] = useState(false);
  
  const checkUserInfo = async () => {
    const userInfo = await getUserInfo();
    setNickname(userInfo.nickname);
    setGamesByID(userInfo.games);
    setHasRetrieved(true);
  };

  useEffect(() => {
    if (!hasRetrieved) {
      checkUserInfo();
    }    
  });

  const arrayOfGames = Object.keys(gamesByID).map(key => gamesByID[key]);  // @TODO help??

  let greeting = "Welcome to Rabble!";
  if (nickname) {
    greeting = `Welcome, ${nickname}`;
  }

  return (
    <div className={styles.content}>
      <h3>{greeting}</h3>
      {arrayOfGames && arrayOfGames.length ? (
        <GameList games={arrayOfGames} />
      ) : (
        <Link to="/create">New Game</Link>
      )}
    </div>
  );
};

export default Home;
