<script lang="ts">
    let { 
        alertOpen = $bindable(),
        resetData
    } : {
        alertOpen: boolean,
        resetData: () => void
    } = $props();
</script>

<div id="alert" class="backdrop-blur-sm bg-black/20 w-full h-full flex justify-center items-center shadow-2xl z-50 cursor-pointer" onclick={() => alertOpen = false}>
    <div class="bg-white/25 p-5 w-fit h-fit rounded-4xl flex flex-col items-center cursor-default">
        <h2>Are You Sure?</h2>
        <p class="font-bold text-rose-900 mb-3">You're data will be permantly deleted!</p>
        <div class="flex flex-row justify-center">
            <button onclick={() => resetData()} class="hover:bg-red-500/25">Yes I'm Sure</button>
            <button onclick={() => alertOpen = false}>Actually...</button>
        </div>
    </div>
</div>