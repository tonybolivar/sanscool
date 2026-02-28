<script>
  import { onMount } from 'svelte';

  let glitchText = '[[BIG SHOT]]';
  let glitchTimer;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*[]{}';

  function glitch(original) {
    let result = '';
    for (const ch of original) {
      result += Math.random() < 0.15 ? chars[Math.floor(Math.random() * chars.length)] : ch;
    }
    return result;
  }

  onMount(() => {
    glitchTimer = setInterval(() => {
      glitchText = glitch('[[BIG SHOT]]');
      setTimeout(() => { glitchText = '[[BIG SHOT]]'; }, 80);
    }, 800);

    return () => clearInterval(glitchTimer);
  });

  const tiers = [
    {
      name: 'Lazy',
      price: 'Free',
      priceNote: '',
      desc: "* you get what you pay for.",
      desc2: "* which is nothing.",
      bigshot: false,
    },
    {
      name: 'Funky',
      price: '$6.66',
      priceNote: '/mo',
      desc: "* sans tax included.",
      desc2: "* heh.",
      bigshot: false,
    },
    {
      name: null, // uses glitchText
      price: 'Contact Us',
      priceNote: '',
      desc: '* YOU COULD BE A REAL',
      desc2: '* [[BIG SHOT]]!!',
      bigshot: true,
    },
  ];
</script>

<section class="pricing" aria-label="Pricing">
  <h2 class="section-title">* choose your fate</h2>
  <div class="tiers">
    {#each tiers as tier, i}
      <div
        class="tier-card"
        class:bigshot={tier.bigshot}
        aria-label={tier.bigshot ? 'Big Shot tier' : tier.name + ' tier'}
      >
        <div class="tier-name">
          {#if tier.bigshot}
            <span class="bigshot-name">{glitchText}</span>
          {:else}
            {tier.name}
          {/if}
        </div>
        <div class="tier-price">
          <span class="price-main">{tier.price}</span>
          {#if tier.priceNote}
            <span class="price-note">{tier.priceNote}</span>
          {/if}
        </div>
        <div class="tier-desc">{tier.desc}</div>
        <div class="tier-desc">{tier.desc2}</div>
        <button class="tier-btn" aria-label="Select {tier.bigshot ? 'Big Shot' : tier.name} tier">
          {tier.bigshot ? '* CONTACT' : '* GET STARTED'}
        </button>
      </div>
    {/each}
  </div>
</section>

<style>
  .pricing {
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

  .tiers {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 900px;
    margin: 0 auto;
  }

  .tier-card {
    border: 4px solid #ffffff;
    background: #000000;
    padding: 28px 20px;
    width: 240px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .tier-card:hover {
    box-shadow: 0 0 12px 2px #4fc3f7;
    border-color: #4fc3f7;
  }

  /* BIG SHOT card */
  .tier-card.bigshot {
    border-color: #ff2222;
    box-shadow: 0 0 16px 4px rgba(255, 34, 34, 0.5);
  }

  .tier-card.bigshot:hover {
    animation: bigshot-shake 0.15s ease-in-out infinite;
    border-color: #ff2222;
    box-shadow: 0 0 24px 8px rgba(255, 34, 34, 0.8);
  }

  @keyframes bigshot-shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-3px) rotate(-0.5deg); }
    75%       { transform: translateX(3px) rotate(0.5deg); }
  }

  .tier-name {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #4fc3f7;
    margin-bottom: 4px;
  }

  .bigshot-name {
    color: #ff2222;
    text-shadow: 0 0 8px rgba(255, 34, 34, 0.8);
    display: inline-block;
  }

  .tier-price {
    margin: 8px 0;
  }

  .price-main {
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: #ffffff;
  }

  .price-note {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #888;
    margin-left: 4px;
  }

  .tier-desc {
    font-family: 'Press Start 2P', monospace;
    font-size: 7px;
    color: #cccccc;
    line-height: 1.8;
  }

  .tier-btn {
    margin-top: auto;
    padding: 8px 4px;
    border: 4px solid #ffffff;
    background: #000000;
    color: #ffffff;
    font-family: 'Press Start 2P', monospace;
    font-size: 7px;
    cursor: pointer;
    width: 100%;
    transition: background 0.1s;
  }

  .tier-btn:hover {
    background: #1a1a2e;
  }

  .bigshot .tier-btn {
    border-color: #ff2222;
    color: #ff2222;
  }
</style>
