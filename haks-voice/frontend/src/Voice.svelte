<script lang="ts">
  import { onMount } from "svelte";
  import { listen, emit } from "@tauri-apps/api/event";
  import { LucideMic, LucideFileAudio, LucideArrowRight } from "lucide-svelte";

  interface VoiceUpdate { file_path: string; transcript: string; }

  let transcripts = $state<{ path: string; text: string; time: string }[]>([]);

  async function askAboutThis(text: string) {
    await emit("inject-context", { type: "inject-context", payload: `この文字起こし結果について詳しく教えて：\n\n${text}` });
  }

  async function sendToChat(text: string) {
    try {
      const res = await fetch("http://127.0.0.1:18900/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "voice",
          to: "chat",
          type: "inject-context",
          payload: `この文字起こし結果について詳しく教えて：\n\n${text}`,
        }),
      });
    } catch (e) {
      console.error("Relay send failed:", e);
    }
  }

  onMount(async () => {
    const unlisten = await listen<VoiceUpdate>("voice-update", (event) => {
      const { file_path, transcript } = event.payload;
      transcripts = [
        { path: file_path.split("\\").pop() || "unknown", text: transcript, time: new Date().toLocaleTimeString() },
        ...transcripts,
      ];
    });
  });
</script>

<div class="flex flex-col h-screen bg-[#1c1c1c] text-white font-sans overflow-hidden border border-white/10 p-6">
  <header class="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
    <div class="flex items-center gap-2">
      <LucideMic class="text-green-400" size={20} />
      <h1 class="text-sm font-semibold uppercase tracking-wider">Voice Transcriber</h1>
    </div>
    <div class="flex items-center gap-1.5">
      <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      <span class="text-[10px] text-green-500/80 font-mono">LIVE</span>
    </div>
  </header>

  <main class="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
    {#if transcripts.length === 0}
      <div class="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-20">
        <LucideFileAudio size={48} />
        <p class="text-xs">Waiting for audio files...</p>
      </div>
    {/if}
    {#each transcripts as item}
      <div class="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 hover:bg-white/10 transition-colors group">
        <div class="flex justify-between items-center">
          <span class="text-[9px] font-mono text-gray-500 truncate max-w-[70%]">{item.path}</span>
          <span class="text-[9px] text-gray-600">{item.time}</span>
        </div>
        <p class="text-sm text-green-50 font-medium leading-relaxed">{item.text}</p>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
          <button onclick={() => askAboutThis(item.text)}
            class="text-[9px] text-blue-400 flex items-center gap-1 hover:underline">
            Emit <LucideArrowRight size={10} />
          </button>
          <button onclick={() => sendToChat(item.text)}
            class="text-[9px] text-green-400 flex items-center gap-1 hover:underline">
            Send to Chat <LucideArrowRight size={10} />
          </button>
        </div>
      </div>
    {/each}
  </main>

  <footer class="mt-4 pt-4 border-t border-white/5 text-center">
    <p class="text-[9px] text-gray-500 italic">Auto-transcribing files in monitored directory...</p>
  </footer>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
