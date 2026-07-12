<script lang="ts">
    import { onMount, tick } from "svelte";
    import { formatTime } from "$lib/types";

    import { Check } from "@lucide/svelte";
    
    let { 
        time = $bindable(),
        timerOpen = $bindable(),
        duration = $bindable(),
        pomodoroEndScreen = $bindable(),
        pomodoroDataSent = $bindable(),
        breakTotalCount = $bindable(),
        onPomodoroEnd
    } : {
        time: number,
        timerOpen: boolean,
        duration: number,
        pomodoroEndScreen: boolean,
        pomodoroDataSent: boolean,
        breakTotalCount: number
        onPomodoroEnd: (completedTasks: number, totalTasks: number) => void
    } = $props();

    let localTime = $state(time);
    let breakTime = $state(10)
    let displayTime = $state("00:00");
    let isPaused = $state(false)
    let breakCounter = $state(0)
    let breakTimeOn = $state(false)
    let timer: ReturnType<typeof setInterval> | null = null
    let toDoList = $state([{
        text: " ",
        checkbox: false
    }])

    $effect(() => {
        if (localTime <= 0 && !breakTimeOn) {
            if (breakCounter < breakTotalCount) {
                if (timer) clearInterval(timer);
                timer = null
                
                console.log("10 sec break")
                breakCounter++
                breakTimeOn = true
                breakTime = 10  // Reset here too for safety
                breakTimer()
            } else if (breakCounter >= breakTotalCount) {
                pomodoroEndScreen = true
                timerOpen = false
            }
        }
        
        // When break ends, restart pomodoro
        if (breakTimeOn === false && breakCounter > 0 && breakCounter < breakTotalCount && localTime <= 0) {
            localTime = time
            startTimer()
        }
    })

    function breakTimer() {
        console.log("started")
        timer = setInterval(() => {
            console.log("doing thing")
            if (breakTime > 0) {
                breakTime--;
                displayTime = formatTime(breakTime);
            } else if (breakTime <= 0) {
                breakTimeOn = false
                breakTime = 10
                if (timer) clearInterval(timer);
                timer = null
                
                // Restart pomodoro if we haven't reached the end
                if (breakCounter < breakTotalCount) {
                    localTime = time
                    displayTime = formatTime(localTime)
                    startTimer()
                }
            }
        }, 1000);
    }

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

    async function handleKeyDown(e: KeyboardEvent, index: number) {
        if (e.key === "Enter") {
            e.preventDefault()
            toDoList.push({
                text: "",
                checkbox: false
            })
            
            // Wait for Svelte to update the DOM
            await tick()
            
            let nextItem = document.querySelector(`#listItem${index+1}`) as HTMLElement
            if (nextItem) nextItem.focus()
        }
        if (e.key === "ArrowLeft" || e.key === "a") e.stopPropagation()
        if (e.key === "ArrowRight" || e.key === "d") e.stopPropagation()
    }
    
    onMount(() => {    
        displayTime = formatTime(localTime);
        startTimer();
        
        return () => {
            if (timer) clearInterval(timer)

            let completedTasks = 0
            for (let item of toDoList) {
                if (item.checkbox) completedTasks++
            }
            //duration = time * (breakTotalCount + 1)
            duration = (time-localTime) * (breakTotalCount + 1)
            onPomodoroEnd(completedTasks, toDoList.length)
            pomodoroDataSent = true
        }
    });
</script>

<div class="w-full flex flex-col items-center pointer-events-none">
    <div class="bg-transparent shadow-2xl w-fit p-5 px-20 rounded-b-4xl flex flex-col items-center z-50">
        <h1 class="text-white text-shadow">{displayTime}</h1>

        {#if breakTimeOn}
            <h4>Break</h4>
        {/if}

        <!-- Bar -->
        <ul id="menuBar">
            <li class="pointer-events-auto" onclick={pauseTimer}>{isPaused ? 'Resume' : 'Pause'}</li>
            <li class="pointer-events-auto" onclick={() => {timerOpen = false; pomodoroEndScreen = true}}>Stop</li>
        </ul>        
    </div>

    <div class="mt-5 overflow-auto max-h-75">
        {#each toDoList as listItem, index}
            <div class={`w-fit h-fit p-2 px-5 pointer-events-auto flex flex-row items-center gap-2 ${toDoList[index].checkbox ? 'text-rose-300' : ''} hover:bg-rose-50/25 focus:bg-rose-50/25 transition rounded-2xl`}>
                <div
                    class="bg-white rounded-md size-5 p-0.5 cursor-pointer flex items-center justify-center transition-all hover:bg-rose-50"
                    onclick={() => toDoList[index].checkbox = !toDoList[index].checkbox}
                >
                    {#if toDoList[index].checkbox}
                        <Check size={18}/>
                    {/if}
                </div>

                <div
                    bind:innerText={toDoList[index].text}
                    onkeydown={(e) => handleKeyDown(e, index)}
                    id={`listItem${index}`}
                    class={`${toDoList[index].checkbox ? 'line-through text-rose-300' : ''} outline-none cursor-pointer pointer-events-auto max-w-50 min-w-10 px-2 py-1`}
                    contenteditable
                ></div>
            </div>
        {/each}
    </div>
</div>