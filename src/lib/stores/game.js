import { writable } from 'svelte/store';

export const dialogueIndex = writable(0);
export const hp = writable(84);
export const menuSelection = writable(0); // 0=FIGHT,1=ACT,2=ITEM,3=MERCY
export const showItemPopup = writable(false);
export const mercyActive = writable(false);
export const fightCount = writable(0);
export const sleeping = writable(false);
export const logoHoverCount = writable(0);
export const showJevil = writable(false);
export const napstablookActive = writable(false);

export const dialogueLines = [
  "* heya. you look like you need enterprise software.",
  "* my prices are a real steal. heh. get it.",
  "* don't worry about the fine print. i'm not reading it either.",
  "* we also offer spamton's PREMIUM DEALS [[BIG SHOT]] tier.",
  "* kris, where the hell are we.",
  "* you're gonna have a good time. probably.",
];
