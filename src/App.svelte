<script>
  import { onMount, onDestroy } from 'svelte';
  import { logoHoverCount, showJevil, napstablookActive } from './lib/stores/game.js';

  import Scene from './lib/scene/Scene.svelte';
  import DialogueBox from './lib/ui/DialogueBox.svelte';
  import BattleMenu from './lib/ui/BattleMenu.svelte';
  import SoulCursor from './lib/ui/SoulCursor.svelte';
  import Features from './lib/sections/Features.svelte';
  import Pricing from './lib/sections/Pricing.svelte';
  import Testimonials from './lib/sections/Testimonials.svelte';
  import Footer from './lib/sections/Footer.svelte';

  let pageLoaded = false;
  let logoText = 'SANS.EXE';
  let logoHovers = 0;
  let napstablookMode = false;
  let napstablookEmojis = [];
  let emojiId = 0;
  let jevilVisible = false;

  // Konami code
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiProgress = 0;

  // Napstablook listener
  let napstaBuffer = '';

  function handleKeydown(e) {
    // Konami code
    if (e.key === KONAMI[konamiProgress]) {
      konamiProgress++;
      if (konamiProgress === KONAMI.length) {
        konamiProgress = 0;
        triggerJevil();
      }
    } else {
      konamiProgress = 0;
    }

    // Napstablook easter egg
    napstaBuffer += e.key.toLowerCase();
    if (napstaBuffer.length > 12) napstaBuffer = napstaBuffer.slice(-12);
    if (napstaBuffer.includes('napstablook')) {
      napstaBuffer = '';
      triggerNapstablook();
    }
  }

  function triggerJevil() {
    jevilVisible = true;
    setTimeout(() => { jevilVisible = false; }, 3000);
  }

  function triggerNapstablook() {
    napstablookMode = true;
    for (let i = 0; i < 8; i++) {
      const id = emojiId++;
      const x = 10 + Math.random() * 80;
      const delay = i * 200;
      napstablookEmojis = [...napstablookEmojis, { id, x, delay }];
      setTimeout(() => {
        napstablookEmojis = napstablookEmojis.filter(e => e.id !== id);
      }, delay + 2500);
    }
    setTimeout(() => { napstablookMode = false; }, 3000);
  }

  function handleLogoHover() {
    logoHovers++;
    if (logoHovers >= 5) {
      logoHovers = 0;
      logoText = 'DELTARUNE';
      setTimeout(() => { logoText = 'SANS.EXE'; }, 1000);
    }
  }

  onMount(() => {
    // Boot fade-in
    setTimeout(() => { pageLoaded = true; }, 100);
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<svelte:head>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      border-radius: 0 !important;
    }

    html {
      scroll-behavior: auto;
    }

    body {
      margin: 0;
      padding: 0;
      background: #000000;
      overflow-x: hidden;
      cursor: none;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      background: #0d0d1a;
    }
    ::-webkit-scrollbar-thumb {
      background: #ffffff;
      border: 2px solid #0d0d1a;
    }
    ::-webkit-scrollbar-track {
      background: #0d0d1a;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  </style>
</svelte:head>

<!-- Boot overlay -->
{#if !pageLoaded}
  <div class="boot-overlay"></div>
{/if}

<!-- SOUL cursor -->
<SoulCursor />

<!-- Napstablook emojis -->
{#each napstablookEmojis as em (em.id)}
  <div
    class="napsta-emoji"
    style="left: {em.x}%; animation-delay: {em.delay}ms;"
    aria-hidden="true"
  >😢</div>
{/each}

<!-- Napstablook dim overlay -->
{#if napstablookMode}
  <div class="napsta-dim" aria-hidden="true"></div>
{/if}

<!-- Jevil overlay -->
{#if jevilVisible}
  <div class="jevil-overlay" aria-live="assertive">
    <div class="jevil-text">* I CAN DO ANYTHING</div>
    <div class="jevil-sub">— JEVIL</div>
  </div>
{/if}

<!-- Page wrapper -->
<div class="page" class:loaded={pageLoaded}>
  <!-- NAV / LOGO -->
  <nav class="nav" aria-label="Navigation">
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div
      class="logo"
      on:mouseover={handleLogoHover}
      role="banner"
      aria-label="SANS.EXE logo"
    >{logoText}</div>
    <div class="nav-links">
      <a href="#features" class="nav-link">* features</a>
      <a href="#pricing" class="nav-link">* pricing</a>
      <a href="#testimonials" class="nav-link">* reviews</a>
    </div>
  </nav>

  <!-- HERO SCENE -->
  <main>
    <Scene />
    <DialogueBox />
    <BattleMenu />
  </main>

  <!-- SECTIONS -->
  <div id="features"><Features /></div>
  <div id="pricing"><Pricing /></div>
  <div id="testimonials"><Testimonials /></div>
  <Footer />
</div>

<style>
  .boot-overlay {
    position: fixed;
    inset: 0;
    background: #000000;
    z-index: 10000;
    pointer-events: none;
  }

  .page {
    opacity: 0;
    transition: opacity 0.8s ease;
    min-height: 100vh;
    background: #0d0d1a;
  }

  .page.loaded {
    opacity: 1;
  }

  /* NAV */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: rgba(13, 13, 26, 0.92);
    border-bottom: 4px solid #ffffff;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .logo {
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: #4fc3f7;
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(79, 195, 247, 0.7);
    cursor: pointer;
    user-select: none;
  }

  .nav-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .nav-link {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffffff;
    text-decoration: none;
  }

  .nav-link:hover {
    color: #4fc3f7;
  }

  /* Napstablook dim */
  .napsta-dim {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 300;
    pointer-events: none;
    animation: dim-fade 3s ease forwards;
  }

  @keyframes dim-fade {
    0%   { opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }

  /* Napstablook emojis */
  .napsta-emoji {
    position: fixed;
    bottom: 20%;
    font-size: 32px;
    animation: sad-float 2.5s ease-out forwards;
    z-index: 400;
    pointer-events: none;
  }

  @keyframes sad-float {
    0%   { transform: translateY(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-120px); opacity: 0; }
  }

  /* Jevil overlay */
  .jevil-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.88);
    z-index: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    animation: jevil-appear 3s ease forwards;
  }

  @keyframes jevil-appear {
    0%   { opacity: 0; }
    10%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }

  .jevil-text {
    font-family: 'Press Start 2P', monospace;
    font-size: 24px;
    color: #ff2222;
    text-shadow: 0 0 20px rgba(255, 34, 34, 1), 0 0 60px rgba(255, 34, 34, 0.5);
    animation: jevil-glitch 0.15s step-end infinite;
    text-align: center;
    padding: 0 16px;
  }

  @keyframes jevil-glitch {
    0%, 90%, 100% { transform: translateX(0); filter: none; }
    92%  { transform: translateX(-4px); filter: hue-rotate(180deg); }
    94%  { transform: translateX(4px); }
    96%  { transform: translateX(-2px); filter: hue-rotate(90deg); }
  }

  .jevil-sub {
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    color: #888;
    margin-top: 16px;
  }
</style>
