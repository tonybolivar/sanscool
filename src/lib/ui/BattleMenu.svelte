<script>
  import { hp, menuSelection, showItemPopup, mercyActive, fightCount, dialogueIndex, dialogueLines } from '../stores/game.js';
  import { onMount, onDestroy } from 'svelte';

  let fightBones = [];
  let boneId = 0;
  let mercyHearts = [];
  let heartId = 0;
  let flashScreen = false;
  let itemVisible = false;
  let itemTimer = null;

  showItemPopup.subscribe(v => { itemVisible = v; });

  const menuItems = ['❤ FIGHT', 'ACT', 'ITEM', 'MERCY'];

  function selectMenu(i) {
    menuSelection.set(i);
  }

  function handleFight() {
    selectMenu(0);
    const count = $fightCount + 1;
    fightCount.set(count);

    if (count >= 3) {
      const lines = [...$dialogueLines];
      lines[0] = '* you really wanna do this, huh.';
      dialogueLines.set(lines);
      dialogueIndex.set(0);
      flashScreen = true;
      setTimeout(() => { flashScreen = false; }, 200);
    }

    // Spawn bone rain
    for (let i = 0; i < 5; i++) {
      const id = boneId++;
      const y = 10 + Math.random() * 80;
      const delay = i * 120;
      fightBones = [...fightBones, { id, y, delay }];
      setTimeout(() => {
        fightBones = fightBones.filter(b => b.id !== id);
      }, delay + 1000);
    }

    // Deplete HP
    hp.update(v => Math.max(0, v - 5));
  }

  function handleAct() {
    selectMenu(1);
    const orig = $dialogueLines[0];
    dialogueLines.update(l => { const a = [...l]; a[0] = '* (you try to smalltalk. sans is already asleep.)'; return a; });
    dialogueIndex.set(0);
    setTimeout(() => {
      dialogueLines.update(l => { const a = [...l]; a[0] = orig; return a; });
    }, 5000);
  }

  function handleItem() {
    selectMenu(2);
    showItemPopup.set(true);
    clearTimeout(itemTimer);
    itemTimer = setTimeout(() => showItemPopup.set(false), 3000);
  }

  function handleMercy() {
    selectMenu(3);
    mercyActive.set(true);
    hp.update(v => Math.min(100, v + 20));

    // Spawn heart confetti
    for (let i = 0; i < 20; i++) {
      const id = heartId++;
      const x = Math.random() * 100;
      const delay = Math.random() * 500;
      mercyHearts = [...mercyHearts, { id, x, delay }];
      setTimeout(() => {
        mercyHearts = mercyHearts.filter(h => h.id !== id);
      }, delay + 1500);
    }

    dialogueIndex.set(0);
  }

  onDestroy(() => clearTimeout(itemTimer));

  $: hpFilled = Math.round(($hp / 100) * 20);
  $: hpBar = '█'.repeat(hpFilled) + '░'.repeat(20 - hpFilled);
</script>

<!-- Screen flash on FIGHT x3 -->
{#if flashScreen}
  <div class="screen-flash" aria-hidden="true"></div>
{/if}

<!-- Bone rain -->
{#each fightBones as bone (bone.id)}
  <div class="bone-rain" style="top: {bone.y}%; animation-delay: {bone.delay}ms;" aria-hidden="true"></div>
{/each}

<!-- Mercy hearts -->
{#each mercyHearts as heart (heart.id)}
  <div class="mercy-heart" style="left: {heart.x}%; animation-delay: {heart.delay}ms;" aria-hidden="true">❤</div>
{/each}

<!-- Item popup -->
{#if itemVisible}
  <div class="item-popup" role="dialog" aria-label="Item info">
    <div class="item-title">KETCHUP</div>
    <div class="item-desc">* restores 0 HP.</div>
    <div class="item-desc">* tastes great though.</div>
  </div>
{/if}

<div class="battle-menu" aria-label="Battle menu">
  <!-- HP bar -->
  <div class="hp-row">
    <span class="label">HP</span>
    <span class="hp-bar">{hpBar}</span>
    <span class="hp-nums">{$hp} / 100</span>
    <span class="lv-label">LV 1</span>
  </div>

  <!-- Buttons -->
  <div class="buttons">
    {#each menuItems as item, i}
      <button
        class="menu-btn"
        class:selected={$menuSelection === i}
        on:click={() => {
          if (i === 0) handleFight();
          else if (i === 1) handleAct();
          else if (i === 2) handleItem();
          else handleMercy();
        }}
        aria-label={item}
      >
        {#if $menuSelection === i}<span class="soul">❤</span>{/if}
        {item}
      </button>
    {/each}
  </div>
</div>

<style>
  .battle-menu {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: min(700px, 96vw);
    background: #000000;
    border: 4px solid #ffffff;
    border-bottom: none;
    padding: 8px 16px;
    z-index: 50;
    image-rendering: pixelated;
  }

  .hp-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffffff;
    flex-wrap: wrap;
  }

  .label {
    color: #ffff00;
    min-width: 24px;
  }

  .hp-bar {
    color: #ffff00;
    letter-spacing: 0;
    font-size: 7px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 160px;
  }

  .hp-nums {
    color: #ffffff;
    white-space: nowrap;
  }

  .lv-label {
    color: #ffffff;
    margin-left: auto;
  }

  .buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .menu-btn {
    flex: 1;
    min-width: 100px;
    padding: 8px 4px;
    background: #000000;
    border: 4px solid #ffffff;
    color: #ffffff;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: background 0.1s;
    image-rendering: pixelated;
  }

  .menu-btn:hover,
  .menu-btn.selected {
    background: #1a1a2e;
    border-color: #4fc3f7;
    box-shadow: 0 0 8px 0 #4fc3f7;
  }

  .soul {
    color: #ff2222;
    font-size: 10px;
  }

  /* Bone rain */
  .bone-rain {
    position: fixed;
    left: -80px;
    width: 56px;
    height: 10px;
    background: #ffffff;
    border: 2px solid #cccccc;
    animation: fly-bone 0.9s linear forwards;
    z-index: 90;
    pointer-events: none;
  }

  @keyframes fly-bone {
    from { left: -80px; }
    to   { left: 110vw; }
  }

  /* Mercy hearts */
  .mercy-heart {
    position: fixed;
    bottom: 120px;
    color: #ff2222;
    font-size: 16px;
    animation: heart-float 1.5s ease-out forwards;
    pointer-events: none;
    z-index: 90;
  }

  @keyframes heart-float {
    0%   { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
  }

  /* Screen flash */
  .screen-flash {
    position: fixed;
    inset: 0;
    background: #ffffff;
    z-index: 200;
    pointer-events: none;
    animation: flash 0.2s ease-out forwards;
  }

  @keyframes flash {
    0%   { opacity: 0.8; }
    100% { opacity: 0; }
  }

  /* Item popup */
  .item-popup {
    position: fixed;
    bottom: 180px;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid #ffffff;
    background: #000000;
    padding: 12px 16px;
    z-index: 80;
    text-align: center;
  }

  .item-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffff00;
    margin-bottom: 8px;
  }

  .item-desc {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: #ffffff;
    margin: 4px 0;
  }
</style>
