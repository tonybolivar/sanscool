<script>
  import { onMount } from 'svelte';

  const testimonials = [
    {
      name: 'PAPYRUS',
      color: '#ff8800',
      lines: [
        '* NYEH HEH HEH!! MY BROTHER\'S SOFTWARE IS...',
        '* ...ACCEPTABLE. I SUPPOSE.',
        '* I STILL PREFER MY OWN SPAGHETTI-BASED SOLUTIONS.',
      ],
      portrait: 'papyrus',
    },
    {
      name: 'TORIEL',
      color: '#cc88cc',
      lines: [
        '* He slept through the entire onboarding call.',
        '* I made him butterscotch pie anyway.',
        '* Three stars.',
      ],
      portrait: 'toriel',
    },
    {
      name: 'FLOWEY',
      color: '#ffff00',
      lines: [
        '* In this world, it\'s click or be clicked.',
        '* I give it 1/5. not because it\'s bad.',
        '* I just like watching you suffer. Hee hee hee!',
      ],
      portrait: 'flowey',
    },
    {
      name: 'SUSIE',
      color: '#cc44cc',
      lines: [
        '* yeah i use it.',
        '* it rocks or whatever.',
        '* don\'t make it weird.',
      ],
      portrait: 'susie',
    },
    {
      name: 'NOELLE',
      color: '#44ccaa',
      lines: [
        '* O-oh! I wasn\'t expecting to give a testimonial...',
        '* It\'s really good! The ketchup SLA especially!',
        '* (she has been using it every day for six months)',
      ],
      portrait: 'noelle',
    },
  ];

  let current = 0;
  let displayLines = [];
  let typeTimer;

  async function showTestimonial(i) {
    clearTimeout(typeTimer);
    displayLines = [];
    const t = testimonials[i];
    for (const line of t.lines) {
      let buf = '';
      for (const ch of line) {
        buf += ch;
        displayLines = [...displayLines.slice(0, displayLines.length - 1), buf];
        await new Promise(r => { typeTimer = setTimeout(r, 30); });
      }
      displayLines = [...displayLines, ''];
    }
  }

  function prev() {
    current = (current - 1 + testimonials.length) % testimonials.length;
    showTestimonial(current);
  }

  function next() {
    current = (current + 1) % testimonials.length;
    showTestimonial(current);
  }

  onMount(() => {
    showTestimonial(0);
  });

  $: t = testimonials[current];
</script>

<section class="testimonials" aria-label="Testimonials">
  <h2 class="section-title">* what they're saying</h2>

  <div class="test-box">
    <!-- Portrait -->
    <div class="portrait" style="border-color: {t.color};" aria-hidden="true">
      <div class="portrait-inner portrait-{t.portrait}">
        <div class="p-name" style="color: {t.color};">{t.name}</div>
      </div>
    </div>

    <!-- Dialogue -->
    <div class="dialogue-area">
      {#each displayLines as line}
        {#if line}
          <div class="test-line">{line}</div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Navigation -->
  <div class="nav">
    <button class="nav-btn" on:click={prev} aria-label="Previous testimonial">◀</button>
    <span class="nav-indicator">
      {#each testimonials as _, i}
        <span class="dot" class:active={i === current}>■</span>
      {/each}
    </span>
    <button class="nav-btn" on:click={next} aria-label="Next testimonial">▶</button>
  </div>
</section>

<style>
  .testimonials {
    background: #0d0d1a;
    padding: 64px 24px 80px;
    border-top: 4px solid #333;
  }

  .section-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    margin-bottom: 48px;
  }

  .test-box {
    max-width: 680px;
    margin: 0 auto 32px;
    border: 4px solid #ffffff;
    background: #000000;
    display: flex;
    min-height: 120px;
  }

  .portrait {
    width: 100px;
    min-width: 100px;
    border-right: 4px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111122;
    flex-shrink: 0;
  }

  .portrait-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 8px;
  }

  .p-name {
    font-family: 'Press Start 2P', monospace;
    font-size: 6px;
    text-align: center;
    line-height: 1.4;
  }

  /* Pixel portrait icons via CSS */
  .portrait-papyrus::before {
    content: '💀';
    font-size: 32px;
  }
  .portrait-toriel::before {
    content: '🐐';
    font-size: 32px;
  }
  .portrait-flowey::before {
    content: '🌻';
    font-size: 32px;
  }
  .portrait-susie::before {
    content: '🦖';
    font-size: 32px;
  }
  .portrait-noelle::before {
    content: '🦌';
    font-size: 32px;
  }

  .dialogue-area {
    flex: 1;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .test-line {
    font-family: 'Press Start 2P', monospace;
    font-size: 7px;
    color: #ffffff;
    line-height: 1.8;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    max-width: 680px;
    margin: 0 auto;
  }

  .nav-btn {
    background: #000000;
    border: 4px solid #ffffff;
    color: #ffffff;
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    padding: 8px 16px;
    cursor: pointer;
  }

  .nav-btn:hover {
    background: #1a1a2e;
    border-color: #4fc3f7;
    box-shadow: 0 0 8px #4fc3f7;
  }

  .nav-indicator {
    display: flex;
    gap: 8px;
  }

  .dot {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #444;
  }

  .dot.active {
    color: #ffffff;
  }
</style>
