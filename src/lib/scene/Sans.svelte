<script>
  import { onMount, onDestroy } from 'svelte';
  import { sleeping } from '../stores/game.js';

  let bones = [];
  let boneId = 0;
  let isBlinking = false;
  let isWinking = false;
  let leftEyeClosed = false;
  let rightEyeClosed = false;
  let lookDir = 0; // -2, 0, 2 px
  let jevilFlicker = false;
  let zzz = false;
  let blinkTimer, lookTimer, jevilTimer, sleepTimer;
  let isSleeping = false;

  sleeping.subscribe(v => { isSleeping = v; });

  function scheduleBlink() {
    const delay = 3000 + Math.random() * 3000;
    blinkTimer = setTimeout(async () => {
      isBlinking = true;
      leftEyeClosed = true;
      rightEyeClosed = true;
      await new Promise(r => setTimeout(r, 120));
      leftEyeClosed = false;
      rightEyeClosed = false;
      isBlinking = false;
      scheduleBlink();
    }, delay);
  }

  function scheduleLook() {
    const delay = 4000 + Math.random() * 5000;
    lookTimer = setTimeout(() => {
      const dirs = [-2, 0, 2];
      lookDir = dirs[Math.floor(Math.random() * dirs.length)];
      setTimeout(() => { lookDir = 0; scheduleLook(); }, 1500);
    }, delay);
  }

  function scheduleJevil() {
    const delay = 12000 + Math.random() * 8000;
    jevilTimer = setTimeout(() => {
      jevilFlicker = true;
      setTimeout(() => {
        jevilFlicker = false;
        scheduleJevil();
      }, 120);
    }, delay);
  }

  function scheduleSleep() {
    sleepTimer = setTimeout(() => {
      sleeping.set(true);
      isSleeping = true;
      zzz = true;
    }, 30000);
  }

  function resetSleepTimer() {
    if (isSleeping) {
      sleeping.set(false);
      isSleeping = false;
      zzz = false;
    }
    clearTimeout(sleepTimer);
    scheduleSleep();
  }

  export function spawnBone() {
    const id = boneId++;
    const y = 20 + Math.random() * 40;
    bones = [...bones, { id, y }];
    setTimeout(() => {
      bones = bones.filter(b => b.id !== id);
    }, 1000);
    resetSleepTimer();
  }

  function handleClick() {
    spawnBone();
    // wink on click
    isWinking = true;
    leftEyeClosed = true;
    setTimeout(() => {
      leftEyeClosed = false;
      isWinking = false;
    }, 300);
  }

  onMount(() => {
    scheduleBlink();
    scheduleLook();
    scheduleJevil();
    scheduleSleep();

    document.addEventListener('keydown', resetSleepTimer);
    document.addEventListener('mousemove', resetSleepTimer);
  });

  onDestroy(() => {
    clearTimeout(blinkTimer);
    clearTimeout(lookTimer);
    clearTimeout(jevilTimer);
    clearTimeout(sleepTimer);
    document.removeEventListener('keydown', resetSleepTimer);
    document.removeEventListener('mousemove', resetSleepTimer);
  });
</script>

