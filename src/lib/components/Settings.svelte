<script lang="ts">
    import { formatTime, type GridObject } from '$lib/types';
    import { open } from '@tauri-apps/plugin-shell';
    import { onMount } from 'svelte';
    import { scale } from 'svelte/transition';

    let { 
        settingsOpen = $bindable(),
        deleteDataAlert = $bindable(),
        xp,
        blocks
    } = $props()

    let statsOpen = $state(false)
    let studyRecord = 0;
    let recordBlock: GridObject

    async function openREADME() {
        await open('https://github.com/coquobxttr/pomogrove/blob/dev/README.md');
    }

    onMount(() => {
        for (let block of blocks) {
            if (block.pomodoroTime > studyRecord) {
                studyRecord = block.pomodoroTime
                recordBlock = block
            }
        }
    })
</script>

<div class="backdrop-blur-sm cursor-pointer w-full h-full flex justify-center items-center shadow-2xl shadow-rose-300 z-40" onclick={() => settingsOpen = false}>
    <div class="p-5 bg-white cursor-default w-fit h-fit rounded-xl" onclick={(e) => e.stopPropagation()}>
        <h2 class="font-bold mb-4 px-5">Settings</h2>

        <p class="px-5">Click out to close</p>

        <ul id="settings">
            <li onclick={() => deleteDataAlert = true}>Reset Progress</li>
            <li onclick={() => statsOpen = !statsOpen}>Stats Display</li>
            <li class="bg-transparent w-fit h-fit rounded-none p-0">
                {#if statsOpen}
                    <div
                        transition:scale={{ duration: 200 }}
                    >
                        <h3>Total XP</h3>
                        <p>{xp}</p>

                        <h3>Longest Study Session</h3>
                        <p>{formatTime(studyRecord)}</p>
                    </div>
                {/if}
            </li>
            <li>Toggle Sound</li>
            <li onclick={openREADME}>About/Credits</li>
        </ul>
    </div>
</div>