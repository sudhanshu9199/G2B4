import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Trash2, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  CheckCircle,
  HelpCircle,
  Code,
  Joystick,
  SkipForward,
  Sparkles,
  Sun,
  Moon,
  Trophy,
  BookOpen,
  Compass,
  Award,
  Check,
  X
} from 'lucide-react';
import { sound } from './utils/audio';

// Grid Constants
const ROWS_COUNT = 4;
const COLS_COUNT = 4;

const START_POS = { row: 3, col: 0 }; // A4 (bottom-left)
const GIFT_POS = { row: 0, col: 0 };  // A1 (top-left)
const CAKE_POS = { row: 2, col: 2 };  // C3 (middle-ish)
const MEAL_POS = { row: 0, col: 3 };  // D1 (top-right)

// Custom SVGs for game assets
const CatSvg = ({ animationState, direction }) => {
  let catClass = "sprite cat ";
  if (animationState === 'moving') catClass += 'moving';
  if (animationState === 'bumping') catClass += 'bumping';
  if (animationState === 'celebrating') catClass += 'celebrating';

  const transformStyle = direction === 'LEFT' ? 'scaleX(-1)' : 'scaleX(1)';

  return (
    <svg className={catClass} viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: transformStyle, transition: 'transform 0.2s ease' }}>
      {/* Tail */}
      <path d="M15,65 Q5,50 15,35 Q20,32 18,45 Q15,55 23,60 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      {/* Ears */}
      <polygon points="35,30 25,10 42,22" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      <polygon points="37,28 29,14 41,22" fill="#fee2e2" />
      
      <polygon points="65,30 75,10 58,22" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      <polygon points="63,28 71,14 59,22" fill="#fee2e2" />
      
      {/* Body */}
      <ellipse cx="50" cy="62" rx="22" ry="18" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      <ellipse cx="50" cy="62" rx="14" ry="10" fill="#fff" />
      
      {/* Head */}
      <circle cx="50" cy="38" r="18" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
      
      {/* Face details */}
      {/* Eyes */}
      <circle cx="43" cy="34" r="4.5" fill="#fff" stroke="#000" strokeWidth="1" />
      <g className="eye-pupil blinking" style={{ transformOrigin: '43px 34px' }}>
        <circle cx="44.5" cy="34" r="2" fill="#22c55e" /> {/* Green iris */}
        <circle cx="44.5" cy="34" r="1" fill="#000" />
        <circle cx="43.5" cy="33" r="0.8" fill="#fff" /> {/* Highlight */}
      </g>

      <circle cx="57" cy="34" r="4.5" fill="#fff" stroke="#000" strokeWidth="1" />
      <g className="eye-pupil blinking" style={{ transformOrigin: '57px 34px' }}>
        <circle cx="55.5" cy="34" r="2" fill="#22c55e" /> {/* Green iris */}
        <circle cx="55.5" cy="34" r="1" fill="#000" />
        <circle cx="54.5" cy="33" r="0.8" fill="#fff" /> {/* Highlight */}
      </g>

      {/* Cheeks */}
      <circle cx="37" cy="41" r="2.5" fill="#f43f5e" opacity="0.5" />
      <circle cx="63" cy="41" r="2.5" fill="#f43f5e" opacity="0.5" />

      {/* Nose */}
      <polygon points="50,39 47,36 53,36" fill="#f43f5e" />

      {/* Mouth */}
      <path d="M47,42 Q50,45 50,42 Q50,45 53,42" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="30" y1="38" x2="18" y2="36" stroke="#64748b" strokeWidth="1.5" />
      <line x1="30" y1="41" x2="16" y2="41" stroke="#64748b" strokeWidth="1.5" />
      <line x1="30" y1="44" x2="18" y2="46" stroke="#64748b" strokeWidth="1.5" />
      
      <line x1="70" y1="38" x2="82" y2="36" stroke="#64748b" strokeWidth="1.5" />
      <line x1="70" y1="41" x2="84" y2="41" stroke="#64748b" strokeWidth="1.5" />
      <line x1="70" y1="44" x2="82" y2="46" stroke="#64748b" strokeWidth="1.5" />

      {/* Paws */}
      <circle cx="36" cy="78" r="5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <circle cx="44" cy="80" r="5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <circle cx="56" cy="80" r="5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <circle cx="64" cy="78" r="5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
    </svg>
  );
};

const GiftSprite = ({ collected }) => {
  return (
    <svg className={`sprite item gift ${collected ? 'collected' : ''}`} viewBox="0 0 100 100" style={{ width: '85%', height: '85%' }}>
      {/* Shadows */}
      <ellipse cx="50" cy="85" rx="28" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Box */}
      <rect x="22" y="38" width="56" height="42" fill="#22d3ee" stroke="#0891b2" strokeWidth="2.5" rx="4" />
      {/* Cover lid */}
      <rect x="18" y="28" width="64" height="12" fill="#06b6d4" stroke="#0891b2" strokeWidth="2.5" rx="3" />
      
      {/* Heart decorations on Box */}
      <circle cx="32" cy="50" r="3" fill="#fee2e2" />
      <circle cx="68" cy="50" r="3" fill="#fee2e2" />
      <circle cx="38" cy="68" r="3" fill="#fee2e2" />
      <circle cx="62" cy="68" r="3" fill="#fee2e2" />
      <circle cx="50" cy="58" r="3.5" fill="#fee2e2" />

      {/* Ribbon lines */}
      <rect x="46" y="38" width="8" height="42" fill="#ec4899" />
      <rect x="46" y="28" width="8" height="12" fill="#db2777" />

      {/* Big Bow ribbon on top */}
      <path d="M47,28 C32,12 25,28 47,28 Z" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
      <path d="M53,28 C68,12 75,28 53,28 Z" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
      <circle cx="50" cy="28" r="6.5" fill="#db2777" />
    </svg>
  );
};

