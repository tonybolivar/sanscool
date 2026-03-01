<script>
  import { onMount } from 'svelte';
  import Layout from './Layout.svelte';
  import { originalQuotes, hoverQuotes } from './quotes.js';

  let currentQuoteObj = originalQuotes[0];
  let quoteIndex = 0;
  let scrollY = 0;
  let hoveredItem = null;
  let headBouncing = false;

  let displayedText = "";
  let typingInterval;
  let audioTheme;
  let audioTyping;
  let hasInteracted = false;
  let isMuted = false;
  let shuffledQuotes = [...originalQuotes];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function playTheme() {
    if (!audioTheme) return;
    audioTheme.volume = 0.5;
    audioTheme.loop = true;
    audioTheme.muted = isMuted;
    audioTheme.play().catch(e => {
      console.log("Autoplay blocked, waiting for interaction.");
    });
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (audioTheme) {
      audioTheme.muted = isMuted;
    }
  }

  function startTyping(text) {
    if (typingInterval) clearInterval(typingInterval);
    displayedText = "";
    let i = 0;
    typingInterval = setInterval(() => {
      if (i < text.length) {
        displayedText += text[i];
        // Play sound every 2nd character to make it "slower" than text, and reduce volume
        if (text[i] !== " " && audioTyping && i % 2 === 0) {
          audioTyping.currentTime = 0;
          audioTyping.volume = 0.5;
          audioTyping.play().catch(() => {});
        }
        i++;
      } else {
        clearInterval(typingInterval);
        // Added 3000ms (3s) to the previous delay range
        const randomDelay = Math.floor(Math.random() * 3000) + 4000;
        setTimeout(() => {
          if (!hoveredItem) nextQuote();
        }, randomDelay);
      }
    }, 40);
  }

  function handleInteraction() {
    if (!hasInteracted) {
      hasInteracted = true;
      playTheme();
    }
  }

  function updateQuote(newQuoteObj) {
    if (!newQuoteObj) return;
    currentQuoteObj = newQuoteObj;
    startTyping(newQuoteObj.text);
  }

  function nextQuote() {
    handleInteraction();
    if (hoveredItem) return;
    quoteIndex = (quoteIndex + 1) % shuffledQuotes.length;
    updateQuote(shuffledQuotes[quoteIndex]);
  }

  async function handleHover(id) {
    handleInteraction();
    if (hoveredItem === id) return;
    hoveredItem = id;
    
    headBouncing = false;
    await new Promise(r => setTimeout(r, 10));
    headBouncing = true;

    if (id && hoverQuotes[id]) {
      updateQuote(hoverQuotes[id]);
    }
  }

  function handleMouseLeave() {
    hoveredItem = null;
  }

  function endBounce() {
    headBouncing = false;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    shuffledQuotes = shuffle([...originalQuotes]);
    updateQuote(shuffledQuotes[0]);
    playTheme();
    return () => {
      if (typingInterval) clearInterval(typingInterval);
    };
  });

  $: isScrolled = scrollY > 250;
  $: mainOpacity = Math.max(0.1, 1 - (scrollY / 400));

  const ASSET_PATH = "/assets/sans/";
  const HEADS = [
    { id: 'normal', src: ASSET_PATH + "normal.png" },
    { id: 'grin_look_left', src: ASSET_PATH + "grin_look_left.png" },
    { id: 'grin_look_right', src: ASSET_PATH + "grin_look_right.png" }
  ];
  const BODIES = [
    { id: 'idle', src: ASSET_PATH + "torso_idle.png" },
    { id: 'shrug', src: ASSET_PATH + "torso_shrug.png" }
  ];
  const LEGS = ASSET_PATH + "leg.png";
  const TABLE = "https://via.placeholder.com/320x100/4a2c2a/FFFFFF?text=TABLE";
</script>

<svelte:window bind:scrollY={scrollY} />

