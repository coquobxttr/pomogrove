<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "$lib/components/Scene.svelte";
    import Timer from "$lib/components/Timer.svelte";
</script>

<div class="bg-blue-200 w-full h-full flex flex-col">
    <div class="w-full mt-10 flex flex-col items-center z-50">
        <h1>PromoGrove</h1>

        <!-- Bar -->
        <ul id="menuBar" class="bg-pink-100 rounded-full p-2 flex flex-row">
            <li>0 XP</li>
            <li>Start</li>
            <li>Settings</li>
        </ul>
    </div>

    <div class="absolute w-full h-full">
        <Canvas>
            <Scene/>
        </Canvas>
    </div>
    
</div>