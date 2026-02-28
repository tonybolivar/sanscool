<script>
  export let scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<nav class="navbar">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="nav-logo" on:click={scrollToTop}>sans.cool</div>
</nav>

<main class="layout-main">
  <slot />
</main>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    z-index: 2000;
    pointer-events: none;
  }

  .nav-logo {
    pointer-events: auto;
    font-family: 'Press Start 2P', cursive;
    font-size: 16px;
    color: #4fc3f7;
    cursor: pointer;
    text-shadow: 2px 2px #000;
    transition: color 0.2s;
    display: inline-block;
  }

  .nav-logo:hover {
    color: #fff;
  }

  .layout-main {
    width: 100%;
    background-color: #000;
  }
</style>
