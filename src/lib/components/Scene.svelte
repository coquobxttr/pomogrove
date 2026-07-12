<script lang="ts">
    import { T, useTask } from '@threlte/core'
    import { Environment, interactivity, useCursor, useInteractivity, useTexture, global } from '@threlte/extras'
    import { Spring, Tween } from 'svelte/motion'
    import { EquirectangularReflectionMapping, MeshStandardMaterial, Object3D, PerspectiveCamera } from 'three';
    import { injectLookAtPlugin } from './lookAtPlugin.svelte';

    import Bush from '$lib/models/Bush.svelte';
    import Tree from '$lib/models/Tree.svelte';
    import Flower from '$lib/models/Flowers.svelte';
    import Tooltip from './Tooltip.svelte';
    import { formatTime, type GridObject } from '$lib/types';
    import { toolTipAnimDuration } from '$lib/stores/store';
    import { cubicOut } from 'svelte/easing';

    interactivity()
    
    let { blocks = [] }: {
        blocks: GridObject[]
    } = $props()
    let leftPressed = $state(false)
    let rightPressed = $state(false)
    let toolTipOpen = $state(false)

    let hoverTimer: ReturnType<typeof setTimeout> | null = null
    let isHovering = false
    let hoverBlockIndex: number | null = $state(null)
    let currentHoverBlock: number | null = null

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

    const skyTexture = useTexture('/textures/sky.jpg').then((texture) => {
        texture.mapping = EquirectangularReflectionMapping
        return texture
    })

    let cameraZoom = $state(1)

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

    const onScroll = (e: WheelEvent) => {
        const target = e.target as HTMLElement
        if (!target.tagName || target.tagName.toLowerCase() !== 'canvas') return;

        e.preventDefault()
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const zoomSpeed = 0.01;
            cameraZoom -= e.deltaY * zoomSpeed;
            cameraZoom = Math.max(0.5, Math.min(cameraZoom, 3));
        } else {
            sceneRotation += e.deltaX * 0.001
        }
    }

    useTask(() => {
        camFocus[0] = 0
        camFocus[1] = 0
        camFocus[2] = 0
    })

    useTask(() => {
        cameraPos.set({
            x: cameraZoom * -($pointer.x * 2),
            y: cameraZoom * (10 + ($pointer.y * 2)),
            z: cameraZoom * 10
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
        isHovering = true;
        currentHoverBlock = blockIndex
        onPointerEnter()

        hoverTimer = setTimeout(() => {
            if (isHovering && currentHoverBlock === blockIndex) hoverBlockIndex = blockIndex
        }, 1000);
    }

    function handlePointerLeave() {
        isHovering = false
        currentHoverBlock = null
        onPointerLeave()
        
        if (hoverTimer) {
            clearTimeout(hoverTimer);
        }
        hoverTimer = null;
        toolTipOpen = true
        setTimeout(() => {
            hoverBlockIndex = null
            toolTipOpen = false
        }, toolTipAnimDuration);
    }

    function animateScaleIn(ref: Object3D) {
        const startTime = performance.now()
        const duration = 600
        
        ref.scale.setScalar(0)
        
        const animate = () => {
            const elapsed = performance.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = cubicOut(progress)
            
            ref.scale.setScalar(easedProgress)
            
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        
        requestAnimationFrame(animate)
    }
</script>

<svelte:window
    on:keydown={onKeyDown}
    on:keyup={onKeyUp}
    on:wheel={onScroll}
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
    <Tooltip blocks={blocks} index={index} formatTime={formatTime} isExiting={toolTipOpen}/>
{/snippet}

<T.Scene>
    <T.PerspectiveCamera
        bind:ref={camera}
        position.x={cameraPos.current.x}
        position.y={cameraPos.current.y}
        position.z={cameraPos.current.z}
        lookAt={[0,0,0]}
        makeDefault
    />

    <T.Object3D
        bind:ref={cameraTarget}
        position.x={cameraTargetPos.current.x}
        position.y={cameraTargetPos.current.y}
        position.z={cameraTargetPos.current.z}
    />

    {#await skyTexture then texture}
        <Environment {texture} isBackground/>
    {/await}

    <T.Group rotation.y={sceneRotation}>
        <T.SpotLight
            position={[0,50,0]}
            intensity={10}
            decay={0}
            angle={Math.PI/4}
            color={"#f5426c"}
            castShadow
        />

        <T.AmbientLight intensity={0.5} color="#f55b0f" />
        
        <T.HemisphereLight 
            skyColor="#ff0019"
            groundColor="#b050fa"
            intensity={1}
        />


        {#each blocks as object, index (object.unlockDate.getTime() + index)}
            {#if object.blockType == "Grass"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    receiveShadow
                    oncreate={(ref) => animateScaleIn(ref)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    {@render grass(index)}
                </T.Group>
            {:else if object.blockType == "Water"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    onpointerenter={() => handlePointerEnter(index)}
                    onpointerleave={handlePointerLeave}
                    receiveShadow
                    oncreate={(ref) => animateScaleIn(ref)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    <T.Mesh>
                        <T.BoxGeometry args={[1, 1, 1]} />
                        <T.MeshStandardMaterial color="#fa8ce4" transparent opacity={0.8}/>
                    </T.Mesh>
                </T.Group>   
            {:else if object.blockType == "Bush"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    onpointerenter={() => handlePointerEnter(index)}
                    onpointerleave={handlePointerLeave}
                    oncreate={(ref) => animateScaleIn(ref)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}
                    
                    <Bush position={[0.1,0.6,0]} scale={0.8} rotation.y={object.itemRotation} castShadow/>
                    {@render grass(index)}
                </T.Group>
            {:else if object.blockType == "Tree"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    receiveShadow
                    onpointerenter={() => handlePointerEnter(index)}
                    onpointerleave={handlePointerLeave}
                    oncreate={(ref) => animateScaleIn(ref)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    <Tree position={[-0.0025,-0.2,0]} scale={0.8} rotation.y={object.itemRotation} castShadow/>
                    {@render grass(index)}
                </T.Group>
            {:else if object.blockType == "Flower"}
                <T.Group
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    receiveShadow
                    onpointerenter={() => handlePointerEnter(index)}
                    onpointerleave={handlePointerLeave}
                    oncreate={(ref) => animateScaleIn(ref)}
                >
                    {#if hoverBlockIndex === index}
                        {@render toolTip(index)}
                    {/if}

                    <Flower position={[0,0.3,0]} scale={0.3} rotation.y={object.itemRotation} castShadow/>
                    {@render grass(index)}
                </T.Group>
            {/if}
        {/each}
    </T.Group>
</T.Scene>