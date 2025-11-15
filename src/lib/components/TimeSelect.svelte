<script lang="ts">
    let minutes1 = $state("2");
    let minutes2 = $state("5");
    let seconds1 = $state("0");
    let seconds2 = $state("0");

    let {
        timeSelectOpen = $bindable(),
        pomodoroTime = $bindable() ,
        timerOpen = $bindable(),
    } = $props()

    function handleInput(e: Event, nextInput: HTMLInputElement | null) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        
        if (value.length > 1) {
            target.value = value.slice(-1);
        }

        if (value.length === 1 && nextInput) {
            nextInput.focus();
        }
    }

    function handleKeyDown(e: KeyboardEvent, prevInput: HTMLInputElement | null, nextInput: HTMLInputElement | null) {
        const target = e.target as HTMLInputElement;
        
        if (e.key === 'Backspace' && target.value === '' && prevInput) {
            prevInput.focus();
        } else if (e.key === 'ArrowLeft' && prevInput) {
            prevInput.focus();
        } else if (e.key === 'ArrowRight' && nextInput) {
            nextInput.focus();
        }
    }

    function handlePaste(e: ClipboardEvent) {
        e.preventDefault();
        const paste = e.clipboardData?.getData('text').replace(/[^0-9]/g, '');
        
        if (paste && paste.length >= 4) {
            minutes1 = paste[0] || "0";
            minutes2 = paste[1] || "0";
            seconds1 = paste[2] || "0";
            seconds2 = paste[3] || "0";
        }
    }

    function startTimer() {
        const mins = parseInt(minutes1 + minutes2);
        const secs = parseInt(seconds1 + seconds2);
        console.log(`Starting timer: ${mins}:${secs.toString().padStart(2, '0')}`);

        pomodoroTime = mins*60 + secs
        console.log(`time in seconds: ${pomodoroTime}`)
        timerOpen = true
        timeSelectOpen = false
    }

    let input1: HTMLInputElement;
    let input2: HTMLInputElement;
    let input3: HTMLInputElement;
    let input4: HTMLInputElement;

</script>

<div class="bg-transparent cursor-pointer w-full h-full flex justify-center items-center" onclick={() => timeSelectOpen = false}>
    <div class="p-5 bg-white cursor-default w-fit h-fit rounded-lg" onclick={(e) => e.stopPropagation()}>
        <h2 class="text-xl font-semibold mb-4">Adjust Time</h2>
        
        <div class="flex items-center gap-2 mb-4">
            <input 
                bind:this={input1}
                bind:value={minutes1}
                oninput={(e) => handleInput(e, input2)}
                onkeydown={(e) => handleKeyDown(e, null, input2)}
                onpaste={handlePaste}
                type="text" 
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded focus:bg-gray-100 focus:outline-none"
            />
            <input 
                bind:this={input2}
                bind:value={minutes2}
                oninput={(e) => handleInput(e, input3)}
                onkeydown={(e) => handleKeyDown(e, input1, input3)}
                type="text" 
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded focus:bg-gray-100 focus:outline-none"
            />
            <span class="text-2xl font-bold">:</span>
            <input 
                bind:this={input3}
                bind:value={seconds1}
                oninput={(e) => handleInput(e, input4)}
                onkeydown={(e) => handleKeyDown(e, input2, input4)}
                type="text" 
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded focus:bg-gray-100 focus:outline-none"
            />
            <input 
                bind:this={input4}
                bind:value={seconds2}
                oninput={(e) => handleInput(e, null)}
                onkeydown={(e) => handleKeyDown(e, input3, null)}
                type="text" 
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded focus:bg-gray-100 focus:outline-none"
            />
        </div>
        
        <button 
            onclick={startTimer}
            class="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
            Start
        </button>
    </div>
</div>