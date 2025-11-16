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
    let displayTime = $state("00:00");
    let isPaused = $state(false)
    let timer: ReturnType<typeof setInterval> | null = null

    $effect(() => {
        if (localTime <= 0) {
            timerOpen = false
        }
    })

    function pauseTimer() {
        isPaused = !isPaused

        if (isPaused && timer) {
            clearInterval(timer);
            timer = null
        } else if (!isPaused) {
            startTimer();
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            if (localTime > 0) {
                localTime--;
                displayTime = formatTime(localTime);
            } else if (localTime <= 0) {
                if (timer) clearInterval(timer);
            }
        }, 1000);
    }
    
    onMount(() => {    
        displayTime = formatTime(localTime);
        startTimer();
        
        return () => {
            if (timer) clearInterval(timer)
        }
    });

    onDestroy(() => {
        duration = time-localTime
        onPomodoroEnd()
    })
</script>

<div class="w-full flex flex-col items-center">
    <div class="w-full mt-10 flex flex-col items-center z-50">
        <h1 class="text-white text-shadow">{displayTime}</h1>

        <!-- Bar -->
        <ul id="menuBar" class="bg-rose-100 rounded-full p-2 flex flex-row pointer-events-auto shadow-lg">
            <li onclick={pauseTimer}>{isPaused ? 'Resume' : 'Pause'}</li>
            <li onclick={() => timerOpen = false}>Stop</li>
        </ul>
    </div>
</div>