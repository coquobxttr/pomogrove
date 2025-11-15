<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { fade } from "svelte/transition";
    import Scene from "$lib/components/Scene.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import TimeSelect from "$lib/components/TimeSelect.svelte";
    import PomodoroEnd from "$lib/components/PomodoroEnd.svelte";
    import type { GridObject } from "$lib/types";

    let timeSelectOpen = $state(false);
    let pomodoroTime = $state(0);
    let xp = $state(0)
    let duration = $state(0);
    let timerOpen = $state(false);
    let pomodoroEndScreen = $state(false);

    let userXP = $state(0);

    let gridObjects: GridObject[] = $state([
        {
            type: "grass",
            unlockDate: new Date(),
            pomoDoroTime: 20,
            x: 0,
            z: 0
        }
    ])
    
    function getRandomAdjacentPosition() {
        const randomBox = gridObjects[Math.floor(Math.random() * gridObjects.length)];
        
        const directions = [
            { x: 1, z: 0 },
            { x: -1, z: 0 },
            { x: 0, z: 1 },
            { x: 0, z: -1 }
        ];
        
        let attempts = 0;
        while (attempts < 20) {
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            const newX = randomBox.x + randomDir.x;
            const newZ = randomBox.z + randomDir.z;
            
            const occupied = gridObjects.some(obj => obj.x === newX && obj.z === newZ);
            
            if (!occupied) {
                return { x: newX, z: newZ };
            }
            attempts++;
        }
        
        for (const box of gridObjects) {
            for (const dir of directions) {
                const newX = box.x + dir.x;
                const newZ = box.z + dir.z;
                const occupied = gridObjects.some(obj => obj.x === newX && obj.z === newZ);
                if (!occupied) {
                    return { x: newX, z: newZ };
                }
            }
        }
        
        return { x: Math.floor(Math.random() * 10) - 5, z: Math.floor(Math.random() * 10) - 5 };
    }

    function addGrid(xp: number) {
        let type = "grass";
        
        if (xp < 15) {
            type = "grass";
        } else if (xp >= 15 && xp < 27) {
            type = "flower";
        } else if (xp >= 27 && xp < 36) {
            type = "bush";
        } else if (xp >= 36) {
            type = "tree";
        }
        
        const position = getRandomAdjacentPosition();
        
        gridObjects.push({
            type: type,
            unlockDate: new Date(),
            pomoDoroTime: pomodoroTime,
            x: position.x,
            z: position.z
        });
        
        gridObjects = gridObjects;

        console.log(gridObjects)
    }

    function onPomodoroEnd() {
        xp = Math.floor(duration / 10);
        userXP += xp
        pomodoroEndScreen = true;
        addGrid(xp);
    }

</script>

<div class=" bg-linear-to-t from-indigo-200 via-red-200 to-yellow-100 w-full h-full flex flex-col">
    {#if !timerOpen}
        <div class="w-full mt-10 flex flex-col items-center z-50 pointer-events-none">
            <h1 class="text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">PomoGrove</h1>

            <!-- Bar -->
            <ul id="menuBar" class="bg-rose-100 rounded-full p-2 flex flex-row pointer-events-auto shadow-lg">
                <li>{userXP} XP</li>
                <li onclick={() => timeSelectOpen = !timeSelectOpen}>Start</li>
                <li>Settings</li>
            </ul>
        </div>
    {/if}

    {#if timeSelectOpen}
        <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full">
            <TimeSelect
                bind:timeSelectOpen={timeSelectOpen}
                bind:pomodoroTime={pomodoroTime}
                bind:timerOpen={timerOpen}
            />
        </div>
    {/if}

    {#if timerOpen}
        <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full">
            <Timer
                bind:time={pomodoroTime}
                bind:timerOpen={timerOpen}
                bind:duration={duration}
                onPomodoroEnd={onPomodoroEnd}
            />
        </div>
    {/if}

    {#if pomodoroEndScreen}
         <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full">
            <PomodoroEnd
                bind:pomodoroEndScreen={pomodoroEndScreen}
                time={duration}
                xp={xp}
            />
        </div>
    {/if}

    <div class="absolute w-full h-full">
        <Canvas>
            <Scene gridObjects={gridObjects}/>
        </Canvas>
    </div>
</div>