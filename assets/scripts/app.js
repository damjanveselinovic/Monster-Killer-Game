const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONST_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 0;
const MODE_STRONG_ATTACK = 1;

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "STRONG_PLAYER_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let chosenMaxLife = parseInt(
  prompt("Choose ur and the monsters max life", "100")
); //lets the user choose

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let battleLog = []; //for SHOW LOG

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry;
  if (event == LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      Event: event,
      Value: value,
      Target: "MONSTER",
      FinalMonsterHealth: monsterHealth,
      FinalPlayerHealth: playerHealth,
    };
  } else if (event == LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      Event: event,
      Value: value,
      Target: "MONSTER",
      FinalMonsterHealth: monsterHealth,
      FinalPlayerHealth: playerHealth,
    };
  } else if (event == LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      Event: event,
      Value: value,
      Target: "PLAYER",
      FinalMonsterHealth: monsterHealth,
      FinalPlayerHealth: playerHealth,
    };
  } else if (event == LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      Event: event,
      Value: value,
      Target: "PLAYER",
      FinalMonsterHealth: monsterHealth,
      FinalPlayerHealth: playerHealth,
    };
  } else {
    logEntry = {
      Event: event,
      Value: value,
      FinalMonsterHealth: monsterHealth,
      FinalPlayerHealth: playerHealth,
    };
  }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const playerDamage = dealPlayerDamage(MONST_ATTACK_VALUE);
  const initialPlayerHealth = currentPlayerHealth;
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth; //setting the current health to initial health before the monster hit us!
    setPlayerHealth = initialPlayerHealth;
    alert("You would be dead but the bonus life has saved you.");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("Victory! The monster is dead.");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Defeat. The monster has killed you.");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw.");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset(); //duplication could be minimized if(currentHealthEither <=0) reset();
  }
}

function attackMonster(typeOfAttack) {

  //Ternary operator:
  //skracivanje koda i if statementa
  const maxDamage=typeOfAttack==MODE_ATTACK ? ATTACK_VALUE:STRONG_ATTACK_VALUE;
  const logEvent=typeOfAttack==MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK: LOG_EVENT_PLAYER_STRONG_ATTACK;

  /*
  let maxDamage;
  let logEvent;
  if (typeOfAttack == MODE_ATTACK) {
    maxDamage == ATTACK_VALUE;
    logEvent == LOG_EVENT_PLAYER_ATTACK;
  } else if (typeOfAttack == MODE_STRONG_ATTACK) {
    maxDamage == STRONG_ATTACK_VALUE;
    logEvent == LOG_EVENT_PLAYER_STRONG_ATTACK;
  }*/

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent, 
    damage, 
    currentMonsterHealth, 
    currentPlayerHealth
  );

  //Monster attacking back automatically
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
  /*const damage = dealMonsterDamage(ATTACK_VALUE);
  currentMonsterHealth -= damage;

  //Monster attacking back automatically
  const playerDamage = dealPlayerDamage(MONST_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("Victory! The monster is dead.");
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Defeat. The monster has killed you.");
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw.");
  }*/
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
  /*const damage = dealMonsterDamage(STRONG_ATTACK_VALUE);
  currentMonsterHealth -= damage;

  //Monster attacking back automatically
  const playerDamage = dealPlayerDamage(MONST_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("Victory! The monster is dead.");
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Defeat. The monster has killed you.");
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw.");
  }*/
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth + HEAL_VALUE >= chosenMaxLife) {
    alert("You can't heal to more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound(); //primamo udarac od monstera i posle heala, da ne pozivamo fju onda bismo mogli da se healujemo vecno
}

function printLogHandler() {
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
