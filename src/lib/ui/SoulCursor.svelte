<script>
  import { onMount, onDestroy } from 'svelte';

  let x = -100;
  let y = -100;

  function move(e) {
    x = e.clientX - 8;
    y = e.clientY - 8;
  }

  onMount(() => {
    window.addEventListener('mousemove', move);
  });

  onDestroy(() => {
    window.removeEventListener('mousemove', move);
  });
</script>

<div
  class="soul-cursor"
  style="left: {x}px; top: {y}px;"
  aria-hidden="true"
>❤</div>

<style>
  .soul-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    font-size: 16px;
    color: #ff2222;
    user-select: none;
    text-shadow: 0 0 6px rgba(255, 34, 34, 0.8);
    transform: translate(-50%, -50%);
    image-rendering: pixelated;
  }
</style>
