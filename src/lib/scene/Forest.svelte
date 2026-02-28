<script>
  // Tree configs: [x%, scale, delay, row]
  const backTrees = [
    { x: 3, scale: 0.6, delay: 0 },
    { x: 12, scale: 0.7, delay: 0.5 },
    { x: 22, scale: 0.55, delay: 1.1 },
    { x: 33, scale: 0.65, delay: 0.3 },
    { x: 44, scale: 0.6, delay: 0.8 },
    { x: 55, scale: 0.7, delay: 0.2 },
    { x: 65, scale: 0.6, delay: 1.3 },
    { x: 75, scale: 0.65, delay: 0.6 },
    { x: 85, scale: 0.55, delay: 1.0 },
    { x: 93, scale: 0.7, delay: 0.4 },
  ];

  const midTrees = [
    { x: 0, scale: 0.85, delay: 0.7 },
    { x: 8, scale: 0.9, delay: 0.2 },
    { x: 18, scale: 0.8, delay: 1.2 },
    { x: 28, scale: 0.88, delay: 0.5 },
    { x: 72, scale: 0.85, delay: 0.9 },
    { x: 80, scale: 0.9, delay: 0.3 },
    { x: 89, scale: 0.82, delay: 1.4 },
    { x: 96, scale: 0.87, delay: 0.6 },
  ];

  const frontTrees = [
    { x: -2, scale: 1.1, delay: 0.4 },
    { x: 6, scale: 1.2, delay: 0.9 },
    { x: 88, scale: 1.1, delay: 0.1 },
    { x: 95, scale: 1.2, delay: 0.7 },
  ];

  // The special back tree with Dark Fountain glow (index 5 of backTrees)
  const glowTreeIndex = 5;
</script>

<div class="forest" aria-hidden="true">
  <!-- Back row -->
  <div class="tree-row back-row">
    {#each backTrees as tree, i}
      <div class="tree-wrap" style="left: {tree.x}%; animation-delay: {tree.delay}s;">
        {#if i === glowTreeIndex}
          <div class="dark-fountain"></div>
        {/if}
        <div class="tree" style="transform: scale({tree.scale}); transform-origin: bottom center;">
          <div class="tree-top"></div>
          <div class="tree-mid"></div>
          <div class="tree-trunk"></div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Mid row -->
  <div class="tree-row mid-row">
    {#each midTrees as tree}
      <div class="tree-wrap" style="left: {tree.x}%; animation-delay: {tree.delay}s;">
        <div class="tree" style="transform: scale({tree.scale}); transform-origin: bottom center;">
          <div class="tree-top"></div>
          <div class="tree-mid"></div>
          <div class="tree-trunk"></div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Front row (sides only) -->
  <div class="tree-row front-row">
    {#each frontTrees as tree}
      <div class="tree-wrap" style="left: {tree.x}%; animation-delay: {tree.delay}s;">
        <div class="tree" style="transform: scale({tree.scale}); transform-origin: bottom center;">
          <div class="tree-top"></div>
          <div class="tree-mid"></div>
          <div class="tree-trunk"></div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .forest {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .tree-row {
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  .back-row { bottom: 42%; }
  .mid-row  { bottom: 30%; }
  .front-row{ bottom: 24%; }

  .tree-wrap {
    position: absolute;
    bottom: 0;
    animation: sway 6s ease-in-out infinite;
    transform-origin: bottom center;
  }

  @keyframes sway {
    0%, 100% { transform: rotate(0deg); }
    25%       { transform: rotate(1deg); }
    75%       { transform: rotate(-1deg); }
  }

  .tree {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tree-top {
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 32px solid #0a0a18;
  }

  .tree-mid {
    width: 0;
    height: 0;
    border-left: 28px solid transparent;
    border-right: 28px solid transparent;
    border-bottom: 36px solid #0a0a18;
    margin-top: -12px;
  }

  .tree-trunk {
    width: 10px;
    height: 18px;
    background: #0a0a18;
  }

  /* Dark Fountain glow */
  .dark-fountain {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 90px;
    background: radial-gradient(ellipse at center bottom, #3a0060 0%, #1a0030 40%, transparent 70%);
    animation: fountain-pulse 3s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes fountain-pulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }
</style>
