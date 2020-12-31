<script lang="ts">
  import AssessmentCard from "./AssessmentCard.svelte";
  import { currentCourse, courses } from "./stores";
  import Tooltip from "./Tooltip.svelte";

  $: if ($courses.length > 0) {
    let avg = 0;
    for (const assessment of $courses[$currentCourse].assessments) {
      for (const grade of assessment.grades) {
        avg +=
          ((assessment.weight / 100) * grade.mark) /
          grade.total /
          assessment.grades.length;
      }
    }

    $courses[$currentCourse].mark =
      Math.round((avg * 100 + Number.EPSILON) * 100) / 100;
  }
</script>

{#if $courses.length > 0}
  <div class="wrapper">
    <div class="hbox">
      <div class="vbox">
        <input bind:value={$courses[$currentCourse].name} class="course" />
        <p>
          GRADE:
          {$courses[$currentCourse].mark ? `${$courses[$currentCourse].mark}%` : ''}
        </p>
      </div>

      <Tooltip left>
        <button
          class="delete"
          on:click={() => {
            $courses = [...$courses.slice(0, $currentCourse), ...$courses.slice($currentCourse + 1)];
            if ($currentCourse >= $courses.length && $courses.length > 0) $currentCourse = $courses.length - 1;
          }}>
          <i class="material-icons">clear</i>
        </button>
        <p slot="tip">Delete Course</p>
      </Tooltip>
    </div>
    <div class="container">
      {#each $courses[$currentCourse].assessments as assessment, i}
        <AssessmentCard
          bind:assessment
          on:click={() => {
            $courses[$currentCourse].assessments = [...$courses[$currentCourse].assessments.slice(0, i), ...$courses[$currentCourse].assessments.slice(i + 1)];
          }} />
      {/each}
      <button
        class="add"
        on:click={() => {
          $courses[$currentCourse].assessments = [...$courses[$currentCourse].assessments, { name: '', grades: [{ mark: 0, total: 100 }], weight: 0 }];
        }}>Add Assessment</button>
    </div>
  </div>
{/if}

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    max-height: 100%;
  }

  .course {
    background-color: transparent;
    border-bottom: 1px solid var(--card-border-color);
    padding: 8px 0px;
    font-size: 28px;
    color: var(--font-color);
  }

  .course:focus {
    outline: none;
    border-bottom: 1px solid var(--font-color);
  }

  .container {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    align-items: center;
    height: 100%;
  }

  i {
    vertical-align: middle;
  }

  .delete {
    text-align: center;
    height: 50px;
    width: 50px;
    border: none;
    background: transparent;
    border-radius: 3px;
  }

  button {
    color: var(--font-color);
    border: 1px solid var(--button-border-color);
    border-radius: 3px;
    background: var(--button-color);
  }

  button:hover {
    background: var(--hover-button-color);
    border: 1px solid var(--hover-button-border-color);
  }

  .add {
    padding: 14px;
    width: 570px;
    display: inline-block;
    margin-bottom: 10px;
  }

  .hbox {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 30px;
    justify-content: space-between;
    width: 100%;
    max-width: 570px;
    align-items: center;
  }

  .vbox {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
