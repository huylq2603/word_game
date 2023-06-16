import { useEffect, useState } from "react";
import { Level } from "./Level";

export const GameScene = () => {

    const [gameData, setGameData] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [delay, setDelay] = useState(1);


    useEffect(() => {
        fetch('/game_data_20230623.json') // local: /word_game/<...>.json, deployed: /<...>.json
            .then((res) => res.json())
            .then((data) => {
                setGameData(data);
            });
    }, []);

    const renderLevelList = gameData.map((levelData, index) =>
        <div key={levelData.level} className="col s6">
            <div className="card blue-grey darken-1 pointer my-5" onClick={() => setCurrentLevel(levelData)}>
                <div className="card-content white-text">
                    <span className="card-title">Level {levelData.level}</span>
                    <p>Total: {levelData.wordList.length} words</p>
                    <p>Number of characters per word: {levelData.charCount}</p>
                    <p>Language: {levelData.lang === 'en' ? 'English' : 'Japanese'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container center vert-center min-h-screen">
            {!currentLevel && <>
                <div>
                    <h1>Word Guesser</h1>
                    <div className="input-field">
                        <input value={delay} onChange={e => setDelay(e.target.value)} id="delay" type="text" />
                        <label className="active" htmlFor="delay">Delay Between Words (seconds)</label>
                    </div>
                </div>
                <div className="row">
                    {renderLevelList}
                </div>
            </>}
            {currentLevel && <Level levelData={currentLevel} setCurrentLevel={setCurrentLevel} delay={delay} />}
        </div>
    );
}