<!-- Bone projectiles -->
{#each bones as bone (bone.id)}
  <div class="bone" style="top: {bone.y}%;" aria-hidden="true"></div>
{/each}

<!-- ZZZ float -->
{#if zzz}
  <div class="zzz" aria-hidden="true">z z z</div>
{/if}

<!-- Sans sprite -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="sans-wrap"
  class:jevil={jevilFlicker}
  class:sleeping-anim={isSleeping}
  on:click={handleClick}
  aria-label="Sans — click to interact"
  role="button"
  tabindex="0"
  on:keydown={e => e.key === 'Enter' && handleClick()}
>
  <!-- HEAD -->
  <div class="head">
    <!-- Eyes -->
    <div class="eyes">
      <div class="eye left-eye" class:closed={leftEyeClosed || isSleeping}>
        <div class="pupil" style="transform: translateX({lookDir}px)"></div>
        <div class="eye-glow"></div>
      </div>
      <div class="eye right-eye" class:closed={rightEyeClosed || isSleeping}>
        <div class="pupil" style="transform: translateX({lookDir}px)"></div>
      </div>
    </div>
    <!-- Smile -->
    <div class="smile">
      <div class="smile-dot"></div>
      <div class="smile-dot"></div>
      <div class="smile-dot"></div>
      <div class="smile-dot up"></div>
      <div class="smile-dot up"></div>
      <div class="smile-dot"></div>
      <div class="smile-dot"></div>
      <div class="smile-dot"></div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">
    <div class="jacket-left"></div>
    <div class="shirt-strip"></div>
    <div class="jacket-right"></div>
  </div>

  <!-- ARMS -->
  <div class="arms">
    <div class="arm left-arm"></div>
    <div class="arm right-arm"></div>
  </div>

  <!-- LEGS + SLIPPERS -->
  <div class="legs">
    <div class="leg">
      <div class="slipper"></div>
    </div>
    <div class="leg">
      <div class="slipper"></div>
    </div>
  </div>
</div>

<style>
  .sans-wrap {
    position: absolute;
    bottom: 28%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    image-rendering: pixelated;
    animation: idle-bob 2s ease-in-out infinite;
    user-select: none;
    z-index: 10;
  }

  .sans-wrap.sleeping-anim {
    animation: idle-bob 4s ease-in-out infinite;
  }

  /* JEVIL easter egg — black body, red pupils */
  .sans-wrap.jevil .jacket-left,
  .sans-wrap.jevil .jacket-right {
    background: #000000 !important;
  }
  .sans-wrap.jevil .head {
    background: #111111 !important;
  }
  .sans-wrap.jevil .pupil {
    background: #ff0000 !important;
  }

  @keyframes idle-bob {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50%       { transform: translateX(-50%) translateY(-6px); }
  }

  /* HEAD */
  .head {
    width: 56px;
    height: 52px;
    background: #e8e8e8;
    border: 4px solid #ffffff;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: breathe 3s ease-in-out infinite;
  }

  @keyframes breathe {
    0%, 100% { transform: scaleX(1); }
    50%       { transform: scaleX(1.02); }
  }

  /* EYES */
  .eyes {
    display: flex;
    gap: 10px;
    margin-bottom: 6px;
    margin-top: -4px;
  }

  .eye {
    width: 16px;
    height: 14px;
    background: #ffffff;
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    transition: transform 0.1s;
  }

  .eye.closed {
    transform: scaleY(0.08);
  }

  .left-eye .eye-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(79, 195, 247, 0.6) 0%, transparent 70%);
    animation: eye-glow-pulse 2.5s ease-in-out infinite;
  }

  @keyframes eye-glow-pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }

  .pupil {
    width: 6px;
    height: 8px;
    background: #1a1a1a;
    transition: transform 0.3s ease;
  }

  /* SMILE */
  .smile {
    display: flex;
    gap: 2px;
    align-items: flex-start;
    height: 10px;
  }

  .smile-dot {
    width: 4px;
    height: 4px;
    background: #1a1a1a;
  }

  .smile-dot.up {
    margin-top: -4px;
  }

  /* BODY */
  .body {
    display: flex;
    width: 52px;
    height: 44px;
    border: 4px solid #ffffff;
    border-top: none;
    overflow: hidden;
  }

  .jacket-left {
    flex: 2;
    background: #3a3f5c;
  }

  .shirt-strip {
    flex: 1;
    background: #e8e8e8;
  }

  .jacket-right {
    flex: 2;
    background: #3a3f5c;
  }

  /* ARMS */
  .arms {
    position: absolute;
    top: 52px; /* below head */
    display: flex;
    gap: 60px;
  }

  .arm {
    width: 14px;
    height: 32px;
    background: #3a3f5c;
    border: 4px solid #ffffff;
  }

  /* LEGS */
  .legs {
    display: flex;
    gap: 8px;
    margin-top: -2px;
  }

  .leg {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 18px;
  }

  .leg::before {
    content: '';
    display: block;
    width: 14px;
    height: 24px;
    background: #2a2a3a;
    border: 4px solid #ffffff;
    border-top: none;
  }

  .slipper {
    width: 22px;
    height: 10px;
    background: #2a2a2a;
    border: 4px solid #ffffff;
    border-top: none;
    margin-top: -4px;
  }

  /* ZZZ */
  .zzz {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translateX(10px);
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: #4fc3f7;
    animation: float-up 2s ease-in-out infinite;
    pointer-events: none;
    z-index: 20;
  }

  @keyframes float-up {
    0%   { opacity: 0; transform: translateX(10px) translateY(0); }
    20%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; transform: translateX(10px) translateY(-40px); }
  }

  /* BONE projectile */
  .bone {
    position: fixed;
    left: -80px;
    width: 60px;
    height: 12px;
    background: #ffffff;
    border: 2px solid #cccccc;
    animation: fly-bone 1s linear forwards;
    z-index: 100;
    pointer-events: none;
  }

  .bone::before,
  .bone::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #ffffff;
    border: 2px solid #cccccc;
    top: -4px;
  }

  .bone::before { left: -6px; }
  .bone::after  { right: -6px; }

  @keyframes fly-bone {
    0%   { left: -80px; }
    100% { left: 110vw; }
  }
</style>
