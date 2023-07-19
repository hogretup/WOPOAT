// Exp earned = difficulty*score*10

// Calculates cumulative exp given level i.e. lvl 1 has 0 cumulative exp, lvl 2 has 50 cumulative exp, lvl 3 has 150, etc.
export function LevelToEXP(level) {
  return 25 * level * (level - 1);
}

// Calculates EXP percentage for progress bar
export function EXPpercentage(level, EXP) {
  const percentage = (EXP / (level * 50)) * 100;
  const roundedPercentage = percentage.toFixed(2);
  return roundedPercentage;
}

// Calclulates level given cumulative EXP
export function EXPToLevel(EXP) {
  let level = 1;
  while (EXP >= LevelToEXP(level)) {
    level += 1;
  }

  return level - 1;
}

// Given current level, EXP, and score + difficulty of quiz completed, return new level and EXP
export function progress(currLevel, currEXP, score, difficulty) {
  let EXPgained = score * difficulty * 10;
  console.log(EXPgained);
  let cumulativeEXP = LevelToEXP(currLevel) + currEXP + EXPgained;
  console.log(cumulativeEXP);
  let nxtLevel = EXPToLevel(cumulativeEXP);
  let nxtEXP = cumulativeEXP - LevelToEXP(nxtLevel);
  return { nextLevel: nxtLevel, nextEXP: nxtEXP };
}