const CakeSprite = ({ collected }) => {
  return (
    <svg className={`sprite item cake ${collected ? 'collected' : ''}`} viewBox="0 0 100 100" style={{ width: '85%', height: '85%' }}>
      {/* Shadows */}
      <ellipse cx="50" cy="88" rx="32" ry="5" fill="rgba(0,0,0,0.15)" />
      
      {/* Plate */}
      <ellipse cx="50" cy="82" rx="34" ry="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />
      
      {/* Cake Tier 1 (Bottom) */}
      <path d="M22,60 C22,60 22,80 50,80 C78,80 78,60 78,60 L78,60 L22,60" fill="#a855f7" stroke="#7e22ce" strokeWidth="2.5" />
      <rect x="22" y="60" width="56" height="16" fill="#c084fc" />
      {/* Drips/Frosting */}
      <path d="M22,60 C22,60 28,68 34,60 C40,52 46,68 52,60 C58,52 64,68 70,60 C76,52 78,60 78,60" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />

      {/* Cake Tier 2 (Top) */}
      <path d="M30,42 L70,42 L70,60 L30,60 Z" fill="#c084fc" stroke="#7e22ce" strokeWidth="2.5" />
      {/* Drips/Frosting Tier 2 */}
      <path d="M30,42 C30,42 36,48 42,42 C48,36 54,48 60,42 C66,36 70,42 70,42" fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />

      {/* Candles */}
      <rect x="38" y="24" width="4" height="18" fill="#3b82f6" rx="1" />
      <rect x="50" y="20" width="4" height="22" fill="#eab308" rx="1" />
      <rect x="62" y="24" width="4" height="18" fill="#ec4899" rx="1" />
      
      {/* Flame Sparkles */}
      <path d="M40,16 Q38,10 40,6 Q42,10 40,16 Z" fill="#f97316" />
      <circle cx="40" cy="12" r="1.5" fill="#fde047" />

      <path d="M52,12 Q50,6 52,2 Q54,6 52,12 Z" fill="#f97316" />
      <circle cx="52" cy="8" r="1.5" fill="#fde047" />

      <path d="M64,16 Q62,10 64,6 Q66,10 64,16 Z" fill="#f97316" />
      <circle cx="64" cy="12" r="1.5" fill="#fde047" />
    </svg>
  );
};

const MealSprite = ({ collected }) => {
  return (
    <svg className={`sprite item meal ${collected ? 'collected' : ''}`} viewBox="0 0 100 100" style={{ width: '85%', height: '85%' }}>
      {/* Shadows */}
      <ellipse cx="50" cy="86" rx="36" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Platter Plate */}
      <ellipse cx="50" cy="80" rx="38" ry="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2.5" />

      {/* Juice glass (right side) */}
      <rect x="62" y="38" width="16" height="38" fill="#10b981" opacity="0.6" stroke="#047857" strokeWidth="1.5" rx="2" />
      <rect x="64" y="44" width="12" height="30" fill="#f97316" rx="1" /> {/* Orange Drink */}
      {/* Straw */}
      <line x1="68" y1="52" x2="60" y2="24" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="24" x2="52" y2="28" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
      {/* Lemon slice */}
      <circle cx="78" cy="42" r="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
      <circle cx="78" cy="42" r="3.5" fill="#fef08a" />

      {/* Fries box (left side) */}
      <polygon points="18,48 34,48 32,76 20,76" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
      {/* Yellow stripes on box */}
      <rect x="23" y="52" width="8" height="20" fill="#fde047" rx="1" />
      {/* French fries sticks sticking out */}
      <rect x="19" y="32" width="3" height="18" fill="#facc15" rx="1" transform="rotate(-10, 19, 32)" />
      <rect x="23" y="28" width="3" height="22" fill="#eab308" rx="1" />
      <rect x="27" y="30" width="3" height="20" fill="#facc15" rx="1" transform="rotate(5, 27, 30)" />
      <rect x="31" y="34" width="3" height="16" fill="#eab308" rx="1" transform="rotate(15, 31, 34)" />
      
      {/* Burger (Center) */}
      {/* Bottom Bun */}
      <path d="M30,76 C30,76 30,80 48,80 C66,80 66,76 66,76 Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="2" />
      {/* Patty */}
      <rect x="28" y="70" width="40" height="6" fill="#78350f" rx="3" stroke="#451a03" strokeWidth="1" />
      {/* Cheese */}
      <polygon points="27,70 69,70 64,74 58,70 48,74 38,70" fill="#eab308" />
      {/* Lettuce */}
      <path d="M26,67 C28,65 30,69 32,67 C34,65 36,69 38,67 C40,65 42,69 44,67 C46,65 48,69 50,67 C52,65 54,69 56,67 C58,65 60,69 62,67 C64,65 66,69 68,67 C70,65 72,67 72,67" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
      {/* Top Bun */}
      <path d="M28,64 C28,64 28,50 48,50 C68,50 68,64 68,64 Z" fill="#d97706" stroke="#854d0e" strokeWidth="2" />
      {/* Sesame seeds */}
      <ellipse cx="40" cy="56" rx="1.5" ry="0.8" fill="#fef08a" />
      <ellipse cx="48" cy="54" rx="1.5" ry="0.8" fill="#fef08a" transform="rotate(30, 48, 54)" />
      <ellipse cx="56" cy="57" rx="1.5" ry="0.8" fill="#fef08a" transform="rotate(-15, 56, 57)" />
    </svg>
  );
};

// Paw Print SVG component
const PawPrintSvg = () => (
  <svg className="paw-print" viewBox="0 0 24 24">
    <ellipse cx="12" cy="15" rx="5" ry="4" />
    <circle cx="6" cy="9" r="2.2" />
    <circle cx="10" cy="6.5" r="2.2" />
    <circle cx="14" cy="6.5" r="2.2" />
    <circle cx="18" cy="9" r="2.2" />
  </svg>
);

