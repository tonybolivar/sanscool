<script>
  import { onMount, onDestroy } from 'svelte';
  import { dialogueIndex, dialogueLines, sleeping } from '../stores/game.js';

  let displayText = '';
  let isTyping = false;
  let currentLine = 0;
  let typeTimer = null;
  let cycleTimer = null;
  let isSleeping = false;

  sleeping.subscribe(v => {
    isSleeping = v;
    if (v) {
      clearTimeout(typeTimer);
      clearTimeout(cycleTimer);
      displayText = '* z z z . . .';
    } else {
      startCycle();
    }
  });

  dialogueIndex.subscribe(i => {
    currentLine = i;
  });

  async function typeText(text) {
    isTyping = true;
    displayText = '';
    for (const ch of text) {
      if (!isTyping) break;
      displayText += ch;
      await new Promise(r => { typeTimer = setTimeout(r, 35); });
    }
    isTyping = false;
  }

  function nextLine() {
    if (isSleeping) return;
    clearTimeout(cycleTimer);
    isTyping = false;
    const next = ($dialogueIndex + 1) % $dialogueLines.length;
    dialogueIndex.set(next);
    typeText($dialogueLines[next]).then(scheduleCycle);
  }

  function scheduleCycle() {
    if (isSleeping) return;
    cycleTimer = setTimeout(nextLine, 3200);
  }

  function startCycle() {
    typeText($dialogueLines[$dialogueIndex]).then(scheduleCycle);
  }

  function handleClick() {
    nextLine();
  }

  onMount(() => {
    startCycle();
  });

  onDestroy(() => {
    clearTimeout(typeTimer);
    clearTimeout(cycleTimer);
  });

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="dialogue-box"
  on:click={handleClick}
  role="button"
  tabindex="0"
  aria-label="Dialogue box — click to advance"
  on:keydown={e => e.key === ' ' && handleClick()}
>
  <div class="portrait" aria-hidden="true">
    <!-- Mini Sans face portrait -->
    <div class="portrait-face">
      <div class="portrait-eyes">
        <div class="p-eye"></div>
        <div class="p-eye left"></div>
      </div>
      <div class="portrait-smile">
        <span>—</span>
      </div>
    </div>
  </div>
  <div class="dialogue-text">
    <span>{displayText}</span>{#if isTyping}<span class="type-cursor">▮</span>{:else}<span class="advance-hint">▼</span>{/if}
  </div>
</div>

<style>
  .dialogue-box {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: min(700px, 96vw);
    border: 4px solid #ffffff;
    background: #000000;
    display: flex;
    align-items: center;
    gap: 0;
    cursor: pointer;
    z-index: 50;
    image-rendering: pixelated;
  }

  .portrait {
    width: 72px;
    min-width: 72px;
    height: 72px;
    border-right: 4px solid #ffffff;
    background: #111122;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .portrait-face {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .portrait-eyes {
    display: flex;
    gap: 8px;
  }

  .p-eye {
    width: 10px;
    height: 8px;
    background: #ffffff;
    border: 2px solid #333;
    position: relative;
  }

  .p-eye.left::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(79, 195, 247, 0.7) 0%, transparent 70%);
  }

  .portrait-smile {
    font-size: 12px;
    color: #333;
    line-height: 1;
    font-family: monospace;
  }

  .dialogue-text {
    flex: 1;
    padding: 12px 16px;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffffff;
    line-height: 1.8;
    min-height: 72px;
    display: flex;
    align-items: center;
    word-break: break-word;
  }

  .type-cursor {
    animation: blink 0.6s step-end infinite;
    margin-left: 2px;
  }

  .advance-hint {
    animation: blink 1s ease-in-out infinite;
    margin-left: 4px;
    font-size: 8px;
    color: #ffffff;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
</style>
