<script lang="ts">
  import type { Assessment } from "./types";
  import Tooltip from "./Tooltip.svelte";

  export let assessment: Assessment;
</script>

<form class="content" on:submit|preventDefault={() => {}}>
  <div class="hbox">
    <input
      class="name"
      bind:value={assessment.name}
      placeholder="Assessment Name..." />
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
      step="any" />
    <div style="width:40px" />
  </div>
  <p class="label">Grades:</p>
  <div class="grades">
    {#each assessment.grades as grade, i}
      <div class="hbox">
        <input type="number" bind:value={grade.mark} step="any" />
        <p class="slash">/</p>
        <input type="number" bind:value={grade.total} min="1" step="any" />
        <Tooltip left>
          <button
            class="delete"
            on:click={() => {
              assessment.grades = [...assessment.grades.slice(0, i), ...assessment.grades.slice(i + 1)];
            }}><i class="material-icons">clear</i></button>
          <p slot="tip">Delete Grade</p>
        </Tooltip>
      </div>
    {/each}
    <button
      class="add"
      on:click={() => {
        assessment.grades = [...assessment.grades, { mark: 0, total: 100 }];
      }}>Add Grade</button>
  </div>
</form>

<style>
  .grades {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .hbox {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }

  .label {
    margin-top: 15px;
    margin-bottom: 5px;
  }

  input {
    display: block;
    flex: 1;
    background: transparent;
    border: 1px solid var(--input-border-color);
    color: var(--font-color);
    border-radius: 3px;
    height: 40px;
    font-size: 16px;
    min-width: 0;
    max-width: 100%;
  }

  form {
    border: 1px solid var(--card-border-color);
    border-radius: 6px;
    padding: 15px;
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

  .name {
    margin-top: 10px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--card-border-color);
    border-radius: 0;
    padding: 8px 0px;
    font-size: 20px;
    color: var(--font-color);
  }

  .name:focus {
    outline: none;
    border-bottom: 1px solid var(--font-color);
  }

  .slash {
    line-height: 40px;
  }

  button:hover {
    background: var(--hover-button-color);
    border: 1px solid var(--hover-button-border-color);
    cursor: pointer;
  }

  .delete {
    border: none;
    background: transparent;
  }

  .delete:hover {
    color: var(--font-color);
    border: 1px solid var(--hover-button-border-color);
    border-radius: 3px;
    cursor: pointer;
  }

  .add {
    border-radius: 3px;
    margin-top: 10px;
    width: 100%;
    height: 50px;
    background: transparent;
  }
  .add:hover {
    background: transparent;
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
