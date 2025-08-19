import { useEffect, useState, useRef, useCallback } from "react";

const ROUND_DURATION = 60;
const COUNTDOWN_DURATION = 3;

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  return isMobile;
}

const NEUTRAL_BG = "bg-blue-700";
const CORRECT_BG = "bg-green-600";
const GAMEOVER_BG = "bg-red-800/80";

const CharadesPlay = ({ deck, onBack }) => {
  const isMobile = useIsMobile();

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [bgColor, setBgColor] = useState(NEUTRAL_BG);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [orientationEnabled, setOrientationEnabled] = useState(false);

  const lastTiltTimeRef = useRef(0);
  const cardsRef = useRef(cards);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const nextCard = useCallback(() => {
    setCurrentCardIndex((prev) => (prev + 1) % cardsRef.current.length);
  }, []);

  const handleCorrect = useCallback(() => {
    const now = Date.now();
    if (now - lastTiltTimeRef.current < 1000) return;
    lastTiltTimeRef.current = now;

    setScore((prev) => prev + 1);
    setBgColor(CORRECT_BG);
    setTimeout(() => {
      setBgColor(NEUTRAL_BG);
      nextCard();
    }, 800);
  }, [nextCard]);

  const handleSkip = useCallback(() => {
    const now = Date.now();
    if (now - lastTiltTimeRef.current < 1000) return;
    lastTiltTimeRef.current = now;

    nextCard();
  }, [nextCard]);

  // Handle orientation changes
  useEffect(() => {
    if (!isMobile) return;
    const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile]);

  // Enable device orientation (must be called on user gesture)
  const enableOrientation = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") setOrientationEnabled(true);
        else console.warn("Orientation permission denied");
      } catch (err) {
        console.warn("Orientation permission error:", err);
      }
    } else {
      setOrientationEnabled(true); // Android usually works
    }
  };
const [gammaValue, setGammaValue] = useState(null);
const[beta,setBeta]= useState(null);
cont [alpha, setAlpha] = useState(null);
const [orientationMode, setOrientationMode] = useState(null);
  // Tilt detection
useEffect(() => {
  if (!isMobile || !isLandscape || !orientationEnabled || countdown > 0 || gameOver) return;

  const handleOrientation = (event) => {
    if (event.gamma === null) return;
    const gamma = event.gamma;
    setGammaValue(gamma.toFixed(2));
    setBeta(event.beta.toFixed(2));
    setAlpha(event.alpha.toFixed(2));

    // If we haven't set orientation yet, determine it from initial gamma
    if (orientationMode === null) {
      setOrientationMode(gamma < 0 ? "buttonsTop" : "buttonsBottom");
    }

    if (orientationMode === "buttonsTop") {
      if (gamma > -70) handleCorrect();
      else if (gamma < 70) handleSkip();
    } else if (orientationMode === "buttonsBottom") {
      if (gamma < 70) handleCorrect();
      else if (gamma > -70) handleSkip();
    }
  };

  window.addEventListener("deviceorientation", handleOrientation);

  return () => {
    window.removeEventListener("deviceorientation", handleOrientation);
  };
}, [isMobile, isLandscape, orientationEnabled, countdown, gameOver, orientationMode, handleCorrect, handleSkip]);

  // Reset game on new deck
  useEffect(() => {
    if (deck && deck.cards) {
      setCards(shuffleArray(deck.cards));
      setCurrentCardIndex(0);
      setScore(0);
      setTimeLeft(ROUND_DURATION);
      setGameOver(false);
      setCountdown(COUNTDOWN_DURATION);
      setBgColor(NEUTRAL_BG);
      lastTiltTimeRef.current = 0;
    }
  }, [deck]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0 || !isLandscape) return;
    const countdownTimer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(countdownTimer);
  }, [countdown, isLandscape]);

  // Round timer
  useEffect(() => {
    if (countdown > 0 || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, timeLeft]);

  // Background reset on game over
  useEffect(() => {
    if (!gameOver) return;
    setBgColor(GAMEOVER_BG);
    const timeout = setTimeout(() => setBgColor(NEUTRAL_BG), 2000);
    return () => clearTimeout(timeout);
  }, [gameOver]);

  const restartGame = () => {
    setScore(0);
    setCurrentCardIndex(0);
    setTimeLeft(ROUND_DURATION);
    setCountdown(COUNTDOWN_DURATION);
    setGameOver(false);
    setCards(shuffleArray(deck.cards));
    setBgColor(NEUTRAL_BG);
    lastTiltTimeRef.current = 0;
  };

  const wrapperClass = (bgColor) => `${bgColor} min-h-screen relative p-6 text-white`;

  // Portrait rotate message
  if (isMobile && !isLandscape) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-blue-700 text-white">
        <p className="text-3xl font-bold mb-4">Please rotate your device</p>
        <p className="text-lg">This game works best in landscape mode.</p>
        <button onClick={onBack} className="mt-6 px-4 py-2 bg-light-100/10 rounded-lg hover:bg-light-100/20 transition-colors">
          ← Back to Decks
        </button>
      </div>
    );
  }

  // Motion permission screen for mobile
  if (isMobile && !orientationEnabled) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-blue-700 text-white">
        <p className="text-2xl mb-4">Tap to enable motion sensors</p>
        <button className="px-6 py-3 bg-green-500 rounded-lg" onClick={enableOrientation}>
          Enable Motion
        </button>
      </div>
    );
  }

  // Countdown screen
  if (countdown > 0) {
    return (
      <div className={wrapperClass(NEUTRAL_BG)}>
        <button onClick={onBack} className="absolute top-6 left-6 px-4 py-2 bg-light-100/10 rounded-lg hover:bg-light-100/20 transition-colors">
          ← Back to Decks
        </button>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <h2 className="text-4xl font-bold mb-4">Get Ready!</h2>
          <p className="text-6xl">{countdown}</p>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <div className={wrapperClass(bgColor)}>
        <button onClick={onBack} className="absolute top-6 left-6 px-4 py-2 bg-light-100/10 rounded-lg hover:bg-light-100/20 transition-colors">
          ← Back to Decks
        </button>
        <div className="flex flex-col justify-center items-center min-h-screen px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Time’s Up!</h2>
          <p className="text-xl mb-4">Final Score: {score}</p>
          <div>
            <button className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition mr-4" onClick={restartGame}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gameplay screen
  return (
    <div className={wrapperClass(bgColor)}>
      <button onClick={onBack} className="absolute top-6 left-6 px-4 py-2 bg-light-100/10 rounded-lg hover:bg-light-100/20 transition-colors">
        ← Back to Decks
      </button>

      <div className="flex flex-col justify-center items-center min-h-screen px-6 text-center w-full">
        <div className="text-xl mb-6">{timeLeft}s</div>
        <p className="mt-4 text-lg">Gamma: {gammaValue ?? "—"}</p>
        <div className="p-8 mb-6 max-w-md w-full">
          <h3 className="text-5xl font-semibold">{cards[currentCardIndex]?.prompt}</h3>
        </div>
        <div className="flex justify-center gap-4 max-w-md w-full">
          <button className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition" onClick={handleCorrect}>
            Correct (+1)
          </button>
          <button className="px-6 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 transition" onClick={handleSkip}>
            Skip
          </button>
        </div>
        <p className="mt-6 text-lg">Score: {score}</p>
      </div>
    </div>
  );
};

export default CharadesPlay;
