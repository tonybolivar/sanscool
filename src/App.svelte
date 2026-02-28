<script>
  import { onMount } from 'svelte';
  import Layout from './Layout.svelte';

  const originalQuotes = [
    { text: "* heya. you look like you need enterprise software.", head: "normal", body: "idle" },
    { text: "* my prices are a real steal. heh. get it.", head: "grin_look_left", body: "shrug" },
    { text: "* don't worry about the fine print. i'm not reading it either.", head: "grin_look_right", body: "idle" },
    { text: "* we also offer spamton's PREMIUM DEALS [[BIG SHOT]] tier.", head: "normal", body: "shrug" },
    { text: "* kris, where the hell are we.", head: "grin_look_left", body: "idle" },
    { text: "* i've got a skeleton crew working on your request. literally.", head: "grin_look_right", body: "shrug" },
    { text: "* shortcuts are my specialty. mostly the ones that skip the work.", head: "normal", body: "shrug" },
    { text: "* do you want some fried snow? it's a hot commodity.", head: "grin_look_left", body: "idle" },
    { text: "* tibia honest, i'm just here for the ketchup breaks.", head: "grin_look_right", body: "shrug" },
    { text: "* i know a guy who knows a guy. he's a bit... different.", head: "normal", body: "idle" },
    { text: "* take a seat. i've got a lot of work to do. (none).", head: "grin_look_left", body: "shrug" },
    { text: "* you're gonna have a good time. probably.", head: "normal", body: "idle" },
  ];

  const hoverQuotes = {
    'feature-1': { text: "* that's a feature. or a bug. i forgot.", head: "grin_look_right", body: "shrug" },
    'feature-2': { text: "* this one's extra bone-dry. heh.", head: "grin_look_left", body: "shrug" },
    'feature-3': { text: "* you're really looking at everything, huh?", head: "normal", body: "idle" },
    'pricing': { text: "* don't look at the price. look at my face.", head: "grin_look_right", body: "idle" },
    'footer': { text: "* see ya around, kid.", head: "normal", body: "idle" }
  };

  let currentQuoteObj = originalQuotes[0];
  let quoteIndex = 0;
  let scrollY = 0;
  let hoveredItem = null;
  let headBouncing = false;

  let displayedText = "";
  let typingInterval;

  function startTyping(text) {
    if (typingInterval) clearInterval(typingInterval);
    displayedText = "";
    let i = 0;
    typingInterval = setInterval(() => {
      if (i < text.length) {
        displayedText += text[i];
        i++;
      } else {
        clearInterval(typingInterval);
        // Random wait between 1 and 4 seconds then go to next quote if not hovering
        const randomDelay = Math.floor(Math.random() * 3000) + 1000;
        setTimeout(() => {
          if (!hoveredItem) nextQuote();
        }, randomDelay);
      }
    }, 40);
  }

  function updateQuote(newQuoteObj) {
    if (!newQuoteObj) return;
    currentQuoteObj = newQuoteObj;
    startTyping(newQuoteObj.text);
  }

  function nextQuote() {
    quoteIndex = (quoteIndex + 1) % originalQuotes.length;
    updateQuote(originalQuotes[quoteIndex]);
  }

  async function handleHover(id) {
    if (hoveredItem === id) return;
    hoveredItem = id;
    
    // Force animation reset
    headBouncing = false;
    await new Promise(r => setTimeout(r, 10));
    headBouncing = true;

    if (id && hoverQuotes[id]) {
      updateQuote(hoverQuotes[id]);
    }
  }

  function handleMouseLeave() {
    hoveredItem = null;
    // Typing will resume/cycle naturally from startTyping's timeout
  }

  function endBounce() {
    headBouncing = false;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    updateQuote(originalQuotes[0]);
    return () => {
      if (typingInterval) clearInterval(typingInterval);
    };
  });

  $: isScrolled = scrollY > 250;
  $: mainOpacity = Math.max(0.1, 1 - (scrollY / 400));

  const ASSET_PATH = "/src/assets/sans/";
  const HEADS = {
    normal: ASSET_PATH + "normal.png",
    grin_look_left: ASSET_PATH + "grin_look_left.png",
    grin_look_right: ASSET_PATH + "grin_look_right.png"
  };
  const BODIES = {
    idle: ASSET_PATH + "torso_idle.png",
    shrug: ASSET_PATH + "torso_shrug.png"
  };
  const LEGS = ASSET_PATH + "leg.png";
  const TABLE = "https://via.placeholder.com/320x100/4a2c2a/FFFFFF?text=TABLE";
