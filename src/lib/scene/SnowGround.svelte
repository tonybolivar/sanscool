<script>
  // Snow tile grid
  const tileCount = 40;
</script>

<div class="ground-wrap" aria-hidden="true">
  <div class="ground">
    {#each Array(tileCount) as _, i}
      <div class="snow-tile"></div>
    {/each}
  </div>
  <div class="ground-shadow"></div>
</div>

<style>
  .ground-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 28%;
  }

  .ground {
    position: absolute;
    inset: 0;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    background: #ddeeff;
  }

  .snow-tile {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    box-shadow:
      inset -2px -2px 0 0 #b8cce0,
      inset 2px 2px 0 0 #eef4ff;
    background: #ddeeff;
    image-rendering: pixelated;
  }

  .ground-shadow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
  }
</style>
