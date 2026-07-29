/**
 * Word utility for the Wordle game
 * Contains the target word, valid guesses, hints, and easter eggs
 */

// The target word for the birthday Wordle
export const TARGET_WORD = 'SWEET';

// Valid 5-letter words for the game (for validation)
// In a production app, this would be a much larger dictionary
export const VALID_WORDS = new Set([
  'SWEET', 'LOVE', 'HAPPY', 'BIRTH', 'CAKES', 'PARTY', 'GIFTS', 'CANDY',
  'DANCE', 'LIGHT', 'SMILE', 'JOY', 'LAUGH', 'SHINE', 'BLOOM', 'DREAM',
  'MAGIC', 'HEART', 'BLISS', 'CHARM', 'PEACE', 'GRACE', 'SPARK', 'GLOW',
  'WISH', 'STAR', 'MOON', 'SUN', 'WARM', 'SOFT', 'KIND', 'CARE', 'DEAR',
  'FOND', 'TRUE', 'RARE', 'FINE', 'ROSE', 'GOLD', 'RUBY', 'JADE',
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
  'ALIEN', 'ALIGN', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG',
  'ANGER', 'ANGLE', 'ANGRY', 'ANKLE', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARMOR', 'ARRAY', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE',
  'AWARD', 'AWARE', 'BADLY', 'BASIC', 'BASIS', 'BEACH', 'BEGAN', 'BEGIN',
  'BEING', 'BELOW', 'BENCH', 'BIBLE', 'BLACK', 'BLADE', 'BLAME', 'BLANK',
  'BLAST', 'BLEND', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BONUS', 'BOUND',
  'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING',
  'BROAD', 'BROKE', 'BROWN', 'BRUSH', 'BUILD', 'BUNCH', 'BURST', 'BUYER',
  'CABIN', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHEAP',
  'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM',
  'CLASS', 'CLEAN', 'CLEAR', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH',
  'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY',
  'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUSH', 'CURVE', 'CYCLE',
  'DAILY', 'DEATH', 'DELAY', 'DEPTH', 'DIRTY', 'DOUBT', 'DRAFT', 'DRAIN',
  'DRAMA', 'DRAWN', 'DRIVE', 'EAGER', 'EARTH', 'EIGHT', 'ELECT', 'ELITE',
  'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT',
  'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FEAST',
  'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED',
  'FLAME', 'FLASH', 'FLEET', 'FLESH', 'FLOAT', 'FLOOD', 'FLOOR', 'FLUID',
  'FLUSH', 'FOCUS', 'FORCE', 'FORGE', 'FORTH', 'FORUM', 'FOUND', 'FRAME',
  'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT',
  'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAIN', 'GRAND',
  'GRANT', 'GRAPH', 'GRASP', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS',
  'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILD', 'HABIT',
  'HAPPY', 'HARSH', 'HAVEN', 'HEAVY', 'HENCE', 'HONOR', 'HORSE', 'HOTEL',
  'HOUSE', 'HUMAN', 'HUMOR', 'HURRY', 'IDEAL', 'IMAGE', 'IMPLY', 'INDEX',
  'INNER', 'INPUT', 'ISSUE', 'IVORY', 'JOINT', 'JUDGE', 'JUICE', 'KNOWN',
  'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEAST',
  'LEAVE', 'LEGAL', 'LEVEL', 'LIGHT', 'LIMIT', 'LINEN', 'LIVER', 'LOCAL',
  'LOGIC', 'LOOSE', 'LOVER', 'LOWER', 'LUCKY', 'LUNCH', 'MADAM', 'MAYOR',
  'MEDIA', 'MERCY', 'METAL', 'METER', 'MIGHT', 'MINOR', 'MINUS', 'MIXED',
  'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH',
  'MOVIE', 'MUSIC', 'NAIVE', 'NERVE', 'NEVER', 'NIGHT', 'NOBLE', 'NOISE',
  'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN',
  'ORDER', 'OTHER', 'OUTER', 'OWNER', 'OXIDE', 'OZONE', 'PAINT', 'PANEL',
  'PAPER', 'PATCH', 'PAUSE', 'PEACE', 'PENNY', 'PHASE', 'PHONE', 'PHOTO',
  'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PIXEL', 'PLACE', 'PLAIN', 'PLANE',
  'PLANT', 'PLATE', 'PLAZA', 'PLEAD', 'PLUMB', 'PLUME', 'POINT', 'POUND',
  'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE',
  'PROOF', 'PROUD', 'PROVE', 'PROXY', 'PULSE', 'PUNCH', 'PUPIL', 'QUEEN',
  'QUEST', 'QUICK', 'QUIET', 'QUITE', 'QUOTA', 'QUOTE', 'RADAR', 'RADIO',
  'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REBEL',
  'REIGN', 'RELAX', 'REPAY', 'REPLY', 'RIDER', 'RIDGE', 'RIFLE', 'RIGHT',
  'RIGID', 'RISKY', 'RIVAL', 'RIVER', 'ROBIN', 'ROBOT', 'ROCKY', 'ROUGH',
  'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SADLY', 'SAINT', 'SALAD', 'SAUCE',
  'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL',
  'SHAPE', 'SHARE', 'SHARP', 'SHEER', 'SHELF', 'SHELL', 'SHIFT', 'SHIRT',
  'SHOCK', 'SHOOT', 'SHORT', 'SHOUT', 'SIGHT', 'SINCE', 'SIXTH', 'SIXTY',
  'SIZED', 'SKILL', 'SKULL', 'SLAVE', 'SLEEP', 'SLICE', 'SLIDE', 'SLOPE',
  'SMART', 'SMELL', 'SMOKE', 'SOLAR', 'SOLID', 'SOLVE', 'SORRY', 'SOUND',
  'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPICE',
  'SPLIT', 'SPOKE', 'SPORT', 'SPRAY', 'SQUAD', 'STACK', 'STAFF', 'STAGE',
  'STAKE', 'STALE', 'STAND', 'START', 'STATE', 'STAYS', 'STEAL', 'STEAM',
  'STEEL', 'STEEP', 'STEER', 'STICK', 'STIFF', 'STILL', 'STOCK', 'STONE',
  'STOOD', 'STORE', 'STORM', 'STORY', 'STOVE', 'STRIP', 'STUCK', 'STUDY',
  'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SURGE', 'SWAMP', 'SWEAR',
  'SWEEP', 'SWEET', 'SWEPT', 'SWIFT', 'SWING', 'SWORD', 'SWORE', 'SWORN',
  'TABLE', 'TASTE', 'TEACH', 'TEETH', 'TEMPO', 'TENSE', 'TERMS', 'THEFT',
  'THEME', 'THICK', 'THIEF', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
  'THREW', 'THROW', 'THUMB', 'TIGER', 'TIGHT', 'TIMER', 'TITLE', 'TODAY',
  'TOKEN', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWEL', 'TOWER', 'TOXIC', 'TRACE',
  'TRACK', 'TRADE', 'TRAIL', 'TRAIN', 'TRAIT', 'TREAT', 'TREND', 'TRIAL',
  'TRIBE', 'TRICK', 'TRIED', 'TROOP', 'TRUCK', 'TRULY', 'TRUMP', 'TRUNK',
  'TRUST', 'TRUTH', 'TUMOR', 'TWICE', 'TWIST', 'ULTRA', 'UNCLE', 'UNDER',
  'UNION', 'UNITE', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE',
  'USUAL', 'UTTER', 'VALID', 'VALUE', 'VIDEO', 'VIGOR', 'VIRAL', 'VIRUS',
  'VISIT', 'VITAL', 'VIVID', 'VOCAL', 'VOICE', 'VOTER', 'WAGON', 'WASTE',
  'WATCH', 'WATER', 'WEAVE', 'WEIGH', 'WEIRD', 'WHEAT', 'WHEEL', 'WHERE',
  'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WORLD', 'WORRY',
  'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRIST', 'WRITE', 'WRONG',
  'WROTE', 'YACHT', 'YIELD', 'YOUNG', 'YOUTH', 'ZEBRA',
  // Easter egg words
  'LAPER',
]);

