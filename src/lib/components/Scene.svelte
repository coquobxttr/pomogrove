<script lang="ts">
    import { T, useTask } from '@threlte/core'
    import { interactivity, useInteractivity } from '@threlte/extras'
    import { Spring } from 'svelte/motion'
    import { Object3D, PerspectiveCamera } from 'three';
    import {Grid} from '@threlte/extras';
    import { injectLookAtPlugin } from './lookAtPlugin.svelte';

    interactivity()
    
    const { pointer } = useInteractivity()
    const camFocus = $state<[number, number, number]>([0, 0, 0])

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
            x: 20,
            y: 20,
            z: 15  // Start closer to see the effect
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
            x: -($pointer.x * 1),  // Increased multiplier to see movement
            y: 5 + ($pointer.y * 1),
            z: 20
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
    <T.DirectionalLight position={[0, 0, 0]} intensity={3}/>
    <T.HemisphereLight intensity={0.5}/>

    <T.Object3D
        bind:ref={cameraTarget}
        position.x={cameraTargetPos.current.x}
        position.y={cameraTargetPos.current.y}
        position.z={cameraTargetPos.current.z}
    />

    <T.Mesh position.y={1}>
        <T.BoxGeometry args={[1, 1, 1]} />
        <T.MeshBasicMaterial color="green" />
    </T.Mesh>

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