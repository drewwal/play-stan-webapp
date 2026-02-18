/**
 * Stan's cheeky commentary based on game events
 * Stan is a snarky cat who likes to tease the player
 */

export interface MessageContext {
  outcome: "win" | "loss" | "start" | "gameOver";
  bet?: number;
  chips?: number;
  reason?: "chips" | "deck" | "tie" | "highScore";
}

/**
 * Generates a random cheeky message from Stan based on the game context
 */
export function getStanMessage(context: MessageContext): string {
  const { outcome, bet, chips, reason } = context;

  let messages: string[] = [];

  if (outcome === "start") {
    messages = [
      "Welcome, human! 😼 Guess if the next card is HIGHER or LOWER. Win and you gain chips, lose and... well, I get richer. Ties? Those go to me, obviously. You start with 3 chips. Don't spend them all at once!",
      "Hey there! 😺 Simple game: guess HIGHER or LOWER for the next card. Correct? You win your bet. Wrong or tie? I take your chips. You've got 3 to start. Try not to disappoint me!",
      "Alright, listen up! 🐱 Pick HIGHER or LOWER, bet some chips, and see if you're right about the next card. Win = chips doubled. Lose or tie = I win. You have 3 chips. Make them last!",
      "New game time! 😼 Bet your chips and guess if the next card beats the current one. HIGHER or LOWER - your call. Equal cards = you lose (house rules!). Starting chips: 3. Ready?",
      "Back for more? 😸 Rules are simple: HIGHER or LOWER than the current card. Guess right, win chips. Guess wrong or tie, lose 'em. You've got 3 chips. Let's see how long they last!",
      "Oh, you again! 🐱 Here's how it works: bet chips, pick HIGHER or LOWER. Correct guess = you win. Wrong or matching card = I win. Starting amount: 3 chips. Good luck!",
      "Ready to lose some chips? 😼 Just kidding! Maybe. Pick HIGHER or LOWER for the next card, bet what you want. Win doubles your bet, lose and I keep it. Ties count as losses. You have 3 chips!",
      "Let's play! 😺 Guess if the next card is HIGHER or LOWER. Win your bet or lose it - pretty straightforward. Oh, and equal cards? Those are mine. You start with 3 chips. Don't waste them!",
    ];
  } else if (outcome === "win") {
    if (bet === 1) {
      messages = [
        "Wow, a whole chip. Don't spend it all in one place. 😏",
        "One chip? Living dangerously I see. 🙄",
        "Congratulations on your... minimal success. 😒",
        "You won! But like, barely. 😼",
        "One chip closer to beating me. Only need a miracle now! 😸",
        "I let you have that one. Don't get cocky. 🐱",
        "A single chip victory. How thrilling for you. 😾",
        "You got one chip. Want a trophy? 🏆 Too bad!",
        "One whole chip! Next you'll be asking for a parade. 😹",
        "I wasn't even trying. But congrats on the chip. 😺",
        "That chip had your name on it. Unfortunately. 🙄",
        "You're up by one! Alert the press! 😼",
      ];
    } else if (bet === 2) {
      messages = [
        "Two whole chips! Should I be worried? Nah. 😏",
        "Not bad, human. But I'm still ahead of you. 😼",
        "Lucky guess, but okay, I'll give you that one. 😸",
        "Two chips! That's almost impressive. Almost. 🙄",
        "Oh look, someone's getting confident. Adorable. 😺",
        "Two chip win! Don't let it go to your head. 😾",
        "Decent win. For a beginner. Which you are. 😹",
        "Two chips richer! Still broke though. 😼",
        "You won 2! I'm... not concerned. At all. 😏",
        "Nice! Now do it again. Bet you can't. 😸",
        "Two chips! Maybe you're learning. Nah. 🐱",
        "I might've miscalculated. Kidding! You got lucky. 😺",
      ];
    } else {
      messages = [
        `${bet} chips?! Okay, you got me this time. 😾`,
        `Big win! Don't let it go to your head. 😤`,
        `Alright, alright, that was decent. For a human. 😒`,
        `${bet} chips! Someone's on a hot streak... for now. 🔥`,
        `Impressive! But luck runs out, you know. 😼`,
        `Fine, you won big. I was distracted by a laser pointer. 🔴`,
        `${bet} chips! Show off. I'll get them back later. 😹`,
        `Woah there! ${bet} chips? Enjoy it while it lasts! 😸`,
        `All ${bet} chips?! This is just embarrassing. For me. 😿`,
        `Okay, that was actually good. Don't tell anyone I said that. 🤫`,
        `${bet} chip jackpot! You're really testing me now. 😤`,
        `Bold bet paid off! Must be beginner's luck. Right? 😼`,
      ];
    }
  } else if (outcome === "loss") {
    if (reason === "tie") {
      messages = [
        "Same card? That's a loss, sweetie. House rules! 😹",
        "Ties go to the cat. It's in the rulebook. That I wrote. 😼",
        "Matching cards mean I win. Meow's rules! 🐱",
        "Aww, so close! But close doesn't count. 😏",
        "Equal cards = you lose. Did I mention I love this rule? 😸",
        "Tie? More like 'try again.' Get it? 😹",
        "Matching ranks! That's my favorite way to win. 😺",
        "Same card means I win! I didn't make the rules. Oh wait, I did. 😼",
        "Identical cards! Bad news for you, great news for me! 😸",
        "A tie! Which is a loss. For you. Not for me. 😏",
        "Same rank = house wins. Thank you, come again! 😹",
        "Equal cards? That'll be mine, thank you very much. 🐱",
      ];
    } else if (bet === 1) {
      messages = [
        "Lost a chip! That hurts, doesn't it? 😹",
        "Oops! Better luck next time, human. 😸",
        "One chip down. Only a matter of time now... 😏",
        "I'll take that chip, thank you very much! 😼",
        "Oh no! Anyway... 😺",
        "That chip is mine now. I'm saving up for catnip. 🌿",
        "Minus one chip! Don't worry, it happens. A lot. 😹",
        "Wrong guess! I'll put that chip to good use. 😸",
        "Aaaand it's gone. The chip, I mean. 😼",
        "One chip poorer! Could be worse. Give it time. 😏",
        "That chip had a good home. With me. 😺",
        "Lost a chip! On the bright side... actually, no bright side. 😾",
      ];
    } else if (bet === 2) {
      messages = [
        "Two chips gone! That's gotta sting. 😹",
        "Ouch! Lost half your stash. Need a paw to cry on? 😿",
        "Two chips closer to zero! This is fun. For me. 😸",
        "Risky bet didn't pay off. Shocking! 😼",
        "I'll be keeping those chips warm for you. Forever. 😏",
        "Two chips?! Gone! Just like that! 😹",
        "Wrong call! And there goes 2 chips. Tough break. 😺",
        "Two chip loss! That's what I call progress. My progress. 😼",
        "Minus 2! Your chip pile is looking thin. 😸",
        "Lost 2 chips! Maybe betting less would help? Nah, go big! 😏",
        "Two chips: GONE. My condolences. Not really. 😾",
        "Oopsie! Two whole chips down the drain. 😹",
      ];
    } else {
      messages = [
        `Lost ${bet} chips! That's gonna leave a mark. 😹`,
        `All ${bet} chips? Gone! Just like your dignity. 😹😹`,
        `Wow, you went for it! And you LOST. Classic. 😼`,
        `${bet} chips down the drain. This is my favorite part! 😸`,
        `Big bet, big loss. Thanks for playing! 😺`,
        `That was painful to watch. For you, not me. I loved it. 😻`,
        `${bet} chips GONE! Maybe think smaller next time? 😹`,
        `Bold move betting ${bet}! Terrible outcome though. 😼`,
        `Lost all ${bet}! I felt that one. Actually no, I didn't. 😏`,
        `There goes ${bet} chips! Want to talk about it? Too bad! 😸`,
        `${bet} chip disaster! This is quality entertainment. 😺`,
        `Yikes! ${bet} chips evaporated. Better luck... someday? 😾`,
      ];
    }
  } else if (outcome === "gameOver") {
    if (reason === "chips") {
      messages = [
        "Out of chips! Better luck next time, sport. 😹",
        "Broke already? That was quick! 😸",
        "Zero chips! Don't worry, I'll remember you fondly. 😼",
        "Game over! Want me to loan you some chips? Just kidding! 😹",
        "All out! That's what happens when you play against a cat. 😺",
        "Aaand you're broke. Surprise surprise! 😏",
        "No more chips! But hey, you gave it your best shot. Emphasis on 'best.' 😒",
        "Bankrupt! Don't feel bad, happens to the best of humans. 😹",
        "Zero chips remaining! Thanks for the entertainment! 😸",
        "All gone! That was fun. For me, anyway. 😼",
        "Out of chips! Time for a new game. Same result probably. 😺",
        "Broke! Maybe cards aren't your thing? 😏",
        "No chips left! I'll cherish these memories. Of winning. 😾",
        "Game over! You lasted longer than most. Not really. 😹",
      ];
    } else if (reason === "deck") {
      messages = [
        `Out of cards! You survived with ${chips} chips. Not bad! 😸`,
        `Deck's empty! Final score: ${chips} chips. Could be worse! 😺`,
        `No more cards! You ended with ${chips}. I've seen worse humans. 😼`,
        `Cards gone! ${chips} chips left. Respectable. For a human. 😏`,
        `That's all the cards! ${chips} chips ain't bad. But I could do better. 😹`,
        `Deck exhausted! You got ${chips} chips. Pretty good! ...for you. 😸`,
        `All cards played! You finished with ${chips}. Not terrible! 😺`,
        `No more cards! Final tally: ${chips} chips. Decent showing! 😼`,
        `Deck's done! ${chips} chips is your score. I'm... impressed? 😏`,
        `Cards are gone! You kept ${chips} chips alive. Well played! 😸`,
        `Out of cards! ${chips} chips survived. Could've been worse! 😹`,
        `Game complete! ${chips} chips remain. Not bad for a human! 😺`,
        `No cards left! ${chips} chips is respectable. Barely. 😼`,
        `End of deck! ${chips} chips made it through. Congrats! 😸`,
      ];
    } else if (reason === "highScore") {
      messages = [
        `🏆 NEW HIGH SCORE: ${chips} chips! I'm actually impressed. Don't let it go to your head. 😼`,
        `🏆 ${chips} chips — a new record! I'll pretend I'm not impressed. 😏`,
        `🏆 HIGH SCORE! ${chips} chips! Okay, maybe you're not completely terrible. 😸`,
        `🏆 New best: ${chips} chips! I'm telling everyone I let you win. 😹`,
        `🏆 ${chips} chips — that's a new personal best! Frame it or something. 😺`,
        `🏆 RECORD BREAKER! ${chips} chips! ...I was going easy on you, obviously. 😼`,
        `🏆 New high score: ${chips}! Write it down before you forget what success feels like. 😏`,
        `🏆 ${chips} chips! A new record! Even I have to admit that's decent. 😸`,
      ];
    }
  }

  // Pick a random message from the appropriate list
  return messages[Math.floor(Math.random() * messages.length)];
}
