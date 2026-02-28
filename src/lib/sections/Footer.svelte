<script>
  let flakes = Array.from({ length: 12 }, (_, i) => ({
    x: (i / 11) * 100,
    size: i % 2 === 0 ? 4 : 2,
  }));
</script>

<footer class="footer" aria-label="Footer">
  <!-- Bone divider -->
  <div class="bone-divider" aria-hidden="true">
    {#each Array(20) as _}
      <span class="bone-seg">—</span>
    {/each}
  </div>

  <!-- Snow tiles at top -->
  <div class="snow-strip" aria-hidden="true"></div>

  <div class="footer-content">
    <div class="footer-text">* SANS.EXE © 200X</div>
    <div class="footer-text">* all rights reserved. not really.</div>
    <div class="footer-text">* made somewhere in snowdin. or maybe the dark world.</div>
  </div>

  <!-- Pixel snowflakes -->
  {#each flakes as flake}
    <div
      class="footer-flake"
      style="left: {flake.x}%; width: {flake.size}px; height: {flake.size}px;"
      aria-hidden="true"
    ></div>
  {/each}

  <!-- Dark World purple bleed -->
  <div class="dark-bleed" aria-hidden="true"></div>
</footer>

<style>
  .footer {
    background: #0d0d1a;
    position: relative;
    padding-bottom: 0;
    border-top: 4px solid #333;
    overflow: hidden;
  }

  .bone-divider {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    overflow: hidden;
    padding: 12px 0 8px;
    gap: 2px;
  }

  .bone-seg {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffffff;
  }

  .snow-strip {
    width: 100%;
    height: 16px;
    background: repeating-linear-gradient(
      to right,
      #ddeeff 0px,
      #ddeeff 31px,
      #b8cce0 31px,
      #b8cce0 32px
    );
    border-top: 4px solid #ffffff;
    border-bottom: 4px solid #ffffff;
    margin-bottom: 40px;
  }

  .footer-content {
    text-align: center;
    padding: 24px 16px 80px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    z-index: 2;
  }

  .footer-text {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffffff;
    line-height: 2;
  }

  .footer-flake {
    position: absolute;
    top: 48px;
    background: #ffffff;
    image-rendering: pixelated;
    opacity: 0.6;
  }

  /* Dark World purple bleed from bottom */
  .dark-bleed {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(to top, rgba(60, 0, 100, 0.6) 0%, transparent 100%);
    pointer-events: none;
  }
</style>