</script>

<svelte:window bind:scrollY={scrollY} />

<Layout {scrollToTop}>
  <!-- Main Hero Section -->
  <section class="hero" style="opacity: {mainOpacity}; pointer-events: {mainOpacity < 0.2 ? 'none' : 'auto'}">
    <div class="sans-container">
      <h1 class="header-text">sans.cool</h1>
      
      <div class="scene-row">
        <div class="sans-group">
          <div class="sans-parts">
            <img 
              src={HEADS[currentQuoteObj.head] || HEADS.normal} 
              alt="Head" 
              class="sans-head" 
              class:bounce={headBouncing} 
              on:animationend={endBounce}
            />
            <img src={BODIES[currentQuoteObj.body] || BODIES.idle} alt="Body" class="sans-body" />
            <img src={LEGS} alt="Legs" class="sans-legs" />
          </div>
          <img src={TABLE} alt="Table" class="table-sprite" />
        </div>

        <div class="dialogue-box" on:click={nextQuote} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && nextQuote()}>
          <p class="quote-text">{displayedText}</p>
        </div>
      </div>
    </div>

    <div class="scroll-hint">
      <div class="arrow-pulsing">
        <span>▼</span>
        <span>▼</span>
        <span>▼</span>
      </div>
      <p>scroll down</p>
    </div>
  </section>

  <!-- Sticky Header -->
  <div class="sticky-header" class:visible={isScrolled}>
    <div class="sticky-content">
      <div class="mini-sans-group">
        <div class="mini-parts">
          <img 
            src={HEADS[currentQuoteObj.head] || HEADS.normal} 
            alt="Head" 
            class="mini-head" 
            class:bounce={headBouncing}
            on:animationend={endBounce}
          />
          <img src={BODIES[currentQuoteObj.body] || BODIES.idle} alt="Body" class="mini-body" />
          <img src={LEGS} alt="Legs" class="mini-legs" />
        </div>
      </div>
      <div class="mini-dialogue">
        <p class="quote-text">{displayedText}</p>
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <section class="content-section">
    <div class="container">
      <h2 on:mouseenter={() => handleHover('feature-1')} on:mouseleave={handleMouseLeave}>Our "Features"</h2>
      <div class="grid">
        <div class="card" on:mouseenter={() => handleHover('feature-1')} on:mouseleave={handleMouseLeave}>
          <h3>Bad Puns</h3>
          <p>They're humerus. You'll love them.</p>
        </div>
        <div class="card" on:mouseenter={() => handleHover('feature-2')} on:mouseleave={handleMouseLeave}>
          <h3>Ketchup</h3>
          <p>Industry standard condiment integration.</p>
        </div>
        <div class="card" on:mouseenter={() => handleHover('feature-3')} on:mouseleave={handleMouseLeave}>
          <h3>Shortcuts</h3>
          <p>I know a guy who knows a guy.</p>
        </div>
      </div>

      <div class="spacer"></div>

      <h2 on:mouseenter={() => handleHover('pricing')} on:mouseleave={handleMouseLeave}>Fair Pricing</h2>
      <div class="pricing-table" on:mouseenter={() => handleHover('pricing')} on:mouseleave={handleMouseLeave}>
        <div class="price-row"><span>Soul</span> <span>9999G</span></div>
        <div class="price-row"><span>Fried Snow</span> <span>5G</span></div>
        <div class="price-row"><span>Actually Nothing</span> <span>Free</span></div>
      </div>

      <div class="spacer"></div>

      <footer on:mouseenter={() => handleHover('footer')} on:mouseleave={handleMouseLeave}>
        <p>* don't forget to like and subscribe to my timeline.</p>
      </footer>
    </div>
  </section>
</Layout>

