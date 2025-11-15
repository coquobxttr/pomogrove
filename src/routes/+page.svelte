<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { fade } from "svelte/transition";
    import Scene from "$lib/components/Scene.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import TimeSelect from "$lib/components/TimeSelect.svelte";
    import PomodoroEnd from "$lib/components/PomodoroEnd.svelte";
    import type { GridObject } from "$lib/types";
    import { onMount } from "svelte";
    import { load } from '@tauri-apps/plugin-store';

    let timeSelectOpen = $state(false);
    let pomodoroTime = $state(0);
    let xp = $state(0)
    let duration = $state(0);
    let timerOpen = $state(false);
    let pomodoroEndScreen = $state(false);
    let userXP = $state(0);
    let lastBlockType = $state("Grass")

    let blocks: GridObject[] = $state([
        {
            blockType: "Grass",
            unlockDate: new Date(),
            pomodoro_time: 20,
            x: 0,
            z: 0
        }
    ])

    function getRandomAdjacentPosition() {
        const randomBox = blocks[Math.floor(Math.random() * blocks.length)];
        
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
            
            const occupied = blocks.some(obj => obj.x === newX && obj.z === newZ);
            
            if (!occupied) {
                return { x: newX, z: newZ };
            }
            attempts++;
        }
        
        for (const box of blocks) {
            for (const dir of directions) {
                const newX = box.x + dir.x;
                const newZ = box.z + dir.z;
                const occupied = blocks.some(obj => obj.x === newX && obj.z === newZ);
                if (!occupied) {
                    return { x: newX, z: newZ };
                }
            }
        }
        
        //last resort
        return { x: Math.floor(Math.random() * 10) - 5, z: Math.floor(Math.random() * 10) - 5 };
    }

    function getAdjacentBlockTypes(x: number, z: number): string[] {
        const directions = [
            { x: 1, z: 0 },
            { x: -1, z: 0 },
            { x: 0, z: 1 },
            { x: 0, z: -1 }
        ];
        
        const adjacentTypes: string[] = [];
        
        for (const dir of directions) {
            const adjacentX = x + dir.x;
            const adjacentZ = z + dir.z;
            
            const adjacentBlock = blocks.find(
                obj => obj.x === adjacentX && obj.z === adjacentZ
            );
            
            if (adjacentBlock) {
                adjacentTypes.push(adjacentBlock.blockType);
            }
        }
        
        return adjacentTypes;
    }

    function addGrid(xp: number) {
        let type = "Grass";

        /*
        if (xp < 15) {
            type = "Grass";
        } else if (xp >= 15 && xp < 27) {
            type = "flower";
        } else if (xp >= 27 && xp < 36) {
            type = "bush";
        } else if (xp >= 36) {
            type = "tree";
        }
        */

        if (xp < 1) {
            const tempPosition = getRandomAdjacentPosition();
            
            // Check adjacent blocks to influence probability
            const adjacentTypes = getAdjacentBlockTypes(tempPosition.x, tempPosition.z);
            
            const grassCount = adjacentTypes.filter(t => t === "Grass").length;
            const waterCount = adjacentTypes.filter(t => t === "Water").length;
            
            // Calculate probabilities (more adjacent blocks = higher chance)
            const totalAdjacent = adjacentTypes.length;
            const grassWeight = totalAdjacent > 0 ? (grassCount + 1) * 2 : 1;
            const waterWeight = totalAdjacent > 0 ? (waterCount + 1) : 1;
            const totalWeight = grassWeight + waterWeight;
            
            const grassProbability = grassWeight / totalWeight;
            
            type = Math.random() < grassProbability ? "Grass" : "Water";
        } else if (xp >= 1 && xp < 2) {
            type = "Flower";
        } else if (xp >= 2 && xp < 3) {
            type = "Bush";
        } else if (xp >= 3) {
            type = "Tree";
        }
        
        const position = getRandomAdjacentPosition();
        
        blocks.push({
            blockType: type,
            unlockDate: new Date(),
            pomodoro_time: duration,
            x: position.x,
            z: position.z
        });

        lastBlockType = type
        console.log("last block type:", lastBlockType)

        console.log(blocks)

        saveUserData();
    }

    function onPomodoroEnd() {
        xp = Math.floor(duration / 5);
        userXP += xp
        pomodoroEndScreen = true;
        addGrid(xp); 
        
        saveUserData()
    }

    async function saveUserData() {
        const store = await load('userData.json')

        await store.set('xp', userXP)
        await store.set('blocks', blocks)
        await store.save()
        await store.close()
    }

    onMount(async() => {
        //load data from store
        const store = await load('userData.json')
        if (store) console.log("AHHHHHH")
        const storeXP = await store.get<number>('xp')
        const storeBlocks = await store.get<GridObject[]>('blocks')
        
        if (storeXP !== null && storeXP !== undefined) userXP = storeXP
        if (storeBlocks) blocks = storeBlocks

        console.log(`Loaded - userXP: ${userXP} | storeXP: ${storeXP}`)
        console.log('Loaded blocks:', blocks)

        blocks = blocks

        await store.close()
    })
</script>

<div class=" bg-linear-to-t from-indigo-200 via-red-200 to-yellow-100 w-full h-full flex flex-col">
    {#if !timerOpen}
        <div class="w-full mt-10 flex flex-col items-center z-50 pointer-events-none">
            <h1 class="text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">PomoGrove</h1>

            <!-- Bar -->
            <ul id="menuBar" class="bg-rose-100 rounded-full p-2 flex flex-row pointer-events-auto shadow-lg">
                <li class="pointer-events-none">{userXP} XP</li>
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
                blockType={lastBlockType}
            />
        </div>
    {/if}

    <div class="absolute w-full h-full">
        <Canvas>
            <Scene blocks={blocks}/>
        </Canvas>
    </div>
</div>