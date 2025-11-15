<script lang="ts">
    import { T, useTask } from '@threlte/core'
    import { interactivity, useCursor, useInteractivity } from '@threlte/extras'
    import { Spring } from 'svelte/motion'
    import { Object3D, PerspectiveCamera } from 'three';
    import {Grid} from '@threlte/extras';
    import { injectLookAtPlugin } from './lookAtPlugin.svelte';

    import Bush from '$lib/components/models/Bush.svelte';
    import Tree from '$lib/components/models/Tree.svelte';

    interactivity()
    
    let { blocks = [] } = $props()
    const { pointer } = useInteractivity()
    const camFocus = $state<[number, number, number]>([0, 0, 0])

    const gridGap = 0.15
    const boxSize = 1
    const { onPointerEnter, onPointerLeave } = useCursor()

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

    $effect(() => {
        console.log('Scene received blocks:', blocks)
    })

    useTask(() => {
        camFocus[0] = 0
        camFocus[1] = 0
        camFocus[2] = 0
    })

    useTask(() => {
        cameraPos.set({
            x: -($pointer.x * 2),
            y: 10 - ($pointer.y * 2),
            z: 10
        })
    })

    useTask(() => {
        if (camera && cameraTarget) {
            camera.lookAt(0,0,-5)
        }
    })

    let cameraTarget = $state.raw<Object3D>();
    let camera = $state.raw<PerspectiveCamera>()

    injectLookAtPlugin()
    
</script>

<T.Scene>
    <T.DirectionalLight position={[0, 100, 30]} castShadow/>
    <T.HemisphereLight intensity={0.5}/>
    
    <T.Object3D
        bind:ref={cameraTarget}
        position.x={cameraTargetPos.current.x}
        position.y={cameraTargetPos.current.y}
        position.z={cameraTargetPos.current.z}
    />

    <T.Group>
        {#each blocks as object}
            {#if object.blockType == "Grass"}
                <T.Mesh
                    position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}
                    onpointerenter={() => {
                        onPointerEnter()
                    }}
                    onpointerleave={() => {
                        onPointerLeave()
                    }}
                    castShadow
                >
                    <T.BoxGeometry args={[1, 1, 1]} />
                    <T.MeshStandardMaterial color="#d16485" />
                </T.Mesh>
            {:else if object.blockType == "Water"}
                <T.Mesh position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]} castShadow>
                    <T.BoxGeometry args={[1, 1, 1]} />
                    <T.MeshStandardMaterial color="#fa8ce4" />
                </T.Mesh>
            {:else if object.blockType == "Bush"}
                <T.Group position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}>
                    <Bush position={[0.1,0.5,0]} scale={0.8}/>
                    <T.Mesh
                        onpointerenter={() => {
                            onPointerEnter()
                        }}
                        onpointerleave={() => {
                            onPointerLeave()
                        }}
                        castShadow
                    >
                        <T.BoxGeometry args={[1, 1, 1]} />
                        <T.MeshStandardMaterial color="#d16485" />
                    </T.Mesh>
                </T.Group>
            {:else if object.blockType == "Tree"}
                <T.Group position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]}>
                    <Tree position={[-0.0025,-0.2,0]} scale={0.8} castShadow/>
                    <T.Mesh
                        onpointerenter={() => {
                            onPointerEnter()
                        }}
                        onpointerleave={() => {
                            onPointerLeave()
                        }}
                        castShadow
                    >
                        <T.BoxGeometry args={[1, 1, 1]} />
                        <T.MeshStandardMaterial color="#d16485" />
                    </T.Mesh>
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

    <Grid infiniteGrid={true} />
</T.Scene>