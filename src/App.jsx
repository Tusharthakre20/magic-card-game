import { useEffect, useState } from "react";
import SingleCards from "./components/SingleCards";
import Confetti from "react-confetti";
import useSound from "use-sound";
import flipSound from "/assets/sounds/flipcard.wav";
import matchSound from "/assets/sounds/match.mp3";
import winSound from "/assets/sounds/win.mp3";

const cardImages = [
  { src: "/assets/Images/chariot.png", matched: false },
  { src: "/assets/Images/fool.png", matched: false },
  { src: "/assets/Images/judgement.png", matched: false },
  { src: "/assets/Images/magican.png", matched: false },
  { src: "/assets/Images/strength.png", matched: false },
  { src: "/assets/Images/tower.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);


  const [playFlip] = useSound(flipSound, { html5: true });
  const [playMatch] = useSound(matchSound);
  const [playWin] = useSound(winSound);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setConfetti(false);setIsVibrating(false);
  };

  const handleChoices = (card) => {
    playFlip();
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetTurns = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
    setIsVibrating(false);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              playMatch();
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurns();
        
      } else {
        setTimeout(() => resetTurns(), 1000);
        setIsVibrating(true);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      playWin();
    }
  }, [cards]);

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setConfetti(true);
    }
  }, [cards]);

  return (
    <div className="main">
      {confetti && <Confetti />}
      <h1>Magic Card Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCards
            card={card}
            key={card.id}
            handleChoices={handleChoices}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
            vibrating={isVibrating && (card === choiceOne || card === choiceTwo)}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
