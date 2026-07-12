<script lang="ts">
    let min1 = $state("2");
    let min2 = $state("5");
    let sec1 = $state("0");
    let sec2 = $state("0");

    let {
        timeSelectOpen = $bindable(),
        pomodoroTime = $bindable() ,
        timerOpen = $bindable(),
        breakTotalCount = $bindable()
    } = $props()

    function handleFocus(e: FocusEvent) {
        const target = e.target as HTMLInputElement;
        target.select();
    }

    function handleInput(e: Event, nextInput: HTMLInputElement | null) {
        const target = e.target as HTMLInputElement;
        let value = target.value;
        
        value = value.replace(/[^0-9]/g, '');
        
        if (value.length > 1) {
            value = value.slice(-1);
        }
        
        target.value = value;

        if (value.length === 1 && nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }

    function handleKeyDown(e: KeyboardEvent, prevInput: HTMLInputElement | null, nextInput: HTMLInputElement | null) {
        if (e.key === 'Enter') {
            startTimer()
            return;
        }
        const target = e.target as HTMLInputElement;
        
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
        if (!allowedKeys.includes(e.key) && (e.key < '0' || e.key > '9')) {
            e.preventDefault();
            return;
        }
        
        if (e.key === 'Backspace' && target.value === '' && prevInput) {
            prevInput.focus();
            prevInput.select();
        } else if (e.key === 'ArrowLeft' && prevInput) {
            e.preventDefault();
            prevInput.focus();
            prevInput.select();
        } else if (e.key === 'ArrowRight' && nextInput) {
            e.preventDefault();
            nextInput.focus();
            nextInput.select();
        }
    }

    function handlePaste(e: ClipboardEvent) {
        e.preventDefault();
        const paste = e.clipboardData?.getData('text').replace(/[^0-9]/g, '');
        
        if (paste && paste.length >= 4) {
            min1 = paste[0] || "0";
            min2 = paste[1] || "0";
            sec1 = paste[2] || "0";
            sec2 = paste[3] || "0";
        }
    }

    function startTimer() {
        const mins = parseInt(min1 + min2);
        const secs = parseInt(sec1 + sec2);

        pomodoroTime = mins*60 + secs
        timerOpen = true
        timeSelectOpen = false
    }

    let input1: HTMLInputElement;
    let input2: HTMLInputElement;
    let input3: HTMLInputElement;
    let input4: HTMLInputElement;
    let breakInput: HTMLInputElement;

</script>

<div class="backdrop-blur-xs bg-rose-300/20 cursor-pointer w-full h-full flex justify-center items-center pointer-events-auto" onclick={() => timeSelectOpen = false}>
    <div class="flex flex-col items-center p-5 bg-transparent shadow-2xl cursor-default w-fit h-fit rounded-xl" onclick={(e) => e.stopPropagation()}>
        <h2 class="text-2xl text-white text-shadow-lg font-semibold mb-4">Adjust Timer</h2>
        
        <div class="flex items-center gap-2 mb-4 pointer-events-auto" onkeydown={(e) => handleKeyDown(e, null, null)}>
            <input 
                bind:this={input1}
                bind:value={min1}
                oninput={(e) => handleInput(e, input2)}
                onkeydown={(e) => handleKeyDown(e, null, input2)}
                onfocus={handleFocus}
                onpaste={handlePaste}
                type="text" 
                inputmode="numeric"
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded bg-white/25 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none border-rose-300 transition"
            />
            <input 
                bind:this={input2}
                bind:value={min2}
                oninput={(e) => handleInput(e, input3)}
                onkeydown={(e) => handleKeyDown(e, input1, input3)}
                onfocus={handleFocus}
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded bg-white/25 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none border-rose-300 transition"
            />
            <span class="text-2xl font-bold">:</span>
            <input 
                bind:this={input3}
                bind:value={sec1}
                oninput={(e) => handleInput(e, input4)}
                onkeydown={(e) => handleKeyDown(e, input2, input4)}
                onfocus={handleFocus}
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded bg-white/25 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none border-rose-300 transition"
            />
            <input 
                bind:this={input4}
                bind:value={sec2}
                oninput={(e) => handleInput(e, null)}
                onkeydown={(e) => handleKeyDown(e, input3, null)}
                onfocus={handleFocus}
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-12 h-12 text-center text-2xl rounded bg-white/25 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none border-rose-300 transition"
            />
        </div>

        <h3>How Many Breaks Do You Want?</h3>

        <input 
            bind:this={breakInput}
            bind:value={breakTotalCount}
            type="text" 
            inputmode="numeric"
            maxlength="2"
            class="w-12 h-12 text-center text-2xl rounded bg-white/25 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none border-rose-300 transition"
        />
        
        <button 
            onclick={startTimer}
            class="w-full bg-rose-200/25 hover:bg-rose-300/25 text-white font-semibold py-2 px-4 rounded transition-colors pointer-events-auto border-rose-300 text-shadow cursor-pointer"
        >
            Start
        </button>
    </div>
</div>