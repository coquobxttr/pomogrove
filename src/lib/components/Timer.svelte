<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { formatTime } from "$lib/types";
    
    let { 
        time = $bindable(),
        timerOpen = $bindable(),
        duration = $bindable(),
        onPomodoroEnd
    } : {
        time: number,
        timerOpen: boolean,
        duration: number,
        onPomodoroEnd: () => void
    } = $props();

    let localTime = $state(time);
    let displayTime = $state("00:00:00");

    $effect(() => {
        if (localTime <= 0) {
            timerOpen = false
        }
    })
    
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
        duration = time-localTime
        onPomodoroEnd()
    })
</script>

<div class="w-full flex flex-col items-center">
    <div class="w-full mt-10 flex flex-col items-center z-50">
        <h1 class="text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">{displayTime}</h1>

        <!-- Bar -->
        <ul id="menuBar" class="bg-rose-100 rounded-full p-2 flex flex-row pointer-events-auto shadow-lg">
            <li onclick={() => timerOpen = false}>Stop</li>
        </ul>
    </div>
</div>