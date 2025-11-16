<script lang="ts">
    import { T, useTask } from '@threlte/core'
    import { HTML, interactivity, transitions, useCursor, useInteractivity, useTexture } from '@threlte/extras'
    import { Spring } from 'svelte/motion'
    import { Group, MeshStandardMaterial, Object3D, PerspectiveCamera } from 'three';
    import { injectLookAtPlugin } from './lookAtPlugin.svelte';
    import { scale } from '$lib/transitions/scale';
    import { scale as htmlScale } from 'svelte/transition';

    import Bush from '$lib/components/models/Bush.svelte';
    import Tree from '$lib/components/models/Tree.svelte';
    import Flower from '$lib/components/models/Flowers.svelte';
    import { formatTime } from '$lib/types';

    interactivity()
    transitions()
    
    let { blocks = [] } = $props()
    let leftPressed = $state(false)
    let rightPressed = $state(false)

    let hoverTimer: ReturnType<typeof setTimeout> | null = null
    let hoverBlockIndex: number | null = $state(null)

    const { pointer } = useInteractivity()
    let sceneRotation = $state(0)
    const rotationSpeed = 0.02
    const camFocus = $state<[number, number, number]>([0, 0, 0])

    const gridGap = 0.15
    const boxSize = 1
    const { onPointerEnter, onPointerLeave } = useCursor()

    const grassSide = useTexture('textures/grassSide.png')
    const grassTop = useTexture('textures/grassTop.png')
    const grassBottom = useTexture('textures/grassBottom.png')

    const grassTextures = Promise.all([$grassSide, $grassTop, $grassBottom])

    grassTextures.then(() => {
        console.log('All grass textures loaded')
    }).catch(err => {
        console.error('Texture loading error:', err)
    })

    const cameraTargetPos = new Spring(
        {
            x: 0,
            y: 1,
            z: 0
        },
        {
            precision: 0.000001
        }
    )

    const cameraPos = new Spring(
        {
            x: 0,
            y: 15,
            z: 20
        },
        {  
            stiffness: 0.05,
            damping: 0.9,
            precision: 0.00001
        }
    )

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            e.preventDefault()
            leftPressed = true
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            e.preventDefault()
            rightPressed = true
        }
    }

    const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            e.preventDefault()
            leftPressed = false
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            e.preventDefault()
            rightPressed = false
        }
    }

    useTask(() => {
        camFocus[0] = 0
        camFocus[1] = 0
        camFocus[2] = 0
    })

    useTask(() => {
        cameraPos.set({
            x: -($pointer.x * 2),
            y: 10 + ($pointer.y * 2),
            z: 10
        })
    })

    useTask(() => {
        if (camera && cameraTarget) {
            camera.lookAt(0,0,-5)
        }
    })

    useTask(() => {
        if (leftPressed) {
            sceneRotation += rotationSpeed
        }

        if (rightPressed) {
            sceneRotation -= rotationSpeed
        }
    })

    let cameraTarget = $state.raw<Object3D>();
    let camera = $state.raw<PerspectiveCamera>()

    injectLookAtPlugin()

    function handlePointerEnter(blockIndex: number) {
        onPointerEnter()

        hoverTimer = setTimeout(() => {
            hoverBlockIndex = blockIndex
        }, 1000);
    }

    function handlePointerLeave() {
        onPointerLeave()
        
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
        
        hoverBlockIndex = null
    }
</script>

<svelte:window
    on:keydown={onKeyDown}
    on:keyup={onKeyUp}
/>

