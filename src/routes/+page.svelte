<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { fade } from "svelte/transition";
    import Scene from "$lib/components/Scene.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import TimeSelect from "$lib/components/TimeSelect.svelte";
    import PomodoroEnd from "$lib/components/PomodoroEnd.svelte";
    import Settings from "$lib/components/Settings.svelte";
    import type { GridObject } from "$lib/types";
    import { onMount } from "svelte";
    import { load } from '@tauri-apps/plugin-store';
    import Alert from "$lib/components/DeleteDataAlert.svelte";
    import type { Store } from "@tauri-apps/plugin-store";
    import { initAudio } from "$lib/stores/audio.svelte";

    let timeSelectOpen = $state(false);
    let settingsOpen = $state(false);
    let deleteDataAlert = $state(false)
    let pomodoroTime = $state(0);
    let duration = $state(0);
    let timerOpen = $state(false);
    let pomodoroEndScreen = $state(false);
    let userXP = $state(0);
    let sessionXP = $state(0)
    let lastBlockType = $state("Grass")
    let completedTasks = $state(0)
    let totalTasks = $state(0)
    let pomodoroDataSent = $state(false)
    let breakTotalCount = $state(0)

    let store: Store | null = $state(null)

    let blocks: GridObject[] = $state([
        {
            blockType: "Grass",
            unlockDate: new Date(),
            pomodoroTime: 0,
            x: 0,
            z: 0,
            itemRotation: null
        }
    ])
    let parsedBlocks: GridObject[];

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

    function grassOrWater() {
        const tempPosition = getRandomAdjacentPosition();
        
        const adjacentTypes = getAdjacentBlockTypes(tempPosition.x, tempPosition.z);
        
        const grassCount = adjacentTypes.filter(t => t === "Grass").length;
        const waterCount = adjacentTypes.filter(t => t === "Water").length;
        
        const totalAdjacent = adjacentTypes.length;
        const grassWeight = totalAdjacent > 0 ? (grassCount + 1) * 1.05 : 1;
        const waterWeight = totalAdjacent > 0 ? (waterCount + 1) : 1;
        const totalWeight = grassWeight + waterWeight;
        
        const grassProbability = grassWeight / totalWeight;
        
        return Math.random() < grassProbability ? "Grass" : "Water";
    }

    function addBlockToGrid(type: string) {
        const position = getRandomAdjacentPosition();
        
        blocks.push({
            blockType: type,
            unlockDate: new Date(),
            pomodoroTime: duration,
            x: position.x,
            z: position.z,
            itemRotation: type === "Grass" || type === "Water" ? null : Math.random() * 2 * Math.PI
        });

        lastBlockType = type
    }

    function placeBlocks() {
        let type = "Grass";

        if (duration < 300) {
            type = grassOrWater()
            addBlockToGrid(type)
        } else if (duration >= 300 && duration < 600) {
            type = grassOrWater()
            addBlockToGrid(type)

            type = "Flower";
            addBlockToGrid(type)
        } else if (duration >= 600 && duration < 900) {
            for (let i = 0; i < 2; i++) {
                type = grassOrWater()
                addBlockToGrid(type)
            }

            type = Math.random() > 0.5 ? "Bush" : "Flower"
            addBlockToGrid(type)
        } else if (duration >= 900 && duration < 1200) {
            for (let i = 0; i < 2; i++) {
                type = grassOrWater()
                addBlockToGrid(type)
            }
            type = "Bush"
            addBlockToGrid(type)
        } else if (duration >= 1200 && duration < 1500) {
            for (let i = 0; i < 3; i++) {
                type = grassOrWater()
                addBlockToGrid(type)
            }

            type = "Tree"
            addBlockToGrid(type)
        } else if (duration >= 1500) {
            for (let i = 0; i < 3; i++) {
                type = grassOrWater()
                addBlockToGrid(type)
            }

            for (let i = 0; i< 2; i++) {
                type = Math.random() > 0.5 ? "Bush" : "Flower"
                addBlockToGrid(type)
            }

            type = "Tree"
            addBlockToGrid(type)
        }

        saveUserData();
    }

    async function onPomodoroEnd(compTasks: number, totTasks: number) {
        pomodoroEndScreen = true;
        sessionXP = Math.floor(duration / 100);
        userXP += sessionXP
        placeBlocks(); 

        completedTasks = compTasks
        totalTasks = totTasks
        
        saveUserData()
    }

    async function resetData() {
        deleteDataAlert = false

        if (!store) return

        userXP = 0
        blocks = [
            {
                blockType: "Grass",
                unlockDate: new Date(),
                pomodoroTime: 20,
                x: 0,
                z: 0,
                itemRotation: null
            }
        ]

        await store.clear()
        await store.save()
    }

    async function saveUserData() {
        if (store) {
            await store.set('sessionXP', userXP)
            await store.set('blocks', blocks)
            await store.save()
        } 
    }

    onMount(async() => {
        store = await load('userData.json')
        const storesessionXP = await store.get<number>('sessionXP')
        const storeBlocks = await store.get<GridObject[]>('blocks')
        
        if (storesessionXP !== null && storesessionXP !== undefined) userXP = storesessionXP
        if (storeBlocks) {
            blocks = storeBlocks

            parsedBlocks = blocks.map((b: any) => ({
                ...b,
                unlockDate:
                typeof b.unlockDate === 'string' ? new Date(b.unlockDate) : b.unlockDate
            }));
        }

        if (parsedBlocks) blocks = parsedBlocks

        initAudio()
    })
