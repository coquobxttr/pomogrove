<script lang="ts">
    import { toolTipAnimDuration } from "$lib/stores/store";
    import { HTML } from "@threlte/extras";
    import { transitions } from "@threlte/extras";
    import { onMount } from "svelte";
    import { Tween } from "svelte/motion";

    transitions();

    let { blocks, index, formatTime, isExiting = false } = $props()

    let scale = new Tween(0, {
        duration: toolTipAnimDuration
    })

    let opacity = new Tween(0, {
        duration: toolTipAnimDuration
    })

    $effect(() => {
        if (isExiting) {
            scale.target = 0.9
            opacity.target = 0
        }
    })

    onMount(() => {
        scale.target = 1
        opacity.target = 100
    })
</script>

<HTML center position={[0,2,0]}>
    <div id="blockTooltip" style={`scale: ${scale.current}; opacity: ${opacity.current}%`} class="relative bg-white/25 backdrop-blur-xs rounded-lg px-4 py-2 opacity-50">
        <h6 class="my-0 p-1">{blocks[index].blockType} Block</h6>
        <p class="text-[10px] text-rose-400">{index === 0 ? 'This is Your First Block!' : ''}</p>
        <div class="flex flex-row">
            <p>Session Duration: {formatTime(blocks[index].pomodoroTime)}</p>
            <p>Unlock Date: {blocks[index].unlockDate.toLocaleDateString()}</p>
        </div>
        
                        
        <div class="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 
            border-l-8 border-l-transparent 
            border-r-8 border-r-transparent 
            border-t-8 border-t-white/25"
        >
        </div>
    </div>
</HTML>