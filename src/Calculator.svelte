<script lang="ts">
  import AssessmentCard from "./AssessmentCard.svelte";
  import { currentCourse, courses } from "./stores";
  import Tooltip from "./Tooltip.svelte";

  let gradesDivOffsetHeight = 0;
  let gradesDivHeight = 0;
  let addButton;

  $: if ($courses.length > 0 && $currentCourse >= 0) {
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

<div class="wrapper">
  {#if $courses.length > 0 && $currentCourse >= 0}
    <div class="title">
      <input bind:value={$courses[$currentCourse].name} class="course" />
      <div class="hgap" />
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
            let temp = $currentCourse;
            $currentCourse = -1;
            $courses = [
              ...$courses.slice(0, temp),
              ...$courses.slice(temp + 1),
            ];
            if (temp >= $courses.length && $courses.length > 0)
              temp = $courses.length - 1;
            setTimeout(() => {
              $currentCourse = temp;
            }, 300);
          }}
        >
          <i class="material-icons">delete</i>
        </button>
        <p slot="tip">Delete Course</p>
      </Tooltip>
    </div>
    <p class="grade">
      GRADE:
      {$courses[$currentCourse].mark ? `${$courses[$currentCourse].mark}%` : ""}
    </p>
    <div
      class="grades"
      class:scrollbar={gradesDivOffsetHeight <= gradesDivHeight}
      bind:clientWidth={gradesDivHeight}
      bind:offsetWidth={gradesDivOffsetHeight}
    >
      {#each $courses[$currentCourse].assessments as assessment, i (assessment.id)}
        <AssessmentCard
          bind:assessment
          on:click={() => {
            $courses[$currentCourse].assessments = [
              ...$courses[$currentCourse].assessments.slice(0, i),
              ...$courses[$currentCourse].assessments.slice(i + 1),
            ];
          }}
        />
        <div class="vgap" />
      {/each}
      <div class="add-wrapper">
        <button
          class="add"
          bind:this={addButton}
          on:click={() => {
            $courses[$currentCourse].assessments = [
              ...$courses[$currentCourse].assessments,
              {
                name: "",
                grades: [{ mark: 0, total: 100, id: Date.now().toString() }],
                weight: 0,
                id: Date.now().toString(),
              },
            ];
            setTimeout(() => {
              addButton.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              });
            }, 200);
          }}>Add Assessment</button
        >
      </div>
    </div>
  {:else if $currentCourse >= 0}
    <div class="empty">
      <div class="circle"><i class="material-icons md-120">widgets</i></div>
      <h2>No Courses Yet</h2>
      <p class="empty-state">Fortunately, it is very easy to add new ones.</p>
      <button
        class="message"
        type="button"
        on:click={() => {
          $courses = [
            ...$courses,
            {
              name: "Course Name",
              assessments: [],
              mark: 0,
              id: Date.now().toString(),
            },
          ];
        }}>Add Course</button
      >
    </div>
  {/if}
</div>

<style>
  .empty-state {
    padding: 0 12px;
    margin: 12px 0 24px 0;
    font-size: 18px;
    text-align: center;
  }

  .hgap {
    min-width: 10px;
    max-width: 10px;
  }

  .vgap {
    min-height: 10px;
    max-height: 10px;
  }

  .message {
    /* width: 550px; */
    /* max-width: calc(100% - 40px); */
    width: 250px;
    height: 50px;
    cursor: pointer;
    padding: 8px 15px;
    /* font-size: 28px; */
    color: var(--font-color);
  }

  .circle {
    text-align: center;
    background: var(--card-color);
    border-radius: 50%;
    height: 200px;
    width: 200px;
  }

  .material-icons.md-120 {
    color: var(--secondary-text);
    padding-top: 40px;
    font-size: 120px;
  }

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
    position: relative;
  }

  .grades {
    grid-area: grades;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    align-items: center;
    height: 100%;
    padding-right: 8px;
  }

  .grade {
    grid-area: grade;
  }

  .scrollbar {
    padding-right: 16px;
  }

  .course {
    background-color: transparent;
    border-bottom: 1px solid var(--course-font-color);
    padding: 8px 0px;
    font-size: 28px;
    color: var(--font-color);
    flex: 1;
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    -ms-transition: all 0.2s ease-out;
    -o-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
  }

  .action {
    text-align: center;
    height: 50px;
    width: 50px;
    color: var(--nav-font-color);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 3px;
  }

  .action:hover {
    color: var(--font-color);
    background: var(--nav-button-color);
    cursor: pointer;
  }

  .course:focus {
    outline: none;
    border-bottom: 1px solid var(--font-color);
  }

  .add {
    padding: 14px;
    width: 100%;
    display: inline-block;
    margin: 10px 0;
    cursor: pointer;
  }

  .add:focus {
    border-radius: 3px;
    border: 1px solid var(--secondary-text);
  }

  .empty {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    place-content: center;
    align-items: center;
    flex-direction: column;
  }

  .add-wrapper {
    padding: 0 15px;
    width: 604px;
    max-width: calc(100% - 40px);
  }

  .title {
    grid-area: title;
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    align-items: center;
  }

  h2 {
    margin: 24px 0 0 0;
    font-weight: 400;
    font-size: 28px;
  }

  i {
    vertical-align: middle;
  }

  button {
    color: var(--button-font-color);
    border: 1px solid var(--button-border-color);
    border-radius: 3px;
    background: var(--button-color);
  }

  button:hover {
    background: var(--hover-button-color);
    border: 1px solid var(--hover-button-border-color);
  }

  input {
    min-width: 0;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .wrapper {
      column-gap: 12px;
    }
    .scrollbar,
    .grades,
    .title {
      padding-right: 0;
    }
  }
</style>
