<script lang="ts">
  import { currentCourse, courses } from "./stores";
  import { slide } from "svelte/transition";

  export let mobile = false;
  export let open = false;
  let addButton;

  $: document.body.classList.toggle("noscroll", open);

  let gpa = 0;
  $: {
    gpa = 0;
    for (const course of $courses) {
      if (course.mark >= 85) {
        gpa += 4.0;
      } else if (course.mark >= 80) {
        gpa += 3.7;
      } else if (course.mark >= 77) {
        gpa += 3.3;
      } else if (course.mark >= 73) {
        gpa += 3.0;
      } else if (course.mark >= 70) {
        gpa += 2.7;
      } else if (course.mark >= 67) {
        gpa += 2.3;
      } else if (course.mark >= 63) {
        gpa += 2.0;
      } else if (course.mark >= 60) {
        gpa += 1.7;
      } else if (course.mark >= 57) {
        gpa += 1.3;
      } else if (course.mark >= 53) {
        gpa += 1.0;
      } else if (course.mark >= 50) {
        gpa += 0.7;
      }
    }
    gpa = Math.floor((gpa / $courses.length + Number.EPSILON) * 100) / 100;
  }
</script>

<div class="wrapper" class:mobile style="width: {open || !mobile ? 100 : 0}%">
  <p class="title">Courses: {$courses.length}</p>
  <p class="gpa">GPA: {gpa || gpa === 0 ? gpa : ''}</p>
  <div class="scroll">
    {#each $courses as course, i (course.id)}
      <button
        transition:slide={{ duration: 200 }}
        class="course"
        class:selected={$currentCourse === i}
        on:click={() => {
          $currentCourse = i;
          open = false;
        }}>
        <p class="name">{course.name}</p>
        <p class="mark">{course.mark ? `${course.mark}%` : ''}</p>
      </button>
    {/each}
    <button
      class="add-course"
      type="button"
      bind:this={addButton}
      on:click={() => {
        $courses = [...$courses, { name: 'Course Name', assessments: [], mark: 0, id: Date.now().toString() }];
        setTimeout(() => {
          addButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }}>Add Course</button>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .mobile {
    position: fixed;
    top: var(--header-height);
    right: 0;
    bottom: 0;
    width: 0;
    z-index: 100;
    background: var(--nav-background-color);
    transition: all 200ms;
  }

  .scroll {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  button {
    padding: 12px 20px;
    color: var(--course-font-color);
    background: var(--nav-button-color);
    border: 1px solid var(--nav-button-border-color);
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 5px 10px;
  }

  button:hover {
    color: var(--course-hover-font-color);
    background: var(--nav-hover-button-color);
    border: 1px solid var(--nav-hover-button-border-color);
    cursor: pointer;
  }

  .add-course {
    margin-top: 10px;
    justify-content: center;
  }

  .course {
    border-bottom: 1px solid black;
    background: var(--course-button-color);
    border: 1px solid var(--course-button-border-color);
  }

  .course:hover {
    background: var(--course-button-color);
  }

  .course:focus {
    outline: none;
  }

  .selected,
  .selected:hover {
    color: var(--course-hover-font-color);
    background: var(--course-hover-button-color);
    border: 1px solid var(--course-hover-button-border-color);
  }

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    min-width: 0;
    margin-right: 4px;
    height: 20px;
  }

  .title {
    margin-top: 10px;
    padding: 0px 24px;
  }

  .gpa {
    padding: 10px 24px;
    padding-top: 0px;
  }
</style>
