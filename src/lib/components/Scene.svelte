<script lang="ts">
    import { T, useTask } from '@threlte/core'
    import { interactivity, useInteractivity } from '@threlte/extras'
    import { Spring } from 'svelte/motion'
    import { Object3D, PerspectiveCamera } from 'three';
    import {Grid} from '@threlte/extras';
    import { injectLookAtPlugin } from './lookAtPlugin.svelte';

    interactivity()
    
    let { gridObjects } = $props()
    const { pointer } = useInteractivity()
    const camFocus = $state<[number, number, number]>([0, 0, 0])

    const gridGap = 0.15
    const boxSize = 1

    // Target stays at origin (or wherever you want to look)
    const cameraTargetPos = new Spring(
        {
            x: 0,
            y: 1,  // Looking at the box
            z: 0
        },
        {
            precision: 0.000001
        }
    )

    const cameraPos = new Spring(
        {
            x: 0,
            y: 20,
            z: 40  // Start closer to see the effect
        },
        {  
            stiffness: 0.05,
            damping: 0.9,
            precision: 0.00001
        }
    )

    useTask(() => {
        camFocus[0] = 0
        camFocus[1] = 0
        camFocus[2] = 0
    })

    useTask(() => {
        cameraPos.set({
            x: -($pointer.x * 1.5),  // Increased multiplier to see movement
            y: 20 + ($pointer.y * 1.5),
            z: 40
        })
    })

    // Add this effect to make the camera look at the target
    useTask(() => {
        if (camera && cameraTarget) {
            camera.lookAt(0,0,0)
        }
    })

    let cameraTarget = $state.raw<Object3D>();
    let camera = $state.raw<PerspectiveCamera>()

    injectLookAtPlugin()
    
</script>

<T.Scene>
    <T.DirectionalLight position={[0, 100, 30]} castShadow/>

    <T.Object3D
        bind:ref={cameraTarget}
        position.x={cameraTargetPos.current.x}
        position.y={cameraTargetPos.current.y}
        position.z={cameraTargetPos.current.z}
    />

    <!-- position green blocks corresponding to the 2d array -->

    <T.Group>
        {#each gridObjects as object}
            <T.Mesh position={[object.x * (boxSize + gridGap), 1, object.z * (boxSize + gridGap)]} castShadow>
                <T.BoxGeometry args={[1, 1, 1]} />
                <T.MeshStandardMaterial color="green" />
            </T.Mesh>
        {/each}
    </T.Group>
    
    <T.PerspectiveCamera
        bind:ref={camera}
        position.x={cameraPos.current.x}
        position.y={cameraPos.current.y}
        position.z={cameraPos.current.z}
        lookAt={[0,0,0]}
        fov={30}
        makeDefault
    />

    <Grid infiniteGrid={true} />
</T.Scene>