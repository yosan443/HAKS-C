<script lang="ts">
  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { LucideSend, LucideBot, LucideUser, LucideLoader2, LucideDatabase } from "lucide-svelte";
  import { Marked } from "marked";
  import markedKatex from "marked-katex-extension";
  import DOMPurify from "dompurify";
  import "katex/dist/katex.min.css";

  const marked = new Marked();
  marked.use(markedKatex({ throwOnError: false, displayMode: false }));

  interface Message {
    role: "user" | "model";
    parts: { text: string }[];
  }

  interface ChatChunk {
    text: string;
    done: boolean;
    error?: string;
  }

  interface Knowledge {
    id: string;
    name: string;
  }

  let messages = $state<Message[]>([]);
  let userInput = $state("");
  let isTyping = $state(false);
  let chatViewport: HTMLElement | null = $state(null);
  let knowledgeBases = $state<Knowledge[]>([]);
  let selectedKnowledgeId = $state("");

  function scrollToBottom(behavior: ScrollBehavior = "auto") {
    if (chatViewport) {
      setTimeout(() => {
        chatViewport?.scrollTo({ top: chatViewport.scrollHeight, behavior });
      }, 0);
    }
  }

  function renderMarkdown(text: string) {
    if (!text) return "";
    try {
      const normalized = text
        .replace(/\\\[/g, "$$$$")
        .replace(/\\\]/g, "$$$$")
        .replace(/\\\(/g, "$$")
        .replace(/\\\)/g, "$$");
      const rawHtml = marked.parse(normalized) as string;
      return DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: ["math","annotation","semantics","mtext","mn","mo","mi","mspace","mover","munder","msubsup","msub","msup","mfrac","msqrt","mroot","mtable","mtr","mtd","mrow","menclose","mstyle","mpadded","mphantom","v-none","svg","path","line","rect","circle","span","base","use"],
        ADD_ATTR: ["display","xmlns","class","style","viewbox","d","x","y","width","height","fill","stroke","stroke-width","xlink:href","points","r","cx","cy","aria-hidden"],
        USE_PROFILES: { html: true, mathMl: true, svg: true },
      });
    } catch (e) {
      console.error("Markdown parse error:", e);
      return text;
    }
  }

  async function sendMessage() {
    if (!userInput.trim() || isTyping) return;
    const userMsg: Message = { role: "user", parts: [{ text: userInput }] };
    messages.push(userMsg);
    userInput = "";
    isTyping = true;
    scrollToBottom("smooth");

    messages.push({ role: "model", parts: [{ text: "" }] });

    try {
      await invoke("chat_with_gemini", {
        messages: messages.slice(0, -1),
        systemPrompt: "You are HAKS, a high-performance AI assistant. Always use standard Markdown and LaTeX for math ($...$ for inline, $$...$$ for block).",
        knowledgeId: selectedKnowledgeId || null,
        imagePath: null,
      });
    } catch (err) {
      console.error(err);
      messages[messages.length - 1].parts[0].text = "Error: " + err;
      isTyping = false;
    }
  }

  onMount(async () => {
    try {
      knowledgeBases = await invoke("list_knowledge");
    } catch (err) {
      console.error("Failed to load knowledge bases:", err);
    }

    const unlistenChunks = await listen<ChatChunk>("chat-chunk", (event) => {
      const { text, done, error } = event.payload;
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.role === "model") {
        if (text) lastMsg.parts[0].text += text;
        if (error) lastMsg.parts[0].text = "Error: " + error;
      }
      if (done) isTyping = false;
    });

    const unlistenContext = await listen<{ payload: string }>("inject-context", (event) => {
      userInput = event.payload.payload || event.payload as unknown as string;
    });
  });

  $effect(() => {
    messages.forEach((m) => m.parts.forEach((p) => p.text));
    if (isTyping) {
      scrollToBottom("auto");
    } else {
      scrollToBottom("smooth");
    }
  });
</script>