</script>

<div class="w-full h-full flex flex-col items-center pointer-events-none">
    {#if !timerOpen && !pomodoroEndScreen}
        <div class="w-fit pt-10 px-5 rounded-b-4xl flex flex-col items-center z-50 pointer-events-none shadow-lg">
            <h1 class="text-white text-shadow mb-0">PomoGrove</h1>
            <div class="w-full flex">
                <p id="homeText" class="w-full text-right font-semibold mr-3">{__APP_VERSION__}</p>
            </div>

            <!-- Bar -->
            <ul id="menuBar">
                <li class="pointer-events-none">{userXP} XP</li>
                <li class="pointer-events-auto" onclick={() => timeSelectOpen = !timeSelectOpen}>Start</li>
                <li class="pointer-events-auto" onclick={() => settingsOpen = true}>Settings</li>
            </ul>

            <p id="homeText" class="absolute bottom-0 pb-5">Press Arrow Keys/A & D to Rotate or Use Your Trackpad</p>
        </div>
    {/if}

    {#if timeSelectOpen}
        <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full">
            <TimeSelect
                bind:timeSelectOpen={timeSelectOpen}
                bind:pomodoroTime={pomodoroTime}
                bind:timerOpen={timerOpen}
                bind:breakTotalCount={breakTotalCount}
            />
        </div>
    {/if}

    {#if timerOpen}
        <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full">
            <Timer
                bind:time={pomodoroTime}
                bind:timerOpen={timerOpen}
                bind:duration={duration}
                bind:pomodoroDataSent={pomodoroDataSent}
                bind:pomodoroEndScreen={pomodoroEndScreen}
                breakTotalCount={breakTotalCount}
                onPomodoroEnd={onPomodoroEnd}
            />
        </div>
    {/if}

    {#if pomodoroEndScreen && pomodoroDataSent}
         <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full pointer-events-auto">
            <PomodoroEnd
                bind:pomodoroEndScreen={pomodoroEndScreen}
                bind:pomodoroDataSent={pomodoroDataSent}
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                time={duration}
                blockType={lastBlockType}
            />
        </div>
    {/if}

    {#if settingsOpen}
        <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full pointer-events-auto">
            <Settings bind:settingsOpen={settingsOpen} bind:deleteDataAlert={deleteDataAlert} xp={userXP} blocks={blocks}/>
        </div>
    {/if}

    {#if deleteDataAlert}
        <div transition:fade={{ duration: 250 }} class="absolute z-50 w-full h-full pointer-events-auto">
            <Alert bind:alertOpen={deleteDataAlert} resetData={resetData}/>
        </div>
    {/if}

    <div class="absolute w-full h-full pointer-events-auto">
        <Canvas shadows>
            <Scene blocks={blocks}/>
        </Canvas>
    </div>
</div>