// Custom toast messages for incorrect guesses
export const HINT_MESSAGES: Record<number, string[]> = {
  1: ['Not quite! Think about something delightful 🍰'],
  2: ['Hmm, think about how this day feels ✨'],
  3: ['You\'re getting warmer! What\'s a birthday treat? 🎂'],
  4: ['Almost there! It\'s what birthday wishes are made of 🌟'],
  5: ['Last chance! Think about the taste of celebration 🍬'],
};

// Easter egg words and their special messages
export const EASTER_EGGS: Record<string, string> = {
  'LOVE': '💖 Aww, that\'s sweet! But try something more... delicious!',
  'LAPER': '😏 Hehe, nice try! But the answer is sweeter than that!',
  'HAPPY': '🎉 You\'re on the right track! Think sweeter!',
  'PARTY': '🎊 Party mode activated! But the answer is tastier!',
  'CANDY': '🍭 So close! Think about something even sweeter!',
};

// Clue to reveal after 3 failed attempts
export const CLUE = {
  title: '💡 Here\'s a Clue!',
  text: 'This word describes something that tastes amazing on your tongue — especially on a birthday! It\'s what makes every celebration delicious.',
  emoji: '🍯',
};

/**
 * Check if a word is valid (5 letters and in our dictionary)
 */
export function isValidWord(word: string): boolean {
  return word.length === 5 && VALID_WORDS.has(word.toUpperCase());
}

/**
 * Evaluate a guess against the target word
 * Returns an array of LetterStatus for each position
 */
export function evaluateGuess(guess: string, target: string): Array<'correct' | 'present' | 'absent'> {
  const result: Array<'correct' | 'present' | 'absent'> = Array(5).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const targetUsed = Array(5).fill(false);

  // First pass: find correct positions (green)
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetUsed[i] = true;
    }
  }

  // Second pass: find present letters (yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;
    for (let j = 0; j < 5; j++) {
      if (!targetUsed[j] && guessLetters[i] === targetLetters[j]) {
        result[i] = 'present';
        targetUsed[j] = true;
        break;
      }
    }
  }

  return result;
}