<div class="flex flex-col h-screen w-full bg-[#1c1c1c] text-white font-sans overflow-hidden border border-white/10">
  <header class="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
        <LucideBot size={18} />
      </div>
      <div>
        <h1 class="text-sm font-semibold">HAKS: Quick Chat</h1>
        <p class="text-[10px] text-gray-400">Gemini 3 Flash</p>
      </div>
    </div>
  </header>

  <div class="px-4 py-2 border-b border-white/5 bg-white/2 flex items-center gap-2">
    <LucideDatabase size={12} class="text-gray-400" />
    <select bind:value={selectedKnowledgeId}
      class="bg-transparent text-[10px] text-gray-400 focus:outline-none cursor-pointer hover:text-white transition-colors">
      <option value="" class="bg-[#2a2a2a]">Fresh Gemini (No Knowledge)</option>
      {#each knowledgeBases as kb}
        <option value={kb.id} class="bg-[#2a2a2a]">{kb.name}</option>
      {/each}
    </select>
  </div>

  <main bind:this={chatViewport} class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
    {#each messages as msg}
      <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[85%] flex gap-2 {msg.role === 'user' ? 'flex-row-reverse' : ''}">
          <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center {msg.role === 'user' ? 'bg-purple-600' : 'bg-blue-600'}">
            {#if msg.role === "user"}
              <LucideUser size={14} />
            {:else}
              <LucideBot size={14} />
            {/if}
          </div>
          <div class="markdown-content p-3 rounded-2xl text-sm leading-relaxed {msg.role === 'user' ? 'bg-purple-600/20 text-purple-100 rounded-tr-none' : 'bg-white/10 text-blue-50 rounded-tl-none'}">
            {@html renderMarkdown(msg.parts[0].text) || (isTyping && msg === messages[messages.length - 1] ? "..." : "")}
          </div>
        </div>
      </div>
    {/each}
  </main>

  <footer class="p-4 bg-white/5 border-t border-white/10">
    <form class="relative" onsubmit={(e) => { e.preventDefault(); sendMessage(); }}>
      <input type="text" bind:value={userInput} placeholder="Type a message..."
        class="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/30 transition-all"
        disabled={isTyping} />
      <button type="submit"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:bg-gray-600"
        disabled={!userInput.trim() || isTyping}>
        {#if isTyping}
          <LucideLoader2 size={16} class="animate-spin" />
        {:else}
          <LucideSend size={16} />
        {/if}
      </button>
    </form>
    <p class="text-[9px] text-center mt-2 text-gray-500">HAKS can make mistakes. Verify important info.</p>
  </footer>
</div>

<style>
  :global(body) { margin: 0; padding: 0; overflow: hidden; }
  select { appearance: none; -webkit-appearance: none; }
  :global(.markdown-content p) { margin-bottom: 0.75rem; }
  :global(.markdown-content p:last-child) { margin-bottom: 0; }
  :global(.markdown-content h1, .markdown-content h2, .markdown-content h3) { font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #fff; }
  :global(.markdown-content h1) { font-size: 1.25rem; }
  :global(.markdown-content h2) { font-size: 1.1rem; }
  :global(.markdown-content h3) { font-size: 1rem; }
  :global(.markdown-content ul, .markdown-content ol) { margin-left: 1.25rem; margin-bottom: 0.75rem; }
  :global(.markdown-content ul) { list-style-type: disc; }
  :global(.markdown-content ol) { list-style-type: decimal; }
  :global(.markdown-content code) { background: rgba(255, 255, 255, 0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
  :global(.markdown-content pre) { background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.05); }
  :global(.markdown-content pre code) { background: transparent; padding: 0; font-size: 0.85rem; }
  :global(.markdown-content blockquote) { border-left: 4px solid rgba(255, 255, 255, 0.2); padding-left: 1rem; font-style: italic; color: rgba(255, 255, 255, 0.7); margin-bottom: 0.75rem; }
  :global(.markdown-content a) { color: #60a5fa; text-decoration: underline; }
  :global(.markdown-content table) { width: 100%; border-collapse: collapse; margin-bottom: 0.75rem; }
  :global(.markdown-content th, .markdown-content td) { border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.5rem; text-align: left; }
  :global(.markdown-content th) { background: rgba(255, 255, 255, 0.05); }
</style>