{#snippet grass(index: number)}
    {#await Promise.all([grassSide, grassTop, grassBottom]) then textures}
        <T.Mesh
            onpointerenter={() => handlePointerEnter(index)}
            onpointerleave={handlePointerLeave}
            receiveShadow
            material={[
                new MeshStandardMaterial({ map: textures[0] }),
                new MeshStandardMaterial({ map: textures[0] }),
                new MeshStandardMaterial({ map: textures[1] }),
                new MeshStandardMaterial({ map: textures[2] }),
                new MeshStandardMaterial({ map: textures[0] }),
                new MeshStandardMaterial({ map: textures[0] })
                ]}
            >
            <T.BoxGeometry args={[1, 1, 1]} />
        </T.Mesh>
    {/await}
{/snippet}

{#snippet toolTip(index: number)}
    <HTML center position={[0,2,0]}>
        <div id="blockTooltip" class="flex flex-row relative bg-white rounded-lg px-4 py-2 shadow-lg w-fit" transition:htmlScale>
            <p>{blocks[index].blockType} Block</p>
            <div class="flex flex-col">
                <p>Session Duration: {formatTime(blocks[index].pomodoroTime)}</p>
                <p>Unlock Date: {blocks[index].unlockDate.toLocaleString()}</p>
            </div>
                            
            <div class="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 
                border-l-8 border-l-transparent 
                border-r-8 border-r-transparent 
                border-t-8 border-t-white"
            >
            </div>
        </div>
    </HTML>
{/snippet}

<T.Scene>
    <T.DirectionalLight 
        position={[50, 50, 50]}
        intensity={1.5}
        color="#ffffeb"
        castShadow
        shadow.mapSize.width={2048}
        shadow.mapSize.height={2048}
        shadow.camera.left={-50}
        shadow.camera.right={50}
        shadow.camera.top={50}
        shadow.camera.bottom={-50}
        shadow.camera.near={0.5}
        shadow.camera.far={200}
    />
    
    <T.AmbientLight intensity={0.4} color="#fda4af" />
    
    <T.HemisphereLight 
        skyColor="#fefce8"
        groundColor="#c7d2fe"
        intensity={1}
    />
    
    <T.DirectionalLight 
        position={[-30, 20, -30]}
        intensity={5}
        color="#ffddaa"
    />
    
    <T.Object3D
        bind:ref={cameraTarget}
        position.x={cameraTargetPos.current.x}
        position.y={cameraTargetPos.current.y}
        position.z={cameraTargetPos.current.z}
    />

    <T.Group rotation.y={sceneRotation}>
        {#each blocks as object, index}
            {#if object.blockType == "Grass"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    receiveShadow
                    transition={scale(0)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    {@render grass(index)}
                </T.Group>
            {:else if object.blockType == "Water"}
                <T.Group position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}>
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    <T.Mesh
                        receiveShadow
                        onpointerenter={() => handlePointerEnter(index)}
                        onpointerleave={handlePointerLeave}
                        transition={scale(0)}
                    >
                        <T.BoxGeometry args={[1, 1, 1]} />
                        <T.MeshStandardMaterial color="#fa8ce4" transparent opacity={0.8}/>
                    </T.Mesh>
                </T.Group>
                
            {:else if object.blockType == "Bush"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    onpointerenter={() => handlePointerEnter(index)}
                    onpointerleave={handlePointerLeave}
                    transition={scale(0)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}
                    
                    <Bush position={[0.1,0.6,0]} scale={0.8} castShadow/>
                    {@render grass(index)}
                </T.Group>
            {:else if object.blockType == "Tree"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    receiveShadow
                    onpointerenter={() => handlePointerEnter(index)}
                    onpointerleave={handlePointerLeave}
                    transition={scale(0)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    <Tree position={[-0.0025,-0.2,0]} scale={0.8} castShadow/>
                    {@render grass(index)}
                </T.Group>
            {:else if object.blockType == "Flower"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    receiveShadow
                    onpointerenter={() => handlePointerEnter(index)}
                    onpointerleave={handlePointerLeave}
                    transition={scale(0)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    <Flower position={[0,0.3,0]} scale={0.3} castShadow/>
                    {@render grass(index)}
                </T.Group>
            {/if}
        {/each}
    </T.Group>
    
    <T.PerspectiveCamera
        bind:ref={camera}
        position.x={cameraPos.current.x}
        position.y={cameraPos.current.y}
        position.z={cameraPos.current.z}
        lookAt={[0,0,0]}
        makeDefault
    />

    <!--
    <Grid infiniteGrid={true} />
    -->
</T.Scene>