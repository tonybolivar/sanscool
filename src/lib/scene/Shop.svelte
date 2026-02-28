<script>
  import { onMount } from 'svelte';

  const signLines = [
    '* SaaS',
    '* hot dogs',
    "* spamton's deals",
  ];
  let signIndex = 0;
  let displayText = '';
  let typing = false;

  async function typeText(text) {
    typing = true;
    displayText = '';
    for (const ch of text) {
      displayText += ch;
      await new Promise(r => setTimeout(r, 80));
    }
    typing = false;
  }

  onMount(() => {
    typeText(signLines[0]);
    setInterval(() => {
      signIndex = (signIndex + 1) % signLines.length;
      typeText(signLines[signIndex]);
    }, 3000);
  });
</script>

<div class="shop-wrap" aria-hidden="true">
  <!-- Sign hanging above -->
  <div class="sign">
    <div class="sign-text">{displayText}<span class="cursor" class:hidden={!typing}>▮</span></div>
  </div>
  <div class="sign-chain left-chain"></div>
  <div class="sign-chain right-chain"></div>

  <!-- Counter top -->
  <div class="counter">
    <!-- Ketchup bottle -->
    <div class="ketchup">
      <div class="ketchup-cap"></div>
      <div class="ketchup-neck"></div>
      <div class="ketchup-body"></div>
      <div class="ketchup-label"></div>
    </div>
  </div>

  <!-- Legs -->
  <div class="legs">
    <div class="leg"></div>
    <div class="leg"></div>
  </div>

  <!-- Glow beneath counter -->
  <div class="counter-glow"></div>
</div>

<style>
  .shop-wrap {
    position: absolute;
    bottom: 28%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 220px;
  }

  .sign {
    border: 4px solid #ffffff;
    background: #0d0d1a;
    padding: 6px 10px;
    margin-bottom: 2px;
    min-width: 160px;
    text-align: center;
    position: relative;
  }

  .sign-text {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffffff;
    white-space: pre;
    min-height: 12px;
  }

  .cursor {
    animation: blink-cursor 0.7s step-end infinite;
  }
  .cursor.hidden {
    opacity: 0;
  }

  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .sign-chain {
    width: 4px;
    height: 12px;
    background: #aaaaaa;
    position: absolute;
    top: -14px;
  }
  .left-chain  { left: 30px; top: -14px; position: relative; }
  .right-chain { right: 30px; top: -14px; position: relative; }

  .counter {
    width: 220px;
    height: 32px;
    background: #8b5e3c;
    border: 4px solid #ffffff;
    border-bottom: none;
    position: relative;
    box-shadow: 0 0 20px 4px rgba(200, 130, 50, 0.35);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
  }

  /* Ketchup bottle */
  .ketchup {
    display: flex;
    flex-direction: column;
    align-items: center;
    image-rendering: pixelated;
  }

  .ketchup-cap {
    width: 8px;
    height: 6px;
    background: #888;
    border: 2px solid #fff;
    border-bottom: none;
  }

  .ketchup-neck {
    width: 6px;
    height: 6px;
    background: #cc2200;
    border-left: 2px solid #fff;
    border-right: 2px solid #fff;
  }

  .ketchup-body {
    width: 14px;
    height: 20px;
    background: #cc2200;
    border: 2px solid #fff;
    border-top: none;
    position: relative;
  }

  .ketchup-label {
    position: absolute;
    top: 4px;
    left: 2px;
    width: 8px;
    height: 6px;
    background: #ffffff;
  }

  .legs {
    display: flex;
    justify-content: space-between;
    width: 180px;
  }

  .leg {
    width: 16px;
    height: 40px;
    background: #8b5e3c;
    border: 4px solid #ffffff;
    border-top: none;
  }

  .counter-glow {
    position: absolute;
    bottom: -16px;
    width: 180px;
    height: 20px;
    background: radial-gradient(ellipse at center, rgba(200, 130, 50, 0.4) 0%, transparent 70%);
    pointer-events: none;
  }
</style>