<style>
  .hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
    background-color: #000;
  }

  .header-text {
    font-family: 'Press Start 2P', cursive;
    font-size: 48px;
    margin-bottom: 40px;
    text-shadow: 4px 4px #000;
    color: #fff !important;
    text-align: center;
  }

  .scene-row {
    display: flex;
    align-items: center;
    gap: 30px; /* Reduced gap */
  }

  .sans-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sans-parts {
    position: relative;
    width: 230px; /* Increased */
    height: 280px; /* Increased */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sans-head {
    width: 72px; /* Increased by 2px */
    image-rendering: pixelated;
    position: absolute;
    top: 32px; /* Raised by 2px */
    z-index: 3;
    animation: head-idle 6s ease-in-out infinite;
  }

  .sans-head.bounce, .mini-head.bounce {
    animation: head-bounce-once 0.4s ease-out forwards;
  }

  @keyframes head-idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); } /* Reduced by 2px */
  }

  @keyframes head-bounce-once {
    0%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); } /* Less bit higher */
  }

  .sans-body {
    width: 175px; /* Bigger */
    image-rendering: pixelated;
    position: absolute;
    top: 90px;
    z-index: 2;
    animation: body-idle 6s ease-in-out infinite;
  }

  .sans-legs {
    width: 115px; /* Bigger */
    image-rendering: pixelated;
    position: absolute;
    top: 150px;
    z-index: 1;
  }

  @keyframes body-idle {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-4px) scaleX(1.04) scaleY(1.01); }
  }

  .table-sprite {
    display: none;
  }

  .dialogue-box {
    border: 4px solid #fff;
    background: #000;
    padding: 20px;
    width: 450px;
    min-height: 120px;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 20;
  }

  .quote-text {
    font-family: 'Press Start 2P', cursive;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    color: #fff !important;
    text-align: left;
  }

  /* Sticky Header */
  .sticky-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 140px;
    background: rgba(0, 0, 0, 0.95);
    border-bottom: 2px solid #fff;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-110%);
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .sticky-header.visible {
    transform: translateY(0);
  }

  .sticky-content {
    display: flex;
    align-items: center;
    justify-content: center; /* Center the whole group */
    gap: 20px;
    width: 100%;
  }

  .mini-sans-group {
    position: relative;
    width: 180px;
    height: 220px;
    transform: scale(0.6);
    transform-origin: center center;
    flex-shrink: 0;
    margin-right: -30px; /* Adjusted for larger scale */
  }

  .mini-parts img {
    position: absolute;
    image-rendering: pixelated;
  }

  .mini-head { width: 64px; top: 20px; left: 7px; z-index: 3; animation: head-idle 6s ease-in-out infinite; }
  .mini-body { width: 150px; top: 75px; left: -35px; z-index: 2; animation: body-idle 6s ease-in-out infinite; }
  .mini-legs { width: 100px; top: 125px; left: -10px; z-index: 1; }

  .mini-dialogue {
    width: 500px;
    height: 40px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .mini-dialogue p {
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    line-height: 1.4;
    margin: 0;
    color: #fff !important;
    width: 100%;
  }

  /* Scroll Hint */
  .scroll-hint {
    position: absolute;
    bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    animation: arrow-pulse 2s infinite;
  }

  .arrow-pulsing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .arrow-pulsing span { color: #fff; }
  .scroll-hint p { font-family: 'Press Start 2P', cursive; font-size: 10px; color: #888; margin: 0; }

  @keyframes arrow-pulse {
    0%, 100% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(10px); }
  }

  /* Content */
  .content-section {
    padding: 100px 20px;
    min-height: 150vh;
    background: #000;
    color: #fff;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding-top: 100px;
  }

  h2 { font-family: 'Press Start 2P', cursive; font-size: 24px; border-bottom: 4px solid #fff; padding-bottom: 10px; margin-bottom: 40px; color: #fff; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .card { border: 2px solid #fff; padding: 20px; transition: background 0.2s; background: #000; }
  .card:hover { background: #111; }
  .card h3 { font-family: 'Press Start 2P', cursive; font-size: 14px; margin-bottom: 10px; color: #4fc3f7; }
  .card p { font-family: 'Press Start 2P', cursive; font-size: 10px; line-height: 1.4; }

  .pricing-table { border: 2px solid #fff; padding: 20px; background: #000; }
  .price-row { font-family: 'Press Start 2P', cursive; font-size: 12px; display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 2px dotted #444; }
  .spacer { height: 150px; }
  footer { text-align: center; color: #888; font-size: 12px; border-top: 4px solid #fff; padding-top: 40px; }

  @media (max-width: 768px) {
    .scene-row { flex-direction: column; }
    .grid { grid-template-columns: 1fr; }
    .dialogue-box { width: 90vw; }
    .sticky-content { width: 95%; gap: 10px; }
  }
</style>
