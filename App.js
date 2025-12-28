import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';

const TITLES = [
  'З Новим роком',
  'Зі святами',
  'Щасливого Різдва',
  'Нехай мрії збуваються',
  'Тепла, миру та радості',
  'Нехай цей рік буде щасливим',
  'Бажаю натхнення і сил',
  'Смачних свят',
  'Удачі та перемог',
  'Нехай буде більше посмішок',
  'Любові та тепла вдома',
  'Нові початки',
  'Відкривай нові горизонти',
  'Святкуй яскраво',
  'Магії та дива',
  'Здоров\'я і благополуччя',
  'Вір у свої сили',
  'Нехай буде солодко'
  
];

const EMOJIS = [
  '🎄✨🎆',
  '🎁❄️🥂',
  '⭐️🕯️🎅',
  '🌟🎉💫',
  '🔥🕊️😊',
  '🎇📅💛',
  '💪✨📘',
  '🍪☕️🎄',
  '🏆🍀✨',
  '😄🎊💫',
  '🏠❤️🔥',
  '🚀🌙✨',
  '🎉🌟🎆',
  '❄️🎁🎄',
  '🕯️⭐️🎅',
  '💫🎉🌟',
  '🕊️🔥😊',
  '📅🎇💛',
  '✨💪📘',
  '☕️🍪🎄'
];

const GRADIENTS = [
  'linear-gradient(135deg, #ff6a00 0%, #ee0979 50%, #3f5efb 100%)',
  'linear-gradient(135deg, #00c6ff 0%, #0072ff 45%, #7f00ff 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 55%, #2dd4bf 100%)',
  'linear-gradient(135deg, #fc466b 0%, #3f5efb 60%, #22c55e 100%)',
  'linear-gradient(135deg, #921704 0%, #866f06 40%, #046c6e 100%)',
  'linear-gradient(120deg, #00c6ff 0%, #3f5efb 55%, #ee0979 100%)',
  'linear-gradient(135deg, #38ef7d 0%, #2dd4bf 45%, #0072ff 100%)',
  'linear-gradient(135deg, #ffd200 0%, #ff6a00 50%, #ee0979 100%)',
  'linear-gradient(135deg, #11998e 0%, #22c55e 45%, #00c6ff 100%)',
  'linear-gradient(135deg, #7f00ff 0%, #3f5efb 55%, #00c6ff 100%)',
  'linear-gradient(135deg, #fc466b 0%, #ee0979 45%, #866f06 100%)',
  'linear-gradient(135deg, #046c6e 0%, #0072ff 45%, #3f5efb 100%)',
  'linear-gradient(120deg, #3f5efb 0%, #7f00ff 55%, #ff6a00 100%)',
  'linear-gradient(135deg, #2dd4bf 0%, #38ef7d 50%, #11998e 100%)',
  'linear-gradient(135deg, #ee0979 0%, #ff6a00 45%, #ffd200 100%)',
  'linear-gradient(135deg, #22c55e 0%, #11998e 55%, #0072ff 100%)'
];

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function createPrng(seed) {
  // Mulberry32 PRNG (fast, deterministic). Avoids Math.random so tests can mock it safely.
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export default function App() {
  const [title, setTitle] = useState(TITLES[0]);
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [animPhase, setAnimPhase] = useState('');
  const timeoutsRef = useRef([]);

  const snowRandRef = useRef(null);
  if (!snowRandRef.current) {
    // Seed with time; deterministic per page load.
    snowRandRef.current = createPrng(Date.now());
  }

  const snowflakes = useMemo(() => {
    const rand = snowRandRef.current;
    const count = 70; // enough density, still lightweight

    return Array.from({ length: count }, (_, index) => {
      const sizePx = 2 + rand() * 5; // 2..7px
      const opacity = 0.25 + rand() * 0.65; // 0.25..0.90
      const blurPx = rand() * 0.6; // 0..0.6px

      const fallDuration = 9 + rand() * 10; // 9..19s (reasonable)
      const swayDuration = 3 + rand() * 5; // 3..8s
      const twinkleDuration = 2.8 + rand() * 3.2; // 2.8..6s

      const fallDelay = -rand() * fallDuration; // start at random progress
      const swayDelay = -rand() * swayDuration;
      const twinkleDelay = -rand() * twinkleDuration;

      const driftPx = (rand() * 2 - 1) * (18 + rand() * 28); // ~ -46..46px

      return {
        key: `flake-${index}`,
        leftVw: rand() * 100,
        sizePx,
        opacity,
        blurPx,
        fallDuration,
        swayDuration,
        twinkleDuration,
        fallDelay,
        swayDelay,
        twinkleDelay,
        driftPx,
      };
    });
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, []);

  const pickRandom = () => {
    if (TITLES.length > 0) setTitle(TITLES[randomIndex(TITLES.length)]);
    if (EMOJIS.length > 0) setEmoji(EMOJIS[randomIndex(EMOJIS.length)]);
    if (GRADIENTS.length > 0) setGradient(GRADIENTS[randomIndex(GRADIENTS.length)]);
  };

  const nextTheme = () => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];

    // Phase 1: fade out
    setAnimPhase('out');

    // Phase 2: swap content + fade in
    timeoutsRef.current.push(
      setTimeout(() => {
        pickRandom();
        setAnimPhase('in');
      }, 180)
    );

    // Phase 3: clear animation class
    timeoutsRef.current.push(
      setTimeout(() => {
        setAnimPhase('');
      }, 520)
    );
  };

  return (
    <main className="page" style={{ backgroundImage: gradient }} data-gradient={gradient}>
      <div className="snow" aria-hidden="true">
        {snowflakes.map((flake) => (
          <span
            key={flake.key}
            className="snowflake"
            style={
              {
                '--left': `${flake.leftVw}vw`,
                '--fall-duration': `${flake.fallDuration}s`,
                '--fall-delay': `${flake.fallDelay}s`,
              }
            }
          >
            <span
              className="snowflake__inner"
              style={
                {
                  '--size': `${flake.sizePx}px`,
                  '--opacity': `${flake.opacity}`,
                  '--blur': `${flake.blurPx}px`,
                  '--drift': `${flake.driftPx}px`,
                  '--sway-duration': `${flake.swayDuration}s`,
                  '--sway-delay': `${flake.swayDelay}s`,
                  '--twinkle-duration': `${flake.twinkleDuration}s`,
                  '--twinkle-delay': `${flake.twinkleDelay}s`,
                }
              }
            />
          </span>
        ))}
      </div>
      <div className={`card${animPhase ? ` card--${animPhase}` : ''}`}>
        <h1 className="title">{title}</h1>
        <p className="emoji" aria-hidden="true">{emoji}</p>
        <button className="button" type="button" onClick={nextTheme}>
          Оновити
        </button>
      </div>
    </main>
  );
}
