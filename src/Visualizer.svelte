<script lang="ts">
  import Chart from "svelte-frappe-charts";
  import AssessmentCard from "./AssessmentCard.svelte";
  import { currentCourse, courses } from "./stores";
  import Tooltip from "./Tooltip.svelte";

  let chartGradeData = {
    labels: [],
    datasets: [
      {
        name: "Grades",
        values: [],
      },
    ],
  };

  let chartWeightData = {
    labels: [],
    datasets: [
      {
        name: "Weights",
        values: [],
      },
    ],
  };

  $: if ($courses.length > 0) {
    let labels = [];
    let values = [];
    let weightLabels = [];
    let weightValues = [];
    let avg = 0;
    for (const assessment of $courses[$currentCourse].assessments) {
      console.log("ran");
      weightLabels.push(assessment.name);
      weightValues.push(assessment.weight);
      for (const grade of assessment.grades) {
        labels.push(assessment.name);
        values.push(
          Math.round(
            ((grade.mark / grade.total) * 100 + Number.EPSILON) * 100
          ) / 100
        );
        avg +=
          ((assessment.weight / 100) * grade.mark) /
          grade.total /
          assessment.grades.length;
      }
    }

    $courses[$currentCourse].mark =
      Math.round((avg * 100 + Number.EPSILON) * 100) / 100;
    chartGradeData.labels = labels;
    chartGradeData.datasets[0].values = values;
    chartWeightData.labels = weightLabels;
    chartWeightData.datasets[0].values = weightValues;
  }
</script>

<div class="wrapper">
  <div class="chart1">
    <Chart
      data={chartGradeData}
      type="bar"
      tooltipOptions={{ formatTooltipY: (d) => d + '%' }} />
  </div>
  <div class="chart2">
    <Chart
      data={chartWeightData}
      type="percentage"
      maxSlices="10000"
      barOptions={{ height: 10, depth: 2 }}
      tooltipOptions={{ formatTooltipY: (d) => d + '%' }}
      height="40" />
  </div>
</div>

<style>
  :global(g) {
    fill: var(--font-color);
  }
  .wrapper {
    display: grid;
    grid-template-areas:
      "title title"
      "chart2 chart1"
      "grades chart1";
    grid-template-columns: 600px 1fr;
    grid-template-rows: minmax(0, auto) minmax(0, auto) minmax(0, auto);
    padding-left: 20px;
    height: 100%;
  }

  .chart1 {
    grid-area: chart1;
  }
  .chart2 {
    grid-area: chart2;
  }
</style>
