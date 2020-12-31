<script lang="ts">
  import AssessmentCard from "./AssessmentCard.svelte";
  import { currentCourse, courses } from "./stores";
  import Tooltip from "./Tooltip.svelte";

  let gradesDivHeight = 0;
  let gradesDiv;

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
    <p class="grade">
      GRADE:
      {$courses[$currentCourse].mark ? `${$courses[$currentCourse].mark}%` : ''}
    </p>
    <div class="title">
      <input bind:value={$courses[$currentCourse].name} class="course" />
      <!-- <Tooltip left>
        <button class="action" on:click={() => {}}>
          <i class="material-icons">insights</i>
        </button>
        <p slot="tip">Grade Visualizer</p>
      </Tooltip> -->
      <Tooltip left>
        <button
          class="action"
          on:click={() => {
            $courses = [...$courses.slice(0, $currentCourse), ...$courses.slice($currentCourse + 1)];
            if ($currentCourse >= $courses.length && $courses.length > 0) $currentCourse = $courses.length - 1;
          }}>
          <i class="material-icons">clear</i>
        </button>
        <p slot="tip">Delete Course</p>
      </Tooltip>
    </div>
    <div
      class="grades"
      class:scrollbar={!(gradesDiv && gradesDiv.scrollHeight > gradesDivHeight)}
      bind:clientHeight={gradesDivHeight}
      bind:this={gradesDiv}>
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
    display: grid;
    grid-template-areas:
      "space1 title space2"
      "space1 grade space2"
      "space1 grades space2"
      "space1 space4 space2";
    grid-template-columns: minmax(0, 1fr) minmax(0, auto) minmax(0px, 1fr);
    grid-template-rows: minmax(0, auto) auto minmax(0, auto) 0;
    place-content: start;
    gap: 20px;
    height: 100%;
    overflow: hidden;
  }

  .grades {
    grid-area: grades;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    align-items: center;
    height: 100%;
  }

  .grade {
    grid-area: grade;
  }

  .scrollbar {
    padding-right: 8px;
  }

  .course {
    background-color: transparent;
    border-bottom: 1px solid var(--card-border-color);
    padding: 8px 0px;
    font-size: 28px;
    color: var(--font-color);
    flex: 1;
  }

  .course:focus {
    outline: none;
    border-bottom: 1px solid var(--font-color);
  }

  i {
    vertical-align: middle;
  }

  .action {
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
    width: 100%;
    display: inline-block;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .title {
    grid-area: title;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-top: 20px;
    align-items: center;
  }

  .spacer {
    flex: 1;
  }

  .vbox {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  input {
    min-width: 0;
    max-width: 100%;
  }
</style>
