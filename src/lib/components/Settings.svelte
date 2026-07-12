<script lang="ts">
    import { toggleSound } from '$lib/stores/audio.svelte';
    import { formatTime } from '$lib/types';
    import { open } from '@tauri-apps/plugin-shell';
    import { onMount } from 'svelte';
    import { scale } from 'svelte/transition';
    import { Volume2 } from '@lucide/svelte';
    import { VolumeOff } from '@lucide/svelte';
    import { getSoundEnabled } from '$lib/stores/audio.svelte';

    let { 
        settingsOpen = $bindable(),
        deleteDataAlert = $bindable(),
        xp,
        blocks
    } = $props()

    let statsOpen = $state(false)
    let studyRecord = $state(0);

    async function openREADME() {
        await open('https://github.com/coquobxttr/pomogrove/blob/dev/README.md');
    }

    onMount(() => {
        for (let block of blocks) {
            if (block.pomodoroTime > studyRecord) {
                studyRecord = block.pomodoroTime
            }
        }
    })
</script>

<div
    id="settingsScreen"
    class="backdrop-blur-sm bg-rose-300/20 cursor-pointer w-full h-full flex justify-center items-center z-40 gap-2"
    onclick={() => settingsOpen = false}
>
    <div onclick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <p class="px-5 text-xs">Click out or press esc to close</p>

        <ul id="settings">
            <li onclick={() => statsOpen = !statsOpen}>Stats Display</li>
            <li onclick={toggleSound} class="flex flex-row items-center">
                {#if getSoundEnabled()}
                    <Volume2 size={20}/>
                {:else}
                    <VolumeOff size={20} color={"#fb7185"}/>
                {/if}
                <p class="mx-1">
                    Toggle Sound
                </p>
                </li>
            <li class="hover:bg-red-500/25" onclick={() => deleteDataAlert = true}>Reset Progress</li>
            <li onclick={openREADME}>About/Credits</li>
        </ul>
    </div>

    {#if statsOpen}
        <div
            transition:scale={{ duration: 200 }}
        >
            <h2>Total XP</h2>
            <p class="pl-5 text-2xl">{xp}</p>

            <h2>Longest Study Session</h2>
            <p class="pl-5 text-2xl">{formatTime(studyRecord)}</p>
        </div>
    {/if}
</div>