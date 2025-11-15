<script lang="ts">
    let { 
        alertOpen = $bindable(),
        resetData
    } : {
        alertOpen: boolean,
        resetData: () => void
    } = $props();
</script>

<div id="alert" class="bg-transparent w-full h-full flex justify-center items-center shadow-2xl z-50">
    <div class="bg-white p-5 w-fit h-fit rounded-4xl flex flex-col items-center">
        <h2>Are You Sure?</h2>
        <p class="font-bold text-rose-900 mb-3">You're data will be permantly deleted!</p>
        <div class="flex flex-row justify-center">
            <button onclick={() => resetData()} class="hover:bg-rose-600">Yes I'm Sure</button>
            <button onclick={() => alertOpen = false}>Actually...</button>
        </div>
    </div>
</div>