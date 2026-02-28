<script>
  import { onMount } from 'svelte';

  let visible = [false, false, false];

  const cards = [
    {
      icon: '🦴',
      title: 'Bone Infrastructure',
      lines: [
        '* industry-leading bone-based architecture.',
        '* scalable. reliable. pointy.',
      ],
      sub: "99.9% uptime. the 0.1% is when i'm napping.",
    },
    {
      icon: '⚡',
      title: 'Shortcut Engine™',
      lines: [
        '* why work hard when you can work... less.',
        '* our patented laziness pipeline cuts deployment time by 100%.',
      ],
      sub: "we just don't deploy. problem solved.",
    },
    {
      icon: '🔮',
      title: 'Ralsei Support Package',
      lines: [
        '* comes with 24/7 emotional support from a small goat wizard.',
        '* he will heal your servers. and your heart.',
      ],
      sub: "Lancer not included. thank god.",
    },
  ];

  onMount(() => {
    const observers = cards.map((_, i) => {
      const el = document.querySelector(`.feature-card:nth-child(${i + 1})`);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible[i] = true;
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(o => o?.disconnect());
  });
</script>

<section class="features" aria-label="Features">
  <h2 class="section-title">* what we offer</h2>
  <div class="cards">
    {#each cards as card, i}
      <div class="feature-card" class:visible={visible[i]} style="transition-delay: {i * 120}ms;">
        <div class="card-icon">{card.icon}</div>
        <div class="card-title">{card.title}</div>
        {#each card.lines as line}
          <div class="card-line">{line}</div>
        {/each}
        <div class="card-sub">{card.sub}</div>
      </div>
    {/each}
  </div>
</section>

<style>
  .features {
    background: #0d0d1a;
    padding: 64px 24px 80px;
  }

  .section-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    margin-bottom: 48px;
    letter-spacing: 2px;
  }

  .cards {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: 0 auto;
  }

  .feature-card {
    border: 4px solid #ffffff;
    background: #000000;
    padding: 24px 20px;
    width: 280px;
    flex-shrink: 0;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s;
  }

  .feature-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .feature-card:hover {
    box-shadow: 0 0 12px 2px #4fc3f7;
    border-color: #4fc3f7;
  }

  .card-icon {
    font-size: 24px;
    margin-bottom: 12px;
    display: block;
  }

  .card-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #4fc3f7;
    margin-bottom: 16px;
    line-height: 1.6;
  }

  .card-line {
    font-family: 'Press Start 2P', monospace;
    font-size: 7px;
    color: #ffffff;
    margin-bottom: 8px;
    line-height: 1.8;
  }

  .card-sub {
    font-family: 'Press Start 2P', monospace;
    font-size: 6px;
    color: #888888;
    margin-top: 16px;
    line-height: 1.8;
    border-top: 2px solid #333;
    padding-top: 12px;
  }
</style>