// MCQ Quiz questions list
const QUIZ_QUESTIONS = [
  {
    question: "What is a sequence?",
    options: [
      "A magic spell to turn a frog into a prince 🐸",
      "A list of steps in a special order to do a task 🌟",
      "A type of food that Scratchy eats for dinner 🍔"
    ],
    correctAnswer: 1,
    explanation: "A sequence is a list of steps in a special order to do a task! Order is very important!"
  },
  {
    question: "What is an instruction?",
    options: [
      "A single step or command that tells Scratchy what to do 🌟",
      "A box of crayons for coloring cards",
      "A birthday gift from Merlin the Wizard 🎁"
    ],
    correctAnswer: 0,
    explanation: "An instruction is a single step that tells someone or a computer what to do."
  },
  {
    question: "If Scratchy puts on his shoes first, can he put on his socks?",
    options: [
      "Yes, socks easily go over shoes!",
      "No, socks must go on BEFORE shoes! 🌟",
      "The shoes will wiggle and eat the socks!"
    ],
    correctAnswer: 1,
    explanation: "Socks first, then shoes! That is the correct sequence of steps."
  },
  {
    question: "Why does Scratchy need to follow instructions in the exact sequence?",
    options: [
      "So he gets the rewards in the right order and completes his task! 🌟",
      "Because he will get lost in the galaxy",
      "So he can grow wings and fly away"
    ],
    correctAnswer: 0,
    explanation: "If Scratchy eats the meal first, he won't collect the gift or cake! Correct sequence makes things work."
  }
];

// Celebration Confetti Canvas
const CelebrationCanvas = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#fb923c'];
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 5 + 3,
      angle: Math.random() * 360,
      spinSpeed: Math.random() * 4 - 2,
      wobble: Math.random() * 20,
      wobbleSpeed: Math.random() * 0.05 + 0.02
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speed;
        p.angle += p.spinSpeed;
        p.wobble += p.wobbleSpeed;
        
        // Horizontal oscillation
        const px = p.x + Math.sin(p.wobble) * 12;

        ctx.save();
        ctx.translate(px, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        
        // Randomly draw squares or circles
        if (p.size % 2 === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size / 2, p.size / 1.3, 0, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.restore();

        // Recycle particles
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
          p.speed = Math.random() * 5 + 3;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99
      }}
    />
  );
};

