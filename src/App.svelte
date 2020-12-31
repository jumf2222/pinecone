<script lang="ts">
  import Calculator from "./Calculator.svelte";
  import Sidebar from "./Sidebar.svelte";
</script>

<div class="container">
  <header><img src="logo.svg" alt="Pinecone Logo" /></header>
  <nav>
    <Sidebar />
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
  img {
    width: 130px;
  }
  .container {
    display: grid;

    grid-template-areas:
      "header content"
      "nav content"
      "footer footer";

    grid-template-columns: 220px 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
  }

  header {
    grid-area: header;
    background: var(--nav-background-color);
    padding: 20px 24px;
    padding-top: 25px;
  }

  nav {
    grid-area: nav;
    overflow: auto;
    background: var(--nav-background-color);
    color: var(--nav-font-color);
  }

  main {
    grid-area: content;
    overflow: visible;
  }

  footer {
    font-size: 14px;
    padding: 2px;
    color: #ffffff;
    background-color: #007acc;
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
        auto /* Header */
        min-content
        1fr /* Content */
        auto; /* Footer */
      height: 100vh;
      width: 100vw;
    }
  }
</style>
