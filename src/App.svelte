<script lang="ts">
  import Calculator from "./Calculator.svelte";
  import Hamburger from "./Hamburger.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Logo from "./logo.svg";

  let screenWidth = 0;
  $: mobile = screenWidth <= 768;
  let open = false;
  let headerHeight = 0;
</script>

<div
  class="container"
  class:open
  bind:clientWidth={screenWidth}
  style="--header-height: {headerHeight}px">
  <header bind:clientHeight={headerHeight}>
    <Logo width="130px" height="40px" fill="var(--logo-color)" />
    <div class="spacer" />
    {#if mobile}
      <Hamburger bind:open />
    {/if}
  </header>
  <nav>
    <Sidebar {mobile} bind:open />
  </nav>

  <aside />

  <main>
    <Calculator />
  </main>

  <footer>
    <p>Made by Brian Latchman & Julian de Rushe, 2021</p>
  </footer>
</div>

<style>
  .container {
    display: grid;

    grid-template-areas:
      "header content"
      "nav content"
      "footer footer";

    grid-template-columns: 220px 1fr;
    grid-template-rows: auto minmax(0, 1fr) auto;
    height: 100vh;
  }

  .spacer {
    flex: 1;
  }

  header {
    grid-area: header;
    background: var(--nav-background-color);
    padding: 20px 24px;
    padding-top: 25px;
    display: flex;
  }

  nav {
    grid-area: nav;
    background: var(--nav-background-color);
    color: var(--nav-font-color);
  }

  main {
    grid-area: content;
    overflow: visible;
  }

  footer {
    font-size: 14px;
    padding: 4px;
    color: var(--footer-color);
    background-color: var(--footer-back);
    grid-area: footer;
    text-align: center;
  }

  @media (max-width: 768px) {
    .container {
      grid-template-areas:
        "header"
        "nav"
        "content"
        "footer";

      grid-template-columns: 1fr;
      grid-template-rows:
        var(--header-height) /* Header */
        0
        1fr /* Content */
        auto; /* Footer */
      height: 100vh;
      width: 100vw;
    }

    header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 8px 16px;
    }

    footer {
      padding: 32px;
    }
  }
</style>
