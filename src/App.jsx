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
  SkipForward
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
const CatSvg = ({ animationState }) => {
  let catClass = "sprite cat ";
  if (animationState === 'moving') catClass += 'moving';
  if (animationState === 'bumping') catClass += 'bumping';
  if (animationState === 'celebrating') catClass += 'celebrating';

  return (
    <svg className={catClass} viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
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
      <circle cx="44.5" cy="34" r="2" fill="#22c55e" /> {/* Green iris */}
      <circle cx="44.5" cy="34" r="1" fill="#000" />
      <circle cx="43.5" cy="33" r="0.8" fill="#fff" /> {/* Highlight */}

      <circle cx="57" cy="34" r="4.5" fill="#fff" stroke="#000" strokeWidth="1" />
      <circle cx="55.5" cy="34" r="2" fill="#22c55e" /> {/* Green iris */}
      <circle cx="55.5" cy="34" r="1" fill="#000" />
      <circle cx="54.5" cy="33" r="0.8" fill="#fff" /> {/* Highlight */}

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
  const [catPos, setCatPos] = useState(START_POS);
  const [giftCollected, setGiftCollected] = useState(false);
  const [cakeCollected, setCakeCollected] = useState(false);
  const [mealCollected, setMealCollected] = useState(false);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [controlMode, setControlMode] = useState('code'); // 'code' | 'manual'
  const [programQueue, setProgramQueue] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeBlockIndex, setActiveBlockIndex] = useState(-1);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won'
  
  // Derived state to check if program is executing (running or stepping)
  const isExecuting = isRunning || currentStepIndex !== -1;

  // Grade 2 specific speech bubble helper
  const [guideText, setGuideText] = useState('Help me collect the items in the correct order! First 🎁, then 🎂, and finally 🍔!');
  const [wizardState, setWizardState] = useState('🧙‍♂️');
  const [catAnimationState, setCatAnimationState] = useState(''); // 'moving' | 'bumping' | 'celebrating'

  // Ref to track state in intervals
  const stateRef = useRef({ catPos, giftCollected, cakeCollected, mealCollected, isRunning, gameStatus });
  useEffect(() => {
    stateRef.current = { catPos, giftCollected, cakeCollected, mealCollected, isRunning, gameStatus };
  }, [catPos, giftCollected, cakeCollected, mealCollected, isRunning, gameStatus]);

  // Sparkles background coordinates
  const [sparkles, setSparkles] = useState([]);
  useEffect(() => {
    // Generate 30 random background sparkle stars
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
      if (controlMode !== 'manual' || isExecuting || gameStatus === 'won') return;
      
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
  }, [controlMode, isRunning, gameStatus]);

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
  const executeDirection = (direction) => {
    const { catPos, giftCollected: gift, cakeCollected: cake, mealCollected: meal } = stateRef.current;
    const { row, col } = catPos;
    let newRow = row;
    let newCol = col;

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
    setTimeout(() => {
      setCatAnimationState('');
    }, 250);

    // Sequence Checkpoints validation
    if (isPosEqual(newPos, GIFT_POS)) {
      if (!gift) {
        setGiftCollected(true);
        playSound(sound.collect);
        setWizardState('🧙‍♂️');
        setGuideText(`Awesome! 🎁 You found the Gift at A1! Now, let's find the Cake at C3 next!`);
      }
    } 
    else if (isPosEqual(newPos, CAKE_POS)) {
      if (!cake) {
        if (gift) {
          setCakeCollected(true);
          playSound(sound.collect);
          setWizardState('🧙‍♂️');
          setGuideText(`Yum! 🎂 That cake at C3 is delicious! Last step: let's go finish the Meal at D1!`);
        } else {
          // Out of sequence! DO NOT reset progress. Just tell them.
          playSound(sound.error);
          setWizardState('🧙‍♀️');
          setGuideText(`You found the Cake at C3! But wait 🚨, we must collect the Gift 🎁 first! Keep searching!`);
          return true;
        }
      }
    } 
    else if (isPosEqual(newPos, MEAL_POS)) {
      if (!meal) {
        if (gift && cake) {
          setMealCollected(true);
          setGameStatus('won');
          setCatAnimationState('celebrating');
          playSound(sound.win);
          setWizardState('🧙‍♂️');
          setGuideText(`Magic completed! 🌟 Scratchy completed the Sequence Task successfully! 🌈🎉`);
        } else {
          // Out of sequence! DO NOT reset progress. Just tell them.
          playSound(sound.error);
          setWizardState('🧙‍♀️');
          if (!gift) {
            setGuideText(`You reached the Meal at D1! But we must collect the Gift 🎁 first!`);
          } else {
            setGuideText(`You reached the Meal at D1! But we must eat the Cake 🎂 first!`);
          }
          return true;
        }
      }
    }
    return true; // Successfully moved
  };

  // Add block to queue
  const addBlockToQueue = (dir) => {
    if (isRunning || gameStatus === 'won') return;
    playSound(sound.click);
    setProgramQueue([...programQueue, dir]);
    
    // Friendly reminder text
    if (programQueue.length === 0) {
      setGuideText(`Block added! Click more blocks to build a path to the Gift 🎁, Cake 🎂, and Meal 🍔.`);
    }
  };

  // Delete specific block from queue
  const removeBlockFromQueue = (index) => {
    if (isRunning || gameStatus === 'won') return;
    playSound(sound.click);
    const newQueue = [...programQueue];
    newQueue.splice(index, 1);
    setProgramQueue(newQueue);
  };

  // Clear program queue
  const clearProgramQueue = () => {
    playSound(sound.click);
    setProgramQueue([]);
    setActiveBlockIndex(-1);
    setGuideText(`Program cleared! Snap together some blue, orange, pink and green blocks!`);
  };

  // Run the sequence coding program
  const runProgram = () => {
    if (programQueue.length === 0 || isExecuting || gameStatus === 'won') return;
    
    playSound(sound.click);
    setIsRunning(true);
    setCurrentStepIndex(-1); // Cancel stepping mode
    setActiveBlockIndex(0);
    setWizardState('🧙‍♂️');
    setGuideText(`Running program... 🚀 Watch Scratchy follow your sequence!`);
    
    let index = 0;
    
    const executeStep = () => {
      // Stop execution if stopped via Reset or general state change
      if (!stateRef.current.isRunning) {
        return;
      }

      // Stop execution if game was won during run
      if (stateRef.current.gameStatus === 'won') {
        setIsRunning(false);
        setActiveBlockIndex(-1);
        return;
      }

      if (index >= programQueue.length) {
        // Queue finished executing
        setIsRunning(false);
        setActiveBlockIndex(-1);
        
        // Check if won, if not warn
        setTimeout(() => {
          const { giftCollected: g, cakeCollected: c, mealCollected: m, gameStatus: status } = stateRef.current;
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
      const success = executeDirection(currentDir);

      // If collision or sequence error stopped it
      if (!success) {
        setIsRunning(false);
        setActiveBlockIndex(-1);
        return;
      }

      index++;
      setTimeout(executeStep, 800); // 800ms delay between actions to look step-by-step
    };

    setTimeout(executeStep, 400);
  };

  // Step the program block by block
  const stepProgram = () => {
    if (programQueue.length === 0 || isExecuting || gameStatus === 'won') return;

    playSound(sound.click);
    
    let nextIndex = currentStepIndex + 1;
    
    // If we haven't started stepping yet, reset cat position to start
    if (currentStepIndex === -1) {
      resetGameProgress();
      nextIndex = 0;
    }

    setWizardState('🧙‍♂️');
    setGuideText(`Stepping through program... 🔍 Block ${nextIndex + 1} of ${programQueue.length}`);
    setCurrentStepIndex(nextIndex);
    setActiveBlockIndex(nextIndex);

    const currentDir = programQueue[nextIndex];
    const success = executeDirection(currentDir);

    if (!success || nextIndex === programQueue.length - 1) {
      // Program ended or hit boundary
      setTimeout(() => {
        setCurrentStepIndex(-1);
        setActiveBlockIndex(-1);
        
        const { gameStatus: status } = stateRef.current;
        if (status === 'won') {
          return; // Handled by executeDirection
        }
        
        if (!success) {
          return; // Hit border
        }

        // Finished last step and not won
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
    setCatAnimationState('');
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

  return (
    <div className="app-container">
      {/* Background Sparkles */}
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

      {/* Confetti Celebration */}
      <CelebrationCanvas active={gameStatus === 'won'} />

      {/* Mute/Unmute */}
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
        <p>Help Scratchy the Cat find his treats in the perfect sequence!</p>
      </header>

      {/* Main Responsive Layout */}
      <main className="main-content">
        
        {/* Left Column: Narrative Owl & Grid Board */}
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
            {/* Top row: Column labels A, B, C, D */}
            <div className="axis-label-corner"></div>
            <div className="axis-labels-cols">
              <div className="axis-label-col">A</div>
              <div className="axis-label-col">B</div>
              <div className="axis-label-col">C</div>
              <div className="axis-label-col">D</div>
            </div>

            {/* Left column: Row labels 1, 2, 3, 4 */}
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

                      // Elements inside cells
                      const isCatHere = isPosEqual(catPos, currentCell);
                      const isGiftHere = isPosEqual(GIFT_POS, currentCell);
                      const isCakeHere = isPosEqual(CAKE_POS, currentCell);
                      const isMealHere = isPosEqual(MEAL_POS, currentCell);

                      return (
                        <div 
                          key={colIndex} 
                          className={`grid-cell ${isEven ? 'even-cell' : 'odd-cell'}`}
                          data-coord={coordName}
                        >
                          {/* Render Cat */}
                          {isCatHere && (
                            <CatSvg animationState={catAnimationState} />
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

          {/* Grid Reference Map Guide for Grade 2 */}
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
            <span>🏁 Cat Start: <strong>A4</strong></span>
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
                <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  Click blocks below to write a movement program for the cat.
                </p>

                {/* Blocks Palette */}
                <div className="coding-blocks-palette">
                  <button 
                    className="block-btn up-block"
                    onClick={() => addBlockToQueue('UP')}
                    disabled={isExecuting || gameStatus === 'won'}
                  >
                    <ArrowUp size={16} /> Move Up
                  </button>
                  <button 
                    className="block-btn down-block"
                    onClick={() => addBlockToQueue('DOWN')}
                    disabled={isExecuting || gameStatus === 'won'}
                  >
                    <ArrowDown size={16} /> Move Down
                  </button>
                  <button 
                    className="block-btn left-block"
                    onClick={() => addBlockToQueue('LEFT')}
                    disabled={isExecuting || gameStatus === 'won'}
                  >
                    <ArrowLeft size={16} /> Move Left
                  </button>
                  <button 
                    className="block-btn right-block"
                    onClick={() => addBlockToQueue('RIGHT')}
                    disabled={isExecuting || gameStatus === 'won'}
                  >
                    <ArrowRight size={16} /> Move Right
                  </button>
                </div>

                {/* Queue Display */}
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Your Sequence Code:</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>({programQueue.length} steps)</span>
                </div>
                <div className="program-queue-container">
                  {programQueue.length === 0 ? (
                    <div className="queue-empty-text">
                      No blocks yet! Click the colorful buttons above.
                    </div>
                  ) : (
                    programQueue.map((dir, index) => (
                      <div 
                        key={index} 
                        className={`queue-block ${dir} ${activeBlockIndex === index ? 'active-block' : ''}`}
                        title="Click to remove block"
                        onClick={() => removeBlockFromQueue(index)}
                      >
                        {dir === 'UP' && <ArrowUp size={14} />}
                        {dir === 'DOWN' && <ArrowDown size={14} />}
                        {dir === 'LEFT' && <ArrowLeft size={14} />}
                        {dir === 'RIGHT' && <ArrowRight size={14} />}
                        <span>{dir}</span>
                        <span className="queue-arrow">×</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Coding Action buttons */}
                <div className="action-controls">
                  <button 
                    className="btn-action btn-run"
                    onClick={runProgram}
                    disabled={isRunning || currentStepIndex !== -1 || programQueue.length === 0 || gameStatus === 'won'}
                  >
                    <Play size={18} fill="currentColor" /> Run
                  </button>
                  <button 
                    className="btn-action btn-step"
                    onClick={stepProgram}
                    disabled={isRunning || programQueue.length === 0 || gameStatus === 'won'}
                  >
                    <SkipForward size={18} /> Step
                  </button>
                  <button 
                    className="btn-action btn-clear"
                    onClick={clearProgramQueue}
                    disabled={isExecuting || programQueue.length === 0}
                  >
                    <Trash2 size={16} /> Clear
                  </button>
                  <button 
                    className="btn-action btn-reset"
                    onClick={handleFullReset}
                  >
                    <RotateCcw size={16} /> Reset
                  </button>
                </div>
              </div>
            )}

            {/* MANUAL CONTROLLER INTERFACE */}
            {controlMode === 'manual' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  Click the arrows below or use the <strong>Arrow Keys</strong> on your keyboard to move Scratchy!
                </p>

                {/* D-Pad Buttons */}
                <div className="d-pad-container">
                  <div className="d-pad-row">
                    <button 
                      className="d-btn" 
                      onClick={() => executeDirection('UP')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowUp size={24} />
                    </button>
                  </div>
                  <div className="d-pad-row">
                    <button 
                      className="d-btn" 
                      onClick={() => executeDirection('LEFT')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <div className="d-btn-center"></div>
                    <button 
                      className="d-btn" 
                      onClick={() => executeDirection('RIGHT')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>
                  <div className="d-pad-row">
                    <button 
                      className="d-btn" 
                      onClick={() => executeDirection('DOWN')}
                      disabled={isExecuting || gameStatus === 'won'}
                    >
                      <ArrowDown size={24} />
                    </button>
                  </div>
                </div>

                {/* Manual reset */}
                <button 
                  className="btn-action btn-reset" 
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

      {/* Win Celebration Modal */}
      {gameStatus === 'won' && (
        <div className="win-overlay">
          <div className="win-modal">
            <div className="win-icon">🏆</div>
            <h2 className="win-title">Sequence Magic Completed!</h2>
            <p className="win-message">
              Hooray! 🌟 You coded Scratchy the Cat to successfully collect the Gift 🎁, eat the Cake 🎂, and enjoy the Meal 🍔 in the exact sequence!
            </p>
            <button className="btn-play-again" onClick={handleFullReset}>
              Play Again 🎮
            </button>
          </div>
        </div>
      )}

      {/* Info footer */}
      <footer style={{ marginTop: '3rem', color: '#475569', fontSize: '0.85rem', textAlign: 'center' }}>
        <p>Sequence Magic Game • Designed for Grade 2 Computational Thinking Skills</p>
      </footer>
    </div>
  );
}
