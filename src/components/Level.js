import { useEffect, useState } from "react";

export const Level = ({ levelData, setCurrentLevel, delay }) => {

    const [wordList, setWordList] = useState(levelData.wordList);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isShowingAnswer, setIsShowingAnswer] = useState(false);
    const [firstWord, setFirstWord] = useState(null);
    const [diffIndexes, setDiffIndexes] = useState([]);

    useEffect(() => {
        const diffIndexes = [];
        if (currentIndex === -1) {
            let firstWord = handleFirstWord();
            setFirstWord(firstWord);
            firstWord.content.map((char, index) => {
                if (char === ' ') {
                    diffIndexes.push(index);
                }
            })
            setDiffIndexes(diffIndexes);
        }
        if (currentIndex >= 0) {
            setIsShowingAnswer(true);
            setTimeout(() => {
                setIsShowingAnswer(false);
                wordList[currentIndex].content.map((char, index) => {
                    if (wordList[currentIndex + 1].content[index] !== char) {
                        diffIndexes.push(index);
                    }
                })
                setDiffIndexes(diffIndexes);
            }, delay * 1000);
        }
    }, [currentIndex]);

    const renderHandler = () => {
        if (currentIndex === -1) {
            return <div style={{ "display": "flex", "justifyContent": "center" }}>
                {renderWord(firstWord)}
            </div>
        }
        return <div style={{ "display": "flex", "justifyContent": "center" }}>
            {renderWord(wordList[currentIndex])}
        </div>
    }

    const handleFirstWord = () => {
        let firstWord = JSON.parse(JSON.stringify(wordList[0]));
        while (firstWord.content.reduce((a, v) => (v === ' ' ? a + 1 : a), 0) != levelData.charDiffCount) {
            const randomIndex = Math.floor(Math.random() * levelData.charCount);
            firstWord.content[randomIndex] = ' ';
        }
        return firstWord;
    }

    const diffWord = (char, index) => {
        if (isShowingAnswer) {
            return false;
        }
        if (char === ' ') {
            return true;
        }
        if (currentIndex === -1) {
            return false;
        }
        if (currentIndex != wordList.length - 1 && wordList[currentIndex + 1].content[index] !== char) {
            return true;
        }
        return false;
    }

    const rotate = (char, index) => {
        if (isShowingAnswer && diffIndexes.includes(index)) {
            return true;
        }
        return false;
    }

    const renderWord = (word) => word && word.content.map((char, index) =>
        <div key={`${levelData.level}-${index}`} className={`char ${diffWord(char, index) ? 'teal lighten-3' : ''} ${rotate(char, index) ? 'rotate' : ''}`}>
            {char}
        </div>
    )

    return (
        <div className="min-h-screen vert-center">
            <h1>Level {levelData.level}</h1>
            {wordList.length > 0 && renderHandler()}
            <div className="description">
                {currentIndex !== wordList.length - 1 && <>
                    <div>Word No. {isShowingAnswer ? currentIndex + 1 : currentIndex + 2}/{wordList.length}</div>
                    <div>{wordList[isShowingAnswer ? currentIndex : currentIndex + 1].en}</div>
                    <div>{wordList[isShowingAnswer ? currentIndex : currentIndex + 1].ja}</div>
                </>}
            </div>
            <div>
                {currentIndex !== wordList.length - 1 &&
                    <button className="waves-effect waves-light btn mx-5"
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        disabled={isShowingAnswer}>
                        Next
                    </button>
                }
                <button className="waves-effect waves-light btn mx-5"
                    onClick={() => setCurrentLevel(null)}>
                    Back to level list
                </button>
            </div>
        </div>
    );
}