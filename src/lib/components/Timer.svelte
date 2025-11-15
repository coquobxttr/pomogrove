<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    
    let { 
        time = $bindable(),
        timerOpen = $bindable(),
        addGrid
    } : {
        time: number,
        timerOpen: boolean,
        addGrid: () => void
    } = $props();

    let localTime = $state(time);
    let displayTime = $state("00:00:00");
    
    function formatTime(totalSeconds: number): string {
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
        
        displayTime = formatTime(localTime);
        
        return () => clearInterval(timer);
    });

    onDestroy(() => {
        addGrid()
    })
</script>

<div class="w-full flex flex-col items-center">
    <div class="w-full mt-10 flex flex-col items-center z-50">
        <h1>{displayTime}</h1>

        <!-- Bar -->
        <ul id="menuBar" class="bg-pink-100 rounded-full p-2 flex flex-row">
            <li onclick={() => timerOpen = false}>Stop</li>
        </ul>
    </div>
</div>