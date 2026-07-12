<script lang="ts">
    import { onMount } from "svelte";
    import { formatTime, pomEndMessages } from "$lib/types";

    let {
        pomodoroEndScreen = $bindable(),
        pomodoroDataSent = $bindable(),
        completedTasks,
        totalTasks,
        time,
        blockType = "Grass"
    } = $props()
    
    let message = $state("")
    
    function handleKeyPress(event: KeyboardEvent) {
        event.preventDefault()
        if (event.key == "Escape") {
            pomodoroDataSent = false
            pomodoroEndScreen = false
        }
    }
    
    onMount(() => {       
        if (time <= 600) {
            message = pomEndMessages.bad
        } else if (time > 600 && time <= 1200) {
            message = pomEndMessages.ok
        } else if (time > 1200) {
            message = pomEndMessages.good
        }
    })
</script>

<svelte:window onkeydown={handleKeyPress} />

<div
    class="bg-transparent cursor-pointer w-full h-full flex justify-center items-center"
    onclick={() => {pomodoroDataSent = false; pomodoroEndScreen = false}}
>
    <div class="p-5 px-10 shadow-2xl backdrop-blur-xs cursor-default w-fit max-w-150 h-fit rounded-xl flex flex-col items-center">
        <div class="flex flex-row gap-4">
            <div class="flex-2">
                <h2 class={time<600 ? 'text-red-500': ''}>{formatTime(time)}</h2>
                <p>{message}</p>
                {#if totalTasks > 0}
                    <p>You Completed {completedTasks} out of {totalTasks} Tasks From Your List</p>
                {/if}
            </div>
            <div class="flex-1 text-right">
                <h3 class="text-white text-shadow-lg font-bold ">You Gained a {blockType} Block</h3>
            </div>
        </div>
        <p class="m-5 cursor-pointer">Click anywhere to close or press esc</p>
    </div>
</div>