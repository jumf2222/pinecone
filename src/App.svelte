<script lang="ts">
  import Calculator from "./Calculator.svelte";
  import Sidebar from "./Sidebar.svelte";
</script>

<main>
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
</main>

<style>
  img {
    width: 130px;
  }
  .container {
    display: grid;

    grid-template-areas:
      "header content side"
      "nav content side"
      "footer footer footer";

    grid-template-columns: 220px 1fr 220px;
    grid-template-rows: auto 1fr auto;
    /* grid-gap: 10px; */
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

  aside {
    grid-area: side;
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
        "side"
        "footer";

      grid-template-columns: 1fr;
      grid-template-rows:
        auto /* Header */
        /* minmax(75px, auto) Nav */
        0
        1fr /* Content */
        /* minmax(75px, auto) Sidebar */
        0
        auto; /* Footer */
    }

    nav,
    aside {
      margin: 0;
    }
  }
</style>