<Layout {scrollToTop}>
  <audio bind:this={audioTheme} src="/assets/sans/audio/sanstheme.opus"></audio>
  <audio bind:this={audioTyping} src="/assets/sans/audio/sanstype.opus"></audio>

  <button class="mute-btn" class:scrolled={isScrolled} on:click|stopPropagation={toggleMute} aria-label="Toggle Mute">
    {#if isMuted}
      <!-- sound-mute (regular) from @hackernoon/pixel-icon-library -->
      <svg viewBox="0 0 24 24" width="24" height="24">
        <polygon fill="currentColor" points="22 8 22 10 21 10 21 11 20 11 20 13 21 13 21 14 22 14 22 16 20 16 20 15 19 15 19 14 18 14 18 15 17 15 17 16 15 16 15 14 16 14 16 13 17 13 17 11 16 11 16 10 15 10 15 8 17 8 17 9 18 9 18 10 19 10 19 9 20 9 20 8 22 8"/>
        <path fill="currentColor" d="m11,2v1h-1v1h-1v1h-1v1h-1v1h-1v1H1v8h5v1h1v1h1v1h1v1h1v1h1v1h3V2h-3ZM3,10h4v-1h1v-1h1v-1h1v-1h1v-1h1v14h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1H3v-4Z"/>
      </svg>
    {:else}
      <!-- sound-on (regular) from @hackernoon/pixel-icon-library -->
      <svg viewBox="0 0 24 24" width="24" height="24">
        <polygon fill="currentColor" points="17 15 17 14 16 14 16 13 17 13 17 11 16 11 16 10 17 10 17 9 18 9 18 10 19 10 19 14 18 14 18 15 17 15"/>
        <polygon fill="currentColor" points="23 10 23 14 22 14 22 16 21 16 21 17 20 17 20 18 19 18 19 17 18 17 18 16 19 16 19 15 20 15 20 14 21 14 21 10 20 10 20 9 19 9 19 8 18 8 18 7 19 7 19 6 20 6 20 7 21 7 21 8 22 8 22 10 23 10"/>
        <path fill="currentColor" d="m11,2v1h-1v1h-1v1h-1v1h-1v1h-1v1H1v8h5v1h1v1h1v1h1v1h1v1h1v1h3V2h-3Zm1,17h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1H3v-4h4v-1h1v-1h1v-1h1v-1h1v-1h1v14Z"/>
      </svg>
    {/if}
  </button>

  <section class="hero" style="opacity: {mainOpacity}; pointer-events: {mainOpacity < 0.2 ? 'none' : 'auto'}" on:mousedown={handleInteraction} on:touchstart={handleInteraction}>
    <div class="sans-container">
      <h1 class="header-text">sans.cool</h1>
      
      <div class="scene-row">
        <div class="sans-group">
          <div class="sans-parts">
            <!-- Container for Head Animations to Sync -->
            <div class="head-container" class:bounce={headBouncing} on:animationend={endBounce}>
              {#each HEADS as head}
                <img src={head.src} alt="Head" class="head-sprite" class:visible={currentQuoteObj.head === head.id} />
              {/each}
            </div>

            <!-- Container for Body Animations to Sync -->
            <div class="body-container">
              {#each BODIES as body}
                <img src={body.src} alt="Body" class="body-sprite" class:visible={currentQuoteObj.body === body.id} />
              {/each}
            </div>

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
      <div class="arrow-pulsing"><span>▼</span><span>▼</span><span>▼</span></div>
      <p>scroll down</p>
    </div>
  </section>

  <div class="sticky-header" class:visible={isScrolled}>
    <div class="sticky-content">
      <div class="mini-sans-group">
        <div class="mini-parts">
          <div class="mini-head-container" class:bounce={headBouncing} on:animationend={endBounce}>
            {#each HEADS as head}
              <img src={head.src} alt="Head" class="mini-head-sprite" class:visible={currentQuoteObj.head === head.id} />
            {/each}
          </div>
          <div class="mini-body-container">
            {#each BODIES as body}
              <img src={body.src} alt="Body" class="mini-body-sprite" class:visible={currentQuoteObj.body === body.id} />
            {/each}
          </div>
          <img src={LEGS} alt="Legs" class="mini-legs" />
        </div>
      </div>
      <div class="mini-dialogue">
        <p class="quote-text">{displayedText}</p>
      </div>
    </div>
  </div>

  <section class="content-section">
    <div class="container">
      <h2 on:mouseenter={() => handleHover('feature-1')} on:mouseleave={handleMouseLeave}>Our "Features"</h2>
      <div class="grid">
        <div class="card" on:mouseenter={() => handleHover('feature-1')} on:mouseleave={handleMouseLeave}>
          <h3>Bad Puns</h3><p>They're humerus. You'll love them.</p>
        </div>
        <div class="card" on:mouseenter={() => handleHover('feature-2')} on:mouseleave={handleMouseLeave}>
          <h3>Ketchup</h3><p>Industry standard condiment integration.</p>
        </div>
        <div class="card" on:mouseenter={() => handleHover('feature-3')} on:mouseleave={handleMouseLeave}>
          <h3>Shortcuts</h3><p>I know a guy who knows a guy.</p>
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
      <footer><p>* don't forget to like and subscribe to my timeline.</p></footer>
    </div>
  </section>
</Layout>

<style>
  .hero { height: 100vh; height: 100dvh; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; z-index: 10; background-color: #000; }
  .mute-btn { position: fixed; bottom: 20px; left: 20px; background: rgba(0, 0, 0, 0.6); border: 2px solid #fff; color: #fff; padding: 8px; cursor: pointer; z-index: 3000; display: flex; align-items: center; justify-content: center; transition: top 0.3s, bottom 0.3s, left 0.3s, transform 0.3s; }

  @media (max-width: 768px) {
    .hero { height: auto; min-height: 100dvh; padding-bottom: 120px; padding-top: 60px; }
    .mute-btn.scrolled {
      bottom: auto;
      top: 15px;
      left: 15px;
      transform: none;
    }
  }
  .header-text { font-family: 'Press Start 2P', cursive; font-size: 48px; margin-bottom: 40px; text-shadow: 4px 4px #000; color: #fff !important; text-align: center; }
  .scene-row { display: flex; align-items: center; gap: 30px; }
  .sans-group { display: flex; flex-direction: column; align-items: center; }
  .sans-parts { position: relative; width: 230px; height: 280px; display: flex; flex-direction: column; align-items: center; }

  /* New containers for synced animations */
  .head-container {
    position: absolute; top: 32px; z-index: 3;
    width: 72px; height: 72px;
    animation: head-idle 6s ease-in-out infinite;
    display: flex; justify-content: center;
  }
  .head-container.bounce { animation: head-bounce-once 0.4s ease-out forwards; }

  .body-container {
    position: absolute; top: 90px; z-index: 2;
    width: 175px; height: 100px;
    animation: body-idle 6s ease-in-out infinite;
    display: flex; justify-content: center;
  }

  .head-sprite, .body-sprite, .mini-head-sprite, .mini-body-sprite {
    display: none; width: 100%; image-rendering: pixelated;
  }
  .head-sprite.visible, .body-sprite.visible, .mini-head-sprite.visible, .mini-body-sprite.visible {
    display: block;
  }

  .sans-legs { width: 115px; image-rendering: pixelated; position: absolute; top: 160px; z-index: 1; }

  @keyframes head-idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  @keyframes head-bounce-once { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
  @keyframes body-idle { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-4px) scaleX(1.04) scaleY(1.01); } }

  .table-sprite { display: none; }
  .dialogue-box { border: 4px solid #fff; background: #000; padding: 20px; width: 450px; min-height: 120px; display: flex; align-items: center; cursor: pointer; z-index: 20; user-select: none; }
  .quote-text { font-family: 'Press Start 2P', cursive; font-size: 16px; line-height: 1.6; margin: 0; color: #fff !important; text-align: left; }

  .sticky-header { position: fixed; top: 0; left: 0; width: 100%; height: 140px; background: rgba(0, 0, 0, 0.95); border-bottom: 2px solid #fff; z-index: 1000; display: flex; justify-content: center; align-items: center; transform: translateY(-110%); transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
  .sticky-header.visible { transform: translateY(0); }
  .sticky-content { display: flex; align-items: center; justify-content: center; gap: 20px; width: 100%; }

  .mini-sans-group { position: relative; width: 180px; height: 220px; transform: scale(0.6); transform-origin: center center; flex-shrink: 0; margin-right: -30px; }
  .mini-parts { position: relative; width: 100%; height: 100%; }
  
  .mini-head-container {
    position: absolute; top: 20px; left: 7px; z-index: 3; width: 64px;
    animation: head-idle 6s ease-in-out infinite;
  }
  .mini-head-container.bounce { animation: head-bounce-once 0.4s ease-out forwards; }
  
  .mini-body-container {
    position: absolute; top: 75px; left: -35px; z-index: 2; width: 150px;
    animation: body-idle 6s ease-in-out infinite;
  }
  
  .mini-legs { position: absolute; width: 100px; top: 125px; left: -10px; z-index: 1; image-rendering: pixelated; }
  .mini-dialogue { width: 500px; height: 40px; display: flex; align-items: center; flex-shrink: 0; user-select: none; }
  .mini-dialogue p { font-family: 'Press Start 2P', cursive; font-size: 10px; line-height: 1.4; margin: 0; color: #fff !important; width: 100%; }

  .scroll-hint { position: absolute; bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 10px; animation: arrow-pulse 2s infinite; }
  .arrow-pulsing { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .arrow-pulsing span { color: #fff; }
  .scroll-hint p { font-family: 'Press Start 2P', cursive; font-size: 10px; color: #888; margin: 0; }
  @keyframes arrow-pulse { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(10px); } }

  .content-section { padding: 100px 20px; min-height: 150vh; background: #000; color: #fff; }
  .container { max-width: 900px; margin: 0 auto; padding-top: 100px; }
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
    .dialogue-box { width: 90vw; height: 140px; align-items: flex-start; }
    .sticky-content { width: 95%; gap: 10px; }
    .header-text { font-size: 28px; margin-bottom: 20px; }

    .sticky-header {
      top: auto;
      bottom: 0;
      border-bottom: none;
      border-top: 2px solid #fff;
      transform: translateY(110%);
      height: 100px;
    }
    .sticky-header.visible { transform: translateY(0); }
    .mini-sans-group { transform: scale(0.4); margin-right: -60px; }
    .mini-dialogue { width: 70%; height: 60px; }
    .mini-dialogue p { font-size: 8px; }
  }
</style>
