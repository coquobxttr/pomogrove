<script lang="ts">
  import { onMount } from "svelte";
  
  let { time } = $props();
  let localTime = $state(time);
  let displayTime = $state("00:00:00");
  
  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  onMount(() => {
    const timer = setInterval(() => {
      if (localTime > 0) {
        localTime--;
        displayTime = formatTime(localTime);
      } else {
        clearInterval(timer);
      }
    }, 1000);
    
    // Initialize display
    displayTime = formatTime(localTime);
    
    // Cleanup
    return () => clearInterval(timer);
  });
</script>

<div>
  <p>{displayTime}</p>
</div>