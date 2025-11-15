<script lang="ts">
    import { open } from '@tauri-apps/plugin-shell';

    let { 
        settingsOpen = $bindable(),
        deleteDataAlert = $bindable()
    } = $props()

    async function openREADME() {
        await open('https://github.com/coquobxttr/pomogrove/blob/dev/README.md');
    }
</script>

<div class="backdrop-blur-sm cursor-pointer w-full h-full flex justify-center items-center shadow-2xl shadow-rose-300 z-40" onclick={() => settingsOpen = false}>
    <div class="p-5 bg-white cursor-default w-fit h-fit rounded-xl" onclick={(e) => e.stopPropagation()}>
        <h2 class="font-bold mb-4 px-5">Settings</h2>

        <ul id="settings">
            <li onclick={() => deleteDataAlert = true}>Reset Progress</li>
            <li>Stats Display</li>
            <li>Toggle Sound</li>
            <li onclick={openREADME}>About/Credits</li>
        </ul>
    </div>
</div>