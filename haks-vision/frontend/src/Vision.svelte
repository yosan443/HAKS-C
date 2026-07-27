<script lang="ts">
  import { onMount, tick } from "svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { LucideImage, LucideRefreshCcw, LucideSend } from "lucide-svelte";

  interface Screenshot { path: string; data_url: string; }

  let latestImagePath = $state<string | null>(null);
  let lastImageSrc = $state<string | null>(null);
  let isLoadingMode = $state(false);
  let errorMessage = $state<string | null>(null);
  let prompt = $state("");
  let chatHistory = $state<{ role: string; text: string }[]>([]);
  let isGenerating = $state(false);
  let currentStreamingText = $state("");
  let chatContainer: HTMLElement;

  interface Knowledge { id: string; name: string; }
  let knowledgeBases = $state<Knowledge[]>([]);
  let selectedKnowledgeId = $state("");

  async function refreshImage() {
    isLoadingMode = true;
    errorMessage = null;
    try {
      const screenshot = await invoke<Screenshot>("get_latest_screenshot");
      latestImagePath = screenshot.path;
      lastImageSrc = screenshot.data_url;
    } catch (e) {
      errorMessage = e as string;
      latestImagePath = null;
      lastImageSrc = null;
    } finally {
      isLoadingMode = false;
    }
  }

  function scrollToBottom() {
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function sendQuestion() {
    if (!prompt.trim() || isGenerating) return;
    const userPrompt = prompt;
    prompt = "";
    isGenerating = true;
    currentStreamingText = "";
    chatHistory = [...chatHistory, { role: "user", text: userPrompt }];
    await tick();
    scrollToBottom();

    let messages = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    try {
      await invoke("chat_with_gemini", {
        messages,
        systemPrompt: "You are a helpful assistant analyzing a screenshot. Be concise.",
        knowledgeId: selectedKnowledgeId || null,
        imagePath: latestImagePath,
      });
    } catch (e) {
      chatHistory = [...chatHistory, { role: "model", text: `Error: ${e}` }];
      isGenerating = false;
    }
  }

  onMount(async () => {
    try { knowledgeBases = await invoke("list_knowledge"); } catch (err) {}
    refreshImage();
    const unlisten = await listen<any>("chat-chunk", (event) => {
      const { text, done, error } = event.payload;
      if (error) {
        chatHistory = [...chatHistory, { role: "model", text: `Error: ${error}` }];
        isGenerating = false;
        currentStreamingText = "";
      } else if (done) {
        if (currentStreamingText) chatHistory = [...chatHistory, { role: "model", text: currentStreamingText }];
        isGenerating = false;
        currentStreamingText = "";
      } else {
        currentStreamingText += text;
      }
      tick().then(scrollToBottom);
    });
  });
</script>

<div class="flex flex-col h-screen bg-[#1c1c1c] text-white font-sans overflow-hidden border border-white/10">
  <header class="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#252525] shrink-0">
    <div class="flex items-center gap-2">
      <LucideImage class="text-blue-400" size={18} />
      <h1 class="text-xs font-bold uppercase tracking-wider text-gray-300">Vision Scanner</h1>
    </div>
    <button onclick={refreshImage} class="text-gray-400 hover:text-white transition-colors">
      <LucideRefreshCcw size={16} class={isLoadingMode ? "animate-spin" : ""} />
    </button>
  </header>

  <div class="px-4 py-2 border-b border-white/5 bg-[#202020] flex items-center gap-2 shrink-0">
    <span class="text-[10px] text-gray-500 font-bold uppercase">Knowledge:</span>
    <select bind:value={selectedKnowledgeId} class="bg-transparent text-[10px] text-gray-400 focus:outline-none cursor-pointer hover:text-white flex-1">
      <option value="" class="bg-[#2a2a2a]">None (Fresh Analysis)</option>
      {#each knowledgeBases as kb}
        <option value={kb.id} class="bg-[#2a2a2a]">{kb.name}</option>
      {/each}
    </select>
  </div>

  <main class="flex-1 flex flex-col overflow-hidden">
    <div class="flex-1 bg-black/40 flex items-center justify-center relative p-4 overflow-hidden border-b border-white/5 min-h-0">
      {#if lastImageSrc}
        <img src={lastImageSrc} alt="Latest Screenshot" class="max-w-full max-h-full object-contain shadow-lg rounded-md" />
      {:else if errorMessage}
        <div class="text-center text-red-400 text-xs"><p>{errorMessage}</p></div>
      {:else}
        <div class="text-center space-y-2 opacity-30"><LucideImage size={48} class="mx-auto" /><p class="text-xs">No image loaded</p></div>
      {/if}
    </div>

    <div class="h-64 flex flex-col bg-[#1e1e1e] shrink-0">
      <div bind:this={chatContainer} class="flex-1 overflow-y-auto p-4 space-y-3">
        {#if chatHistory.length === 0}
          <div class="text-center text-gray-500 text-xs mt-4"><p>Ask a question about the image above.</p></div>
        {/if}
        {#each chatHistory as msg}
          <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap {msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200'}">{msg.text}</div>
          </div>
        {/each}
        {#if currentStreamingText}
          <div class="flex justify-start animate-pulse"><div class="max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed bg-white/10 text-gray-200 whitespace-pre-wrap">{currentStreamingText}</div></div>
        {/if}
        {#if isGenerating && !currentStreamingText}
          <div class="flex justify-start"><div class="text-xs text-gray-500 italic">Thinking...</div></div>
        {/if}
      </div>

      <div class="p-3 border-t border-white/10 bg-[#252525] flex gap-2">
        <input type="text" bind:value={prompt} onkeydown={(e) => e.key === "Enter" && !e.shiftKey && sendQuestion()}
          placeholder={lastImageSrc ? "Ask about this screenshot..." : "No image selected"}
          disabled={!lastImageSrc || isGenerating}
          class="flex-1 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 disabled:opacity-50" />
        <button onclick={sendQuestion} disabled={!lastImageSrc || isGenerating || !prompt.trim()}
          class="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white transition-colors">
          <LucideSend size={16} />
        </button>
      </div>
    </div>
  </main>
</div>