export default function App() {
  const [theme, setTheme] = useState('night'); // 'night' | 'day'
  const [activeTab, setActiveTab] = useState('play'); // 'play' | 'learn' | 'quiz'

  const [catPos, setCatPos] = useState(START_POS);
  const [catDirection, setCatDirection] = useState('RIGHT'); // 'LEFT' | 'RIGHT'
  const [giftCollected, setGiftCollected] = useState(false);
  const [cakeCollected, setCakeCollected] = useState(false);
  const [mealCollected, setMealCollected] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0); // 0: Gift, 1: Cake, 2: Meal, 3: Completed
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [controlMode, setControlMode] = useState('code'); // 'code' | 'manual'
  const [programQueue, setProgramQueue] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeBlockIndex, setActiveBlockIndex] = useState(-1);
  const [errorBlockIndex, setErrorBlockIndex] = useState(-1);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won'
  const [pawPrints, setPawPrints] = useState([]); // List of {row, col}
  const [showHint, setShowHint] = useState(false);

  // MCQ Quiz States
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizBadge, setQuizBadge] = useState(false);

  // Card Sorting States (Daily Sequence Mini-game)
  const initialCards = [
    { id: '1', text: 'Dig a hole in the soil 🕳️', emoji: '🕳️', order: 0 },
    { id: '2', text: 'Plant the flower seed 🌱', emoji: '🌱', order: 1 },
    { id: '3', text: 'Water the soil gently 🚿', emoji: '🚿', order: 2 },
    { id: '4', text: 'Sun helps the flower grow 🌻', emoji: '🌻', order: 3 }
  ];
  const [sortingCards, setSortingCards] = useState([]);
  const [isSortingSolved, setIsSortingSolved] = useState(false);

  // Shuffle cards on tab switch / mount
  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...initialCards].sort(() => Math.random() - 0.5);
    setSortingCards(shuffled);
    setIsSortingSolved(false);
  };

  // Derived state to check if program is executing (running or stepping)
  const isExecuting = isRunning || currentStepIndex !== -1;

  // Grade 2 specific speech bubble helper
  const [guideText, setGuideText] = useState('Help me collect the items in the correct order! First 🎁, then 🎂, and finally 🍔!');
  const [wizardState, setWizardState] = useState('🧙‍♂️');
  const [catAnimationState, setCatAnimationState] = useState(''); // 'moving' | 'bumping' | 'celebrating'

  // Ref to track state in intervals
  const stateRef = useRef({ catPos, giftCollected, cakeCollected, mealCollected, isRunning, gameStatus, seqIndex });
  useEffect(() => {
    stateRef.current = { catPos, giftCollected, cakeCollected, mealCollected, isRunning, gameStatus, seqIndex };
  }, [catPos, giftCollected, cakeCollected, mealCollected, isRunning, gameStatus, seqIndex]);

  // Sparkles background coordinates
  const [sparkles, setSparkles] = useState([]);
  useEffect(() => {
    const newSparkles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      size: `${Math.random() * 0.8 + 0.5}rem`
    }));
    setSparkles(newSparkles);
  }, []);

  // Keyboard controls for Manual Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (controlMode !== 'manual' || isExecuting || gameStatus === 'won' || activeTab !== 'play') return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          executeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          executeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          executeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          executeDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controlMode, isExecuting, gameStatus, activeTab]);

  // Play click audio helper
  const playSound = (soundFunc) => {
    if (soundEnabled) {
      soundFunc();
    }
  };

  // Convert row/col to coordinate system (e.g. Col 0 Row 3 -> A4)
  const getCellCoordinate = (row, col) => {
    const letters = ['A', 'B', 'C', 'D'];
    const numbers = ['1', '2', '3', '4'];
    return `${letters[col]}${numbers[row]}`;
  };

  // Check if position is match
  const isPosEqual = (p1, p2) => p1.row === p2.row && p1.col === p2.col;

  // Single step movement logic
  const executeDirection = (direction, isFromProgram = false) => {
    const { catPos, giftCollected: gift, cakeCollected: cake, mealCollected: meal, seqIndex: currentSeq } = stateRef.current;
    const { row, col } = catPos;
    let newRow = row;
    let newCol = col;

    if (direction === 'LEFT') setCatDirection('LEFT');
    if (direction === 'RIGHT') setCatDirection('RIGHT');

    switch (direction) {
      case 'UP':
        newRow = row - 1;
        break;
      case 'DOWN':
        newRow = row + 1;
        break;
      case 'LEFT':
        newCol = col - 1;
        break;
      case 'RIGHT':
        newCol = col + 1;
        break;
      default:
        return false;
    }

    // Boundary Check
    if (newRow < 0 || newRow >= ROWS_COUNT || newCol < 0 || newCol >= COLS_COUNT) {
      playSound(sound.bump);
      setCatAnimationState('bumping');
      setWizardState('🧙‍♀️');
      setGuideText(`BUMP! 🙀 I can't go off the grid! Grid borders are too high!`);
      setTimeout(() => {
        setCatAnimationState('');
      }, 500);
      return false; // Collision
    }

    // Valid movement
    playSound(sound.move);
    setCatAnimationState('moving');
    const newPos = { row: newRow, col: newCol };
    setCatPos(newPos);
    
    // Add to paw prints trail
    setPawPrints(prev => [...prev, newPos]);

    setTimeout(() => {
      setCatAnimationState('');
    }, 250);

    // Sequence Checkpoints validation
    if (isPosEqual(newPos, GIFT_POS)) {
      if (currentSeq === 0) {
        setGiftCollected(true);
        setSeqIndex(1);
        playSound(sound.collect);
        setWizardState('🧙‍♂️');
        setGuideText(`Awesome! 🎁 You collected the Gift at A1! Next, let's find the Cake 🎂 at C3!`);
      }
    } 
    else if (isPosEqual(newPos, CAKE_POS)) {
      if (currentSeq === 1) {
        setCakeCollected(true);
        setSeqIndex(2);
        playSound(sound.collect);
        setWizardState('🧙‍♂️');
        setGuideText(`Yum! 🎂 That cake at C3 is delicious! Last step: let's go eat the Meal 🍔 at D1!`);
      } else if (currentSeq < 1) {
        playSound(sound.error);
        setWizardState('🧙‍♀️');
        setGuideText(`Hold on! 🚨 Scratchy must collect the Gift 🎁 first! Check your sequence!`);
        if (isFromProgram) {
          return 'HALT_SEQUENCE_ERROR';
        }
      }
    } 
    else if (isPosEqual(newPos, MEAL_POS)) {
      if (currentSeq === 2) {
        setMealCollected(true);
        setSeqIndex(3);
        setGameStatus('won');
        setCatAnimationState('celebrating');
        playSound(sound.win);
        setWizardState('🧙‍♂️');
        setGuideText(`Magic completed! 🌟 Scratchy completed the Sequence Task successfully! 🍔🎉`);
      } else if (currentSeq < 2) {
        playSound(sound.error);
        setWizardState('🧙‍♀️');
        if (currentSeq === 0) {
          setGuideText(`Wait! 🚨 Scratchy needs to collect the Gift 🎁 first, then the Cake 🎂, before eating the Meal!`);
        } else {
          setGuideText(`Not yet! 🚨 Scratchy must eat the Cake 🎂 before eating the Meal!`);
        }
        if (isFromProgram) {
          return 'HALT_SEQUENCE_ERROR';
        }
      }
    }
    return true; // Successfully moved
  };

  // Add block to queue
  const addBlockToQueue = (dir) => {
    if (isRunning || gameStatus === 'won') return;
    playSound(sound.click);
    setErrorBlockIndex(-1);
    setProgramQueue([...programQueue, dir]);
    
    if (programQueue.length === 0) {
      setGuideText(`Block added! Click more blocks to build a path to the Gift 🎁, Cake 🎂, and Meal 🍔.`);
    }
  };

  // Delete specific block from queue
  const removeBlockFromQueue = (index) => {
    if (isRunning || gameStatus === 'won') return;
    playSound(sound.click);
    setErrorBlockIndex(-1);
    const newQueue = [...programQueue];
    newQueue.splice(index, 1);
    setProgramQueue(newQueue);
  };

  // Clear program queue
  const clearProgramQueue = () => {
    playSound(sound.click);
    setProgramQueue([]);
    setActiveBlockIndex(-1);
    setErrorBlockIndex(-1);
    setGuideText(`Program cleared! Snap together some blue, orange, pink and green blocks!`);
  };

  // Run the sequence coding program
  const runProgram = () => {
    if (programQueue.length === 0 || isExecuting || gameStatus === 'won') return;
    
    playSound(sound.click);
    setIsRunning(true);
    setCurrentStepIndex(-1);
    setActiveBlockIndex(0);
    setErrorBlockIndex(-1);
    setWizardState('🧙‍♂️');
    setGuideText(`Running program... 🚀 Watch Scratchy follow your sequence!`);
    
    let index = 0;
    
    const executeStep = () => {
      if (!stateRef.current.isRunning) {
        return;
      }

      if (stateRef.current.gameStatus === 'won') {
        setIsRunning(false);
        setActiveBlockIndex(-1);
        return;
      }

      if (index >= programQueue.length) {
        setIsRunning(false);
        setActiveBlockIndex(-1);
        
        setTimeout(() => {
          const { gameStatus: status } = stateRef.current;
          if (status !== 'won') {
            playSound(sound.error);
            setWizardState('🧙‍♀️');
            setGuideText(`Finished moves, but we didn't complete the full sequence! Let's check our blocks and reset the Cat! 🪄`);
          }
        }, 300);
        return;
      }

      setActiveBlockIndex(index);
      const currentDir = programQueue[index];
      const success = executeDirection(currentDir, true);

      if (success === 'HALT_SEQUENCE_ERROR') {
        setIsRunning(false);
        setErrorBlockIndex(index);
        setActiveBlockIndex(-1);
        playSound(sound.incorrect);
        setGuideText(`Oops! 🙀 Sequence broken at block ${index + 1}! Scratchy tried to collect items out of order! Click Reset and fix the blocks.`);
        return;
      }

      if (!success) {
        setIsRunning(false);
        setErrorBlockIndex(index);
        setActiveBlockIndex(-1);
        return;
      }

      index++;
      setTimeout(executeStep, 800);
    };

    setTimeout(executeStep, 400);
  };

  // Step the program block by block
  const stepProgram = () => {
    if (programQueue.length === 0 || isExecuting || gameStatus === 'won') return;

    playSound(sound.click);
    setErrorBlockIndex(-1);
    
    let nextIndex = currentStepIndex + 1;
    
    if (currentStepIndex === -1) {
      resetGameProgress();
      nextIndex = 0;
    }

    setWizardState('🧙‍♂️');
    setGuideText(`Stepping through program... 🔍 Block ${nextIndex + 1} of ${programQueue.length}`);
    setCurrentStepIndex(nextIndex);
    setActiveBlockIndex(nextIndex);

    const currentDir = programQueue[nextIndex];
    const success = executeDirection(currentDir, true);

    if (success === 'HALT_SEQUENCE_ERROR') {
      setCurrentStepIndex(-1);
      setActiveBlockIndex(-1);
      setErrorBlockIndex(nextIndex);
      playSound(sound.incorrect);
      setGuideText(`Oops! 🙀 Sequence broken at block ${nextIndex + 1}! Scratchy tried to collect items out of order! Click Reset and fix the blocks.`);
      return;
    }

    if (!success || nextIndex === programQueue.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(-1);
        setActiveBlockIndex(-1);
        
        const { gameStatus: status } = stateRef.current;
        if (status === 'won') {
          return;
        }
        
        if (!success) {
          setErrorBlockIndex(nextIndex);
          return;
        }

        playSound(sound.error);
        setWizardState('🧙‍♀️');
        setGuideText(`Finished all blocks, but we didn't complete the sequence! Try rearranging your blocks. 🪄`);
      }, 800);
    }
  };

  // Reset cat and target collection states
  const resetGameProgress = () => {
    setCatPos(START_POS);
    setGiftCollected(false);
    setCakeCollected(false);
    setMealCollected(false);
    setSeqIndex(0);
    setCatDirection('RIGHT');
    setCatAnimationState('');
    setPawPrints([]);
    setErrorBlockIndex(-1);
  };

  // Full reset button click
  const handleFullReset = () => {
    playSound(sound.click);
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setActiveBlockIndex(-1);
    resetGameProgress();
    setGameStatus('playing');
    setWizardState('🧙‍♂️');
    setGuideText(`Reset completed! Help Scratchy collect: Gift 🎁 ➔ Cake 🎂 ➔ Meal 🍔!`);
  };

  // Card Sorting daily sequencer shift
  const shiftCard = (index, dir) => {
    if (isSortingSolved) return;
    playSound(sound.flip);
    const newIdx = dir === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sortingCards.length) return;

    const updated = [...sortingCards];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setSortingCards(updated);

    // Verify order
    const isSorted = updated.every((c, i) => c.order === i);
    if (isSorted) {
      setIsSortingSolved(true);
      playSound(sound.win);
      setWizardState('🧙‍♂️');
      setGuideText(`Magnificent! 🌻 You put the flower planting instructions in the correct sequence! You are ready to code the cat!`);
    }
  };

  // MCQ Quiz Handlers
  const handleAnswerSelect = (optIdx) => {
    if (answerChecked) return;
    playSound(sound.click);
    setSelectedAnswer(optIdx);
  };

  const checkQuizAnswer = () => {
    if (selectedAnswer === null || answerChecked) return;
    const currentQuestion = QUIZ_QUESTIONS[quizQuestionIdx];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswerChecked(true);

    if (isCorrect) {
      playSound(sound.correct);
      setQuizScore(prev => prev + 1);
      setWizardState('🧙‍♂️');
      setGuideText(`Spot on! 🌟 ${currentQuestion.explanation}`);
    } else {
      playSound(sound.incorrect);
      setWizardState('🧙‍♀️');
      setGuideText(`Not quite! 🪄 Let's see: socks must go on before shoes, and a sequence is steps in order!`);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    if (quizQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      playSound(sound.click);
      setQuizQuestionIdx(prev => prev + 1);
      setWizardState('🧙‍♂️');
      setGuideText(`Here is the next question! Keep thinking about sequencing!`);
    } else {
      playSound(sound.win);
      setQuizCompleted(true);
      if (quizScore >= 3) {
        setQuizBadge(true);
      }
      setWizardState('🧙‍♂️');
      setGuideText(`Congratulations on completing the Quiz! You got a score of ${quizScore}/${QUIZ_QUESTIONS.length}!`);
    }
  };

  const restartQuiz = () => {
    playSound(sound.click);
    setQuizQuestionIdx(0);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setQuizBadge(false);
    setWizardState('🧙‍♂️');
    setGuideText(`Welcome back to the Quiz! Let's get all stars!`);
  };

  // Magic Hint toggle
  const toggleHint = () => {
    playSound(sound.click);
    setShowHint(!showHint);
    if (!showHint) {
      let nextTarget = "A1";
      if (seqIndex === 1) nextTarget = "C3";
      if (seqIndex === 2) nextTarget = "D1";
      setWizardState('🧙‍♂️');
      setGuideText(`Abracadabra! 🪄 I've highlighted the cell you need to reach next: ${nextTarget}!`);
    } else {
      setWizardState('🧙‍♂️');
      setGuideText(`Hint hidden! Let's see if you can solve the path by yourself!`);
    }
  };

  // Theme Toggler
  const toggleTheme = () => {
    playSound(sound.click);
    const newTheme = theme === 'night' ? 'day' : 'night';
    setTheme(newTheme);
    setGuideText(`Theme changed to ${newTheme === 'day' ? 'Day Dream Mode ☀️' : 'Magic Night Mode 🌌'}!`);
  };

  return (
    <div className={`app-container ${theme === 'day' ? 'day-dream' : 'magic-night'}`}>
      
      {/* Background Sparkles for Night Mode */}
      {theme === 'night' && (
        <div className="sparkles-bg">
          {sparkles.map((s) => (
            <div 
              key={s.id} 
              className="sparkle" 
              style={{ 
                left: s.left, 
                top: s.top, 
                animationDelay: s.delay, 
                fontSize: s.size 
              }}
            >
              ✦
            </div>
          ))}
        </div>
      )}

      {/* Theme Toggler top-left */}
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        title="Toggle Day/Night Theme"
      >
        {theme === 'night' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Confetti Celebration */}
      <CelebrationCanvas active={gameStatus === 'won' || isSortingSolved || (quizCompleted && quizBadge)} />

      {/* Mute/Unmute top-right */}
      <button 
        className="sound-toggle" 
        onClick={() => setSoundEnabled(!soundEnabled)}
        title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
      >
        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Header */}
      <header className="header">
        <h1>
          <span>✨</span> Sequence Magic <span>✨</span>
        </h1>
        <p>Learn computational thinking by placing instructions in the perfect order!</p>
      </header>

      {/* Tab Selector Hub */}
      <div className="app-tabs">
        <button 
          className={`app-tab-btn ${activeTab === 'play' ? 'active' : ''}`}
          onClick={() => {
            playSound(sound.click);
            setActiveTab('play');
            handleFullReset();
          }}
        >
          <Compass size={20} /> Play Game
        </button>
        <button 
          className={`app-tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
          onClick={() => {
            playSound(sound.click);
            setActiveTab('learn');
            shuffleCards();
          }}
        >
          <BookOpen size={20} /> Learning Zone
        </button>
        <button 
          className={`app-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => {
            playSound(sound.click);
            setActiveTab('quiz');
            restartQuiz();
          }}
        >
          <Award size={20} /> Magic Quiz
        </button>
      </div>

      {/* TAB 1: MAIN GAME AREA */}
      {activeTab === 'play' && (
        <main className="main-content">
          
          {/* Left Column: Speech Bubble & Grid Board */}
          <section className="game-area">
            
            {/* Guide Bubble Panel */}
            <div className="glass-panel wizard-guide" style={{ width: '100%', boxSizing: 'border-box' }}>
              <div className="wizard-avatar">{wizardState}</div>
              <div className="wizard-speech">
                <strong>Wizard Merlin:</strong> "{guideText}"
              </div>
            </div>

            {/* Grid Container with Axis Labels */}
            <div className="grid-container-with-axes">
              {/* Column labels A, B, C, D */}
              <div className="axis-label-corner"></div>
              <div className="axis-labels-cols">
                <div className="axis-label-col">A</div>
                <div className="axis-label-col">B</div>
                <div className="axis-label-col">C</div>
                <div className="axis-label-col">D</div>
              </div>

              {/* Row labels 1, 2, 3, 4 */}
              <div className="axis-labels-rows">
                <div className="axis-label-row">1</div>
                <div className="axis-label-row">2</div>
                <div className="axis-label-row">3</div>
                <div className="axis-label-row">4</div>
              </div>

              {/* Interactive 4x4 Grid */}
              <div className="grid-board-wrapper">
                <div className="grid-board">
                  {Array.from({ length: ROWS_COUNT }).map((_, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {Array.from({ length: COLS_COUNT }).map((_, colIndex) => {
                        const currentCell = { row: rowIndex, col: colIndex };
                        const isEven = (rowIndex + colIndex) % 2 === 0;
                        const coordName = getCellCoordinate(rowIndex, colIndex);

                        const isCatHere = isPosEqual(catPos, currentCell);
                        const isGiftHere = isPosEqual(GIFT_POS, currentCell);
                        const isCakeHere = isPosEqual(CAKE_POS, currentCell);
                        const isMealHere = isPosEqual(MEAL_POS, currentCell);
                        
                        // Check if this cell is part of the fading footprints trail
                        const hasPawPrint = pawPrints.some(p => isPosEqual(p, currentCell)) && !isCatHere;

                        // Check if this cell is the next cell to show a hint for
                        let isNextTargetCell = false;
                        if (showHint) {
                          if (seqIndex === 0 && isGiftHere) isNextTargetCell = true;
                          if (seqIndex === 1 && isCakeHere) isNextTargetCell = true;
                          if (seqIndex === 2 && isMealHere) isNextTargetCell = true;
                        }

                        return (
                          <div 
                            key={colIndex} 
                            className={`grid-cell ${isEven ? 'even-cell' : 'odd-cell'}`}
                            data-coord={coordName}
                          >
                            {/* Path Hint Star */}
                            {isNextTargetCell && (
                              <div className="hint-star-cell">✦</div>
                            )}

                            {/* Footprint Paw Prints */}
                            {hasPawPrint && (
                              <PawPrintSvg />
                            )}

                            {/* Render Cat */}
                            {isCatHere && (
                              <CatSvg animationState={catAnimationState} direction={catDirection} />
                            )}

                            {/* Render Targets */}
                            {isGiftHere && (
                              <GiftSprite collected={giftCollected} />
                            )}

                            {isCakeHere && (
                              <CakeSprite collected={cakeCollected} />
                            )}

                            {isMealHere && (
                              <MealSprite collected={mealCollected} />
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid Coordinates Guide */}
            <div style={{ fontSize: '0.9rem', opacity: 0.8, display: 'flex', gap: '1.25rem', marginTop: '0.2rem', fontWeight: 600 }}>
              <span>🏁 Start: <strong>A4</strong></span>
              <span>🎁 Gift: <strong>A1</strong></span>
              <span>🎂 Cake: <strong>C3</strong></span>
              <span>🍔 Meal: <strong>D1</strong></span>
            </div>

          </section>

          {/* Right Column: Code workspace & D-pad */}
          <section className="sidebar-panel">

            {/* Checklist Panel */}
            <div className="glass-panel">
              <h3 className="checklist-title">
                <CheckCircle size={20} className="text-emerald-400" /> Sequence Checklist
              </h3>
              <div className="checklist">
                <div className={`checklist-item ${giftCollected ? 'done' : ''}`}>
                  <div className="checklist-checkbox">
                    {giftCollected ? '✓' : '1'}
                  </div>
                  <span>Collect the Gift box 🎁 (at <strong>A1</strong>)</span>
                </div>
                <div className={`checklist-item ${cakeCollected ? 'done' : ''}`}>
                  <div className="checklist-checkbox">
                    {cakeCollected ? '✓' : '2'}
                  </div>
                  <span>Eat the birthday Cake 🎂 (at <strong>C3</strong>)</span>
                </div>
                <div className={`checklist-item ${mealCollected ? 'done' : ''}`}>
                  <div className="checklist-checkbox">
                    {mealCollected ? '✓' : '3'}
                  </div>
                  <span>Eat the delicious Meal Platter 🍔 (at <strong>D1</strong>)</span>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="glass-panel">
              <h3 className="workspace-title">
                <GraduationCap size={22} /> Choose Your Controls
              </h3>

              {/* Mode Switch Tabs */}
              <div className="control-mode-tabs">
                <button 
                  className={`tab-btn ${controlMode === 'code' ? 'active' : ''}`}
                  onClick={() => {
                    playSound(sound.click);
                    setControlMode('code');
                    resetGameProgress();
                  }}
                  disabled={isExecuting}
                >
                  <Code size={18} /> Block Coding
                </button>
                <button 
                  className={`tab-btn ${controlMode === 'manual' ? 'active' : ''}`}
                  onClick={() => {
                    playSound(sound.click);
                    setControlMode('manual');
                    resetGameProgress();
                  }}
                  disabled={isExecuting}
                >
                  <Joystick size={18} /> Manual D-Pad
                </button>
              </div>

              {/* BLOCK CODING INTERFACE */}
              {controlMode === 'code' && (
                <div>
                  <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                    Click arrows below to snap together instructions.
                  </p>

                  {/* Blocks Palette */}
                  <div className="coding-blocks-palette">
                    <button 
                      className="block-btn up-block btn-bubble"
                      onClick={() => addBlockToQueue('UP')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowUp size={16} /> Move Up
                    </button>
                    <button 
                      className="block-btn down-block btn-bubble"
                      onClick={() => addBlockToQueue('DOWN')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowDown size={16} /> Move Down
                    </button>
                    <button 
                      className="block-btn left-block btn-bubble"
                      onClick={() => addBlockToQueue('LEFT')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowLeft size={16} /> Move Left
                    </button>
                    <button 
                      className="block-btn right-block btn-bubble"
                      onClick={() => addBlockToQueue('RIGHT')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowRight size={16} /> Move Right
                    </button>
                  </div>

                  {/* Queue Display */}
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Your Instructions:</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({programQueue.length} steps)</span>
                  </div>
                  
                  <div className="program-queue-container">
                    {programQueue.length === 0 ? (
                      <div className="queue-empty-text">
                        No blocks! Click the colorful buttons above to snap blocks.
                      </div>
                    ) : (
                      programQueue.map((dir, idx) => {
                        let isError = errorBlockIndex === idx;
                        let isActive = activeBlockIndex === idx;
                        let blockClass = `queue-block ${dir} ${isActive ? 'active-block' : ''}`;
                        let blockStyle = {};
                        if (isError) {
                          blockStyle = { background: '#dc2626', border: '3px solid #fecaca', boxShadow: '0 0 15px #dc2626' };
                        }
                        
                        return (
                          <div 
                            key={idx} 
                            className={blockClass}
                            style={blockStyle}
                            title="Click to remove block"
                            onClick={() => removeBlockFromQueue(idx)}
                          >
                            {dir === 'UP' && <ArrowUp size={14} />}
                            {dir === 'DOWN' && <ArrowDown size={14} />}
                            {dir === 'LEFT' && <ArrowLeft size={14} />}
                            {dir === 'RIGHT' && <ArrowRight size={14} />}
                            <span>{dir}</span>
                            <span className="queue-arrow">×</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Coding Action buttons */}
                  <div className="action-controls">
                    <button 
                      className="btn-action btn-run btn-bubble"
                      onClick={runProgram}
                      disabled={isRunning || currentStepIndex !== -1 || programQueue.length === 0 || gameStatus === 'won'}
                    >
                      <Play size={18} fill="currentColor" /> Run
                    </button>
                    <button 
                      className="btn-action btn-step btn-bubble"
                      onClick={stepProgram}
                      disabled={isRunning || programQueue.length === 0 || gameStatus === 'won'}
                    >
                      <SkipForward size={18} /> Step
                    </button>
                    <button 
                      className="btn-action btn-clear btn-bubble"
                      onClick={clearProgramQueue}
                      disabled={isExecuting || programQueue.length === 0}
                    >
                      <Trash2 size={16} /> Clear
                    </button>
                    <button 
                      className="btn-action btn-reset btn-bubble"
                      onClick={handleFullReset}
                    >
                      <RotateCcw size={16} /> Reset
                    </button>
                  </div>

                  {/* Hint helper wand */}
                  <button 
                    className="btn-action btn-magic-wand btn-bubble"
                    onClick={toggleHint}
                    style={{ width: '100%', marginTop: '0.6rem', padding: '0.6rem' }}
                  >
                    <span>🪄</span> {showHint ? "Hide Magic Hint" : "Show Magic Hint"}
                  </button>

                </div>
              )}

              {/* MANUAL CONTROLLER INTERFACE */}
              {controlMode === 'manual' && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                    Click arrows below or use the <strong>Arrow Keys</strong> on your keyboard to move Scratchy!
                  </p>

                  {/* D-Pad Buttons */}
                  <div className="d-pad-container">
                    <div className="d-pad-row">
                      <button 
                        className="d-btn btn-bubble" 
                        onClick={() => executeDirection('UP')}
                        disabled={isExecuting || gameStatus === 'won'}
                      >
                        <ArrowUp size={24} />
                      </button>
                    </div>
                    <div className="d-pad-row">
                      <button 
                        className="d-btn btn-bubble" 
                        onClick={() => executeDirection('LEFT')}
                        disabled={isExecuting || gameStatus === 'won'}
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <div className="d-btn-center"></div>
                      <button 
                        className="d-btn btn-bubble" 
                        onClick={() => executeDirection('RIGHT')}
                        disabled={isExecuting || gameStatus === 'won'}
                      >
                        <ArrowRight size={24} />
                      </button>
                    </div>
                    <div className="d-pad-row">
                      <button 
                        className="d-btn btn-bubble" 
                        onClick={() => executeDirection('DOWN')}
                        disabled={isExecuting || gameStatus === 'won'}
                      >
                        <ArrowDown size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Manual reset */}
                  <button 
                    className="btn-action btn-reset btn-bubble" 
                    onClick={handleFullReset} 
                    style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }}
                  >
                    <RotateCcw size={16} /> Reset Position
                  </button>
                </div>
              )}

            </div>

          </section>

        </main>
      )}

      {/* TAB 2: LEARNING ZONE (CARD SORTING GAME) */}
      {activeTab === 'learn' && (
        <main style={{ width: '100%', maxWidth: '900px', margin: '2rem auto 0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 800 }}>🌱 Flower Sequencer Garden</h2>
            <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9 }}>
              <strong>What is a Sequence?</strong> A sequence is a list of steps in a special order!
              <br />
              If you water dirt before placing the seed, nothing grows! Let's arrange these steps in the correct order.
            </p>
          </div>

          <div className="card-sorting-wrapper">
            <div className="cards-container">
              {sortingCards.map((card, idx) => (
                <div 
                  key={card.id} 
                  className={`sorting-card ${isSortingSolved ? 'card-correct' : ''}`}
                >
                  <div className="card-number-badge">{idx + 1}</div>
                  <div className="card-illustration">{card.emoji}</div>
                  <div className="card-text">{card.text}</div>
                  
                  {/* Shift Buttons */}
                  {!isSortingSolved && (
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                      <button 
                        className="btn-action btn-bubble"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', background: '#e2e8f0', color: '#1e293b' }}
                        disabled={idx === 0}
                        onClick={() => shiftCard(idx, 'left')}
                      >
                        ◀
                      </button>
                      <button 
                        className="btn-action btn-bubble"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', background: '#e2e8f0', color: '#1e293b' }}
                        disabled={idx === sortingCards.length - 1}
                        onClick={() => shiftCard(idx, 'right')}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isSortingSolved && (
              <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', textAlign: 'center', padding: '1.5rem', width: '100%', maxWidth: '500px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '1.4rem' }}>🌟 Sequence Completed!</h3>
                <p style={{ margin: '0 0 1rem 0' }}>You ordered all the instructions perfectly. Flower grows up nicely!</p>
                <button 
                  className="btn-play-again btn-bubble" 
                  onClick={shuffleCards}
                  style={{ marginTop: 0 }}
                >
                  Shuffle & Play Again 🔄
                </button>
              </div>
            )}
          </div>

        </main>
      )}

      {/* TAB 3: MAGIC QUIZ TAB */}
      {activeTab === 'quiz' && (
        <main style={{ width: '100%', maxWidth: '800px', margin: '2rem auto 0 auto' }}>
          
          {!quizCompleted ? (
            <div className="quiz-panel">
              {/* Question Card */}
              <div className="quiz-card">
                <div className="quiz-question-header">
                  <span>COMPUTATIONAL THINKING QUIZ</span>
                  <span>QUESTION {quizQuestionIdx + 1} OF {QUIZ_QUESTIONS.length}</span>
                </div>
                
                <h3 className="quiz-question-title">
                  {QUIZ_QUESTIONS[quizQuestionIdx].question}
                </h3>
                
                <div className="quiz-options">
                  {QUIZ_QUESTIONS[quizQuestionIdx].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[quizQuestionIdx].correctAnswer;
                    
                    let btnClass = "quiz-option-btn";
                    if (answerChecked) {
                      if (isSelected) {
                        btnClass += isCorrect ? " selected-correct" : " selected-incorrect";
                      } else if (isCorrect) {
                        btnClass += " selected-correct"; // Highlight correct answer even if not selected
                      }
                    }
                    
                    return (
                      <button 
                        key={idx}
                        className={btnClass}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={answerChecked}
                      >
                        <div style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          border: '2px solid currentColor', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginRight: '0.5rem'
                        }}>
                          {answerChecked && isCorrect && <Check size={14} />}
                          {answerChecked && isSelected && !isCorrect && <X size={14} />}
                          {!answerChecked && isSelected && "●"}
                        </div>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Wizard guide speech inside quiz */}
                <div className="wizard-guide" style={{ margin: '1rem 0 0 0', padding: '0.75rem 1rem', borderRadius: '16px' }}>
                  <div className="wizard-avatar" style={{ fontSize: '2.5rem' }}>{wizardState}</div>
                  <div className="wizard-speech" style={{ fontSize: '0.95rem' }}>
                    <strong>Merlin:</strong> "{guideText}"
                  </div>
                </div>

                {/* Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                  {!answerChecked ? (
                    <button 
                      className="btn-action btn-run btn-bubble"
                      onClick={checkQuizAnswer}
                      disabled={selectedAnswer === null}
                    >
                      Check Answer 🔮
                    </button>
                  ) : (
                    <button 
                      className="btn-action btn-step btn-bubble"
                      onClick={nextQuizQuestion}
                    >
                      {quizQuestionIdx < QUIZ_QUESTIONS.length - 1 ? "Next Question ➔" : "See Results 🏆"}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ) : (
            // Quiz completed view
            <div className="quiz-panel" style={{ textAlign: 'center' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem' }}>
                <div style={{ fontSize: '5rem' }}>🎉</div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Quiz Completed!</h2>
                
                <p style={{ fontSize: '1.2rem', maxWidth: '500px', margin: 0 }}>
                  Excellent work! You scored <strong>{quizScore} out of {QUIZ_QUESTIONS.length}</strong>!
                  <br />
                  You understand how sequences and instructions work!
                </p>

                {quizBadge && (
                  <div className="win-badge-container">
                    <div className="badge-reward-graphic">🎓</div>
                    <div className="badge-reward-title">Grand Sequencer Badge</div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Awarded for scoring 3+ points on the Sequence Magic Quiz!</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn-play-again btn-bubble"
                    onClick={restartQuiz}
                  >
                    Try Again 🔄
                  </button>
                  <button 
                    className="app-tab-btn btn-bubble"
                    onClick={() => {
                      playSound(sound.click);
                      setActiveTab('play');
                      handleFullReset();
                    }}
                    style={{ background: '#3b82f6', color: 'white', border: '3px solid #1e293b' }}
                  >
                    Back to Cat Game 🐱
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* Win Celebration Modal */}
      {gameStatus === 'won' && (
        <div className="win-overlay">
          <div className="win-modal">
            <div className="win-icon">🏆</div>
            <h2 className="win-title">Sequence Magic Completed!</h2>
            <p className="win-message">
              Hooray! 🌟 You coded Scratchy the Cat to successfully collect the Gift 🎁, eat the Cake 🎂, and enjoy the Meal 🍔 in the exact sequence!
            </p>
            <div className="win-badge-container">
              <div className="badge-reward-graphic">👑</div>
              <div className="badge-reward-title">Royal Coder Award</div>
            </div>
            <button className="btn-play-again btn-bubble" onClick={handleFullReset}>
              Play Again 🎮
            </button>
          </div>
        </div>
      )}

      {/* Info footer */}
      <footer style={{ marginTop: '4rem', color: '#64748b', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
        <p>Sequence Magic Game • Designed for Grade 2 Computational Thinking Skills</p>
      </footer>
    </div>
  );
}
