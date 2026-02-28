<script>
  import { onMount } from 'svelte';

  let stars = [];

  onMount(() => {
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 70,
        size: Math.random() < 0.3 ? 4 : 2,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      });
    }
    stars = stars;
  });
</script>

<div class="sky" aria-hidden="true">
  {#each stars as star}
    <div
      class="star"
      style="
        left: {star.x}%;
        top: {star.y}%;
        width: {star.size}px;
        height: {star.size}px;
        animation-delay: {star.delay}s;
        animation-duration: {star.duration}s;
      "
    ></div>
  {/each}
  <div class="scanlines"></div>
</div>

<style>
  .sky {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, #0d0d1a 0%, #1a1a2e 100%);
    overflow: hidden;
  }

  .star {
    position: absolute;
    background: #ffffff;
    image-rendering: pixelated;
    animation: twinkle 3s ease-in-out infinite;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 0.15; }
  }

  .scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(0, 0, 0, 0.12) 3px,
      rgba(0, 0, 0, 0.12) 4px
    );
    pointer-events: none;
  }
</style>
