<script lang="ts">
  export let left = false;
  export let right = false;
  export let top = false;
  export let bottom = false;
  if (!left && !right && !top && !bottom) bottom = true;
</script>

<div class="content">
  <slot>
    <!-- optional fallback -->
  </slot>
  <div class="tip" class:left class:right class:top class:bottom>
    <slot name="tip">
      <!-- optional fallback -->
    </slot>
  </div>
</div>

<style>
  .content {
    position: relative;
    height: fit-content;
    width: fit-content;
  }

  .content:hover .tip {
    visibility: visible;
    opacity: 1;
    transition: opacity 150ms 500ms, visibility 150ms 500ms;
  }

  .tip {
    position: absolute;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition: opacity 150ms, visibility 150ms;
    background: var(--hover-button-color);
    border-radius: 4px;
    padding: 10px 12px;
    white-space: nowrap;
  }

  .left {
    left: -5px;
    top: 50%;
    transform: translate(-100%, -50%);
  }

  .left::after {
    content: "";
    position: absolute;
    top: calc(50% - 5px);
    right: -10px;
    /* margin-top: -2.5px; */
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent var(--hover-button-color);
  }

  .right {
    top: 50%;
    left: calc(100% + 5px);
    transform: translateY(-50%);
  }

  .right::after {
    content: "";
    position: absolute;
    top: 50%;
    left: -5px;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--hover-button-color) transparent transparent;
  }

  .top {
    top: -100%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .top::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--hover-button-color) transparent transparent transparent;
  }

  .bottom {
    top: 100%;
    left: 50%;
    transform: translate(-50%, 5px);
  }

  .bottom::after {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent var(--hover-button-color) transparent;
  }
</style>
