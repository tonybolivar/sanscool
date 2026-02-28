<script>
  import { onMount } from 'svelte';
  import Sky from './Sky.svelte';
  import Forest from './Forest.svelte';
  import SnowGround from './SnowGround.svelte';
  import Shop from './Shop.svelte';
  import Sans from './Sans.svelte';

  let snowflakes = [];

  onMount(() => {
    for (let i = 0; i < 50; i++) {
      snowflakes.push({
        x: Math.random() * 100,
        size: Math.random() < 0.5 ? 2 : 4,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 8,
        drift: (Math.random() - 0.5) * 30,
        opacity: 0.4 + Math.random() * 0.5,
      });
    }
    snowflakes = snowflakes;
  });
</script>

<section class="scene" aria-label="Snowdin scene">
  <!-- z1: sky -->
  <Sky />

  <!-- z2: forest -->
  <div class="layer forest-layer">
    <Forest />
  </div>

  <!-- z3: shop (behind sans) -->
  <div class="layer shop-layer">
    <Shop />
  </div>

  <!-- z4: ground -->
  <div class="layer ground-layer">
    <SnowGround />
  </div>

  <!-- z5: sans -->
  <div class="layer sans-layer">
    <Sans />
  </div>

  <!-- z6: snow particles -->
  <div class="layer snow-layer" aria-hidden="true">
    {#each snowflakes as flake}
      <div
        class="flake"
        style="
          left: {flake.x}%;
          width: {flake.size}px;
          height: {flake.size}px;
          animation-duration: {flake.duration}s;
          animation-delay: -{flake.delay}s;
          --drift: {flake.drift}px;
          opacity: {flake.opacity};
        "
      ></div>
    {/each}
  </div>
</section>

<style>
  .scene {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .shop-layer  { z-index: 3; pointer-events: auto; }
  .sans-layer  { z-index: 5; pointer-events: auto; }
  .snow-layer  { z-index: 6; }

  .flake {
    position: absolute;
    top: -8px;
    background: #ffffff;
    image-rendering: pixelated;
    animation: snow-fall linear infinite;
  }

  @keyframes snow-fall {
    0%   { transform: translateY(-10px) translateX(0); opacity: inherit; }
    90%  { opacity: inherit; }
    100% { transform: translateY(100vh) translateX(var(--drift)); opacity: 0; }
  }
</style>
