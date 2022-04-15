<script lang="ts">
  import type { Assessment } from "./types";
  import Tooltip from "./Tooltip.svelte";

  export let assessment: Assessment;
  let addButton;
</script>

<form class="content" on:submit|preventDefault={() => {}}>
  <div class="hbox">
    <input
      class="name"
      bind:value={assessment.name}
      placeholder="Assessment Name..."
    />
    <div class="hgap" />
    <Tooltip left>
      <button class="delete" on:click>
        <i class="material-icons">clear</i>
      </button>
      <p slot="tip">Delete Assessment</p>
    </Tooltip>
  </div>
  <p class="label">Assessment Weight (%):</p>
  <div class="hbox">
    <input
      type="number"
      bind:value={assessment.weight}
      min="0"
      max="100"
      step="any"
    />
    <div style="width:50px" />
  </div>
  <p class="label">Grades:</p>
  <div class="grades">
    {#each assessment.grades as grade, i (grade.id)}
      <div class="hbox">
        <input type="number" bind:value={grade.mark} step="any" />
        <div class="hgap" />
        <p class="slash">/</p>
        <div class="hgap" />
        <input type="number" bind:value={grade.total} min="1" step="any" />
        <div class="hgap" />
        <Tooltip left>
          <button
            class="delete"
            on:click={() => {
              assessment.grades = [
                ...assessment.grades.slice(0, i),
                ...assessment.grades.slice(i + 1),
              ];
            }}><i class="material-icons">clear</i></button
          >
          <p slot="tip">Delete Grade</p>
        </Tooltip>
      </div>
      <div class="vgap" />
    {/each}
    <button
      class="add"
      bind:this={addButton}
      on:click={() => {
        assessment.grades = [
          ...assessment.grades,
          { mark: 0, total: 100, id: Date.now().toString() },
        ];
        setTimeout(() => {
          addButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 300);
      }}>Add Grade</button
    >
  </div>
</form>

<style>
  button:focus,
  input:focus {
    border-radius: 3px;
    border: 1px solid var(--secondary-text);
  }

  .hgap {
    min-width: 10px;
    max-width: 10px;
  }

  .vgap {
    min-height: 10px;
    max-height: 10px;
  }

  .grades {
    display: flex;
    flex-direction: column;
  }

  .hbox {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .label {
    margin-top: 15px;
    margin-bottom: 5px;
    color: var(--secondary-text);
  }

  .name {
    /* margin-right: 10px; */
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--course-font-color);
    border-radius: 0;
    padding: 10px 0px;
    font-size: 24px;
    color: var(--font-color);
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    -ms-transition: all 0.2s ease-out;
    -o-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
  }

  .name:focus {
    outline: none;
    border: none;
    border-bottom: 1px solid var(--font-color);
  }

  .slash {
    color: var(--secondary-text);
    line-height: 40px;
  }

  .delete {
    color: var(--nav-font-color);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px;
  }

  .delete:hover {
    color: var(--font-color);
    background: var(--nav-button-color);
    cursor: pointer;
  }

  .add {
    border-radius: 3px;
    margin-top: 10px;
    width: 100%;
    height: 50px;
    background: var(--nav-button-color);
    border: 1px solid var(--nav-button-border-color);
  }
  .add:hover {
    background: var(--nav-hover-button-color);
    border: 1px solid var(--nav-hover-button-border-color);
  }

  input {
    display: block;
    flex: 1;
    background: var(--input-back);
    border: 1px solid var(--input-border-color);
    color: var(--font-color);
    border-radius: 3px;
    height: 40px;
    font-size: 16px;
    min-width: 0;
    max-width: 100%;
    padding: 12px;
  }

  form {
    background-color: var(--card-color);
    border: 1px solid var(--card-border-color);
    border-radius: 6px;
    padding: 12px 18px;
    width: 550px;
    max-width: calc(100% - 40px);
  }

  button {
    height: 40px;
    width: 40px;
    color: var(--font-color);
    border: 1px solid var(--button-border-color);
    background: var(--button-color);
  }

  i {
    vertical-align: middle;
  }

  button:hover {
    background: var(--hover-button-color);
    border: 1px solid var(--hover-button-border-color);
    cursor: pointer;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
    margin: 0;
  }
</style>
