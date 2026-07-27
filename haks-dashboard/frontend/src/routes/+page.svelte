<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { onMount } from "svelte";
  import { LucideDatabase, LucidePlay, LucideSquare, LucideRefreshCw } from "lucide-svelte";

  interface GlobalConfig {
    gemini_api_key: string;
  }

  interface FeatureManifest {
    id: string;
    displayName: string;
    defaultSettings: Record<string, unknown>;
  }

  interface KnowledgeSource {
    id: string;
    source_type: string;
    name: string;
    path_or_url: string;
    content: string;
    file_uri: string | null;
  }

  interface Knowledge {
    id: string;
    name: string;
    system_prompt: string;
    sources: KnowledgeSource[];
    cache_name: string | null;
  }

  let activeTab = $state("features");
  let config = $state<GlobalConfig>({ gemini_api_key: "" });
  let knowledgeList = $state<Knowledge[]>([]);
  let features = $state<FeatureManifest[]>([]);
  let featureState = $state<Record<string, { pid: number; port: number }>>({});
  let isLoading = $state(true);
  let isProcessing = $state(false);
  let statusMsg = $state("");
  let newUrl = $state("");

  let featureSettings = $state<Record<string, Record<string, unknown>>>({});

  onMount(async () => {
    try {
      [config, knowledgeList, features] = await Promise.all([
        invoke<GlobalConfig>("get_config"),
        invoke<Knowledge[]>("list_knowledge"),
        invoke<FeatureManifest[]>("get_features"),
      ]);
      await refreshState();
    } catch (e) {
      console.error("Failed to load:", e);
    } finally {
      isLoading = false;
    }

    listen("feature-state-changed", async () => {
      await refreshState();
    });
  });

  async function refreshState() {
    try {
      const state = await invoke<{ running: Record<string, { pid: number; port: number }> }>("get_feature_state");
      featureState = state.running;
    } catch (e) {
      console.error("Failed to load state:", e);
    }
  }

  function isRunning(featureId: string): boolean {
    return featureId in featureState;
  }

  async function launchFeature(featureId: string) {
    try {
      await invoke("launch_feature", { featureId });
      await refreshState();
      statusMsg = `${featureId} launched!`;
      setTimeout(() => (statusMsg = ""), 3000);
    } catch (e) {
      statusMsg = `Error launching ${featureId}: ${e}`;
    }
  }

  async function killFeature(featureId: string) {
    try {
      await invoke("kill_feature", { featureId });
      await refreshState();
      statusMsg = `${featureId} stopped!`;
      setTimeout(() => (statusMsg = ""), 3000);
    } catch (e) {
      statusMsg = `Error stopping ${featureId}: ${e}`;
    }
  }

  async function loadFeatureSettings(featureId: string) {
    if (!featureSettings[featureId]) {
      try {
        const s = await invoke<Record<string, unknown>>("read_feature_config", { featureId });
        featureSettings = { ...featureSettings, [featureId]: s || {} };
      } catch (e) {
        console.error("Failed to load feature settings:", e);
      }
    }
  }

  async function saveFeatureSettings(featureId: string) {
    try {
      await invoke("write_feature_config", { featureId, value: featureSettings[featureId] });
      statusMsg = "Feature settings saved!";
      setTimeout(() => (statusMsg = ""), 3000);
    } catch (e) {
      statusMsg = `Error: ${e}`;
    }
  }

  async function saveSettings() {
    try {
      await invoke("save_config", { config });
      statusMsg = "Settings saved!";
      setTimeout(() => (statusMsg = ""), 3000);
    } catch (e) {
      statusMsg = `Error: ${e}`;
    }
  }

  async function saveKnowledge() {
    try {
      await invoke("save_knowledge", { knowledgeItems: $state.snapshot(knowledgeList) });
      statusMsg = "Knowledge Base updated!";
      setTimeout(() => (statusMsg = ""), 3000);
    } catch (e) {
      statusMsg = `Error: ${e}`;
    }
  }

  function addKnowledge() {
    knowledgeList = [
      ...knowledgeList,
      { id: crypto.randomUUID(), name: "New Knowledge Base", system_prompt: "You are a helpful assistant.", sources: [], cache_name: null },
    ];
  }

  async function addFileSource(knowledgeIndex: number) {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const selected = await open({
      multiple: true,
      filters: [{ name: "Documents", extensions: ["pdf", "md", "txt", "mp3", "wav", "m4a"] }],
    });
    if (selected && Array.isArray(selected)) {
      isProcessing = true;
      try {
        for (const path of selected) {
          const source = await invoke<KnowledgeSource>("process_and_add_source", { pathOrUrl: path });
          knowledgeList[knowledgeIndex].sources = [...knowledgeList[knowledgeIndex].sources, source];
        }
        statusMsg = "Files added!";
        setTimeout(() => (statusMsg = ""), 3000);
      } catch (e) {
        statusMsg = `Error: ${e}`;
      } finally {
        isProcessing = false;
      }
    }
  }

  async function addUrlSource(knowledgeIndex: number) {
    if (!newUrl.trim()) return;
    isProcessing = true;
    try {
      const source = await invoke<KnowledgeSource>("process_and_add_source", { pathOrUrl: newUrl });
      knowledgeList[knowledgeIndex].sources = [...knowledgeList[knowledgeIndex].sources, source];
      newUrl = "";
      statusMsg = "URL added!";
      setTimeout(() => (statusMsg = ""), 3000);
    } catch (e) {
      statusMsg = `Error: ${e}`;
    } finally {
      isProcessing = false;
    }
  }

  function removeSource(knowledgeIndex: number, sourceIndex: number) {
    knowledgeList[knowledgeIndex].sources.splice(sourceIndex, 1);
  }

  async function updateCache(knowledgeId: string) {
    isProcessing = true;
    try {
      const cacheName = await invoke<string>("update_knowledge_cache", { knowledgeId });
      statusMsg = `Cache updated: ${cacheName}`;
      knowledgeList = await invoke<Knowledge[]>("list_knowledge");
      setTimeout(() => (statusMsg = ""), 5000);
    } catch (e) {
      statusMsg = `Caching failed: ${e}`;
    } finally {
      isProcessing = false;
    }
  }

  function removeKnowledge(index: number) {
    knowledgeList = knowledgeList.filter((_, i) => i !== index);
  }
</script>

<div class="min-h-screen bg-[#0f1115] text-white flex flex-col font-sans">
  <header class="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1c23]">
    <h1 class="text-2xl font-bold tracking-tight">HAKS Dashboard</h1>
    {#if statusMsg}
      <span class="text-sm bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full animate-pulse border border-blue-500/30">
        {statusMsg}
      </span>
    {/if}
  </header>

  <div class="flex-1 flex overflow-hidden">
    <nav class="w-64 border-r border-white/10 p-4 space-y-2 bg-[#14161d] overflow-y-auto">
      <button onclick={() => (activeTab = "features")}
        class="w-full text-left p-3 rounded-lg transition-all {activeTab === 'features' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-slate-400'}">
        <span class="font-medium">Features</span>
      </button>
      <button onclick={() => (activeTab = "general")}
        class="w-full text-left p-3 rounded-lg transition-all {activeTab === 'general' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-slate-400'}">
        <span class="font-medium">General Settings</span>
      </button>
      <button onclick={() => (activeTab = "knowledge")}
        class="w-full text-left p-3 rounded-lg transition-all {activeTab === 'knowledge' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-slate-400'}">
        <span class="font-medium">Knowledge Base</span>
      </button>
      {#each features as feat (feat.id)}
        <button onclick={() => { activeTab = `feature-${feat.id}`; loadFeatureSettings(feat.id); }}
          class="w-full text-left p-3 rounded-lg transition-all flex items-center gap-2 {activeTab === `feature-${feat.id}` ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-slate-400'}">
          <span class="w-2 h-2 rounded-full {isRunning(feat.id) ? 'bg-green-400' : 'bg-slate-600'}"></span>
          <span class="font-medium text-sm">{feat.displayName}</span>
        </button>
      {/each}
    </nav>

    <main class="flex-1 overflow-auto p-8">
      {#if isLoading}
        <div class="h-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      {:else if activeTab === "features"}
        <section class="space-y-6 animate-in fade-in">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Feature Management</h2>
            <button onclick={refreshState} class="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-2">
              <LucideRefreshCw size={14} /> Refresh
            </button>
          </div>

          {#if features.length === 0}
            <div class="bg-[#1a1c23] p-12 rounded-xl border border-white/5 text-center">
              <p class="text-slate-400 mb-2">No features discovered</p>
              <p class="text-xs text-slate-600">Place feature binaries (.exe) in the <code class="bg-white/5 px-2 py-0.5 rounded">features/</code> directory</p>
            </div>
          {:else}
            <div class="grid grid-cols-1 gap-4 max-w-2xl">
              {#each features as feat (feat.id)}
                <div class="bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl flex justify-between items-center">
                  <div>
                    <h3 class="font-semibold text-lg">{feat.displayName}</h3>
                    <p class="text-xs text-slate-500 font-mono mt-1">ID: {feat.id}</p>
                    {#if isRunning(feat.id)}
                      <p class="text-xs text-green-400 mt-1">Running — PID: {featureState[feat.id].pid}, Port: {featureState[feat.id].port}</p>
                    {:else}
                      <p class="text-xs text-slate-600 mt-1">Stopped</p>
                    {/if}
                  </div>
                  <div>
                    {#if isRunning(feat.id)}
                      <button onclick={() => killFeature(feat.id)}
                        class="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 transition-all flex items-center gap-2">
                        <LucideSquare size={14} /> Stop
                      </button>
                    {:else}
                      <button onclick={() => launchFeature(feat.id)}
                        class="bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 transition-all flex items-center gap-2">
                        <LucidePlay size={14} /> Launch
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </section>
      {:else if activeTab === "general"}
        <section class="max-w-2xl space-y-6 animate-in fade-in">
          <h2 class="text-xl font-semibold mb-4">Gemini API Configuration</h2>
          <div class="space-y-4 bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl">
            <div class="space-y-2">
              <label for="api-key" class="text-sm font-medium text-slate-400">API Key</label>
              <input id="api-key" type="password" bind:value={config.gemini_api_key} placeholder="Enter Gemini API Key..."
                class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>
          <button onclick={saveSettings} class="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg active:scale-95">
            Save Changes
          </button>
        </section>
      {:else if activeTab === "knowledge"}
        <section class="space-y-6 animate-in fade-in">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Manage Knowledge Base</h2>
            <button onclick={addKnowledge} class="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all">
              + Add Knowledge
            </button>
          </div>
          <div class="grid grid-cols-1 gap-6">
            {#each knowledgeList as item, i (item.id)}
              <div class="bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl relative group">
                <button onclick={() => removeKnowledge(i)} class="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors">Delete</button>
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-slate-400">Name</label>
                      <input bind:value={item.name} class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-2.5 focus:border-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-slate-400">System Prompt</label>
                      <textarea bind:value={item.system_prompt} rows="3" class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-2.5 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                    </div>
                  </div>
                  <div class="col-span-full space-y-4 pt-4 border-t border-white/5">
                    <div class="flex justify-between items-center">
                      <div class="flex flex-col">
                        <label class="text-sm font-medium text-slate-400">Sources</label>
                        {#if item.cache_name}
                          <span class="text-[10px] text-blue-400 font-mono mt-1 flex items-center gap-1">
                            <LucideDatabase size={10} /> {item.cache_name} (Cached)
                          </span>
                        {:else}
                          <span class="text-[10px] text-slate-500 mt-1 italic">No active cache</span>
                        {/if}
                      </div>
                      <div class="flex gap-2">
                        <button onclick={() => updateCache(item.id)} disabled={isProcessing || item.sources.length === 0}
                          class="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1.5 rounded border border-blue-500/30 transition-all disabled:opacity-50">
                          Update Cache
                        </button>
                        <button onclick={() => addFileSource(i)} disabled={isProcessing}
                          class="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 transition-all disabled:opacity-50">
                          + Add File
                        </button>
                        <div class="flex gap-2 items-center bg-[#0f1115] border border-white/10 rounded-lg px-2 py-1">
                          <input bind:value={newUrl} placeholder="https://..." class="bg-transparent text-xs outline-none w-32" />
                          <button onclick={() => addUrlSource(i)} disabled={isProcessing || !newUrl}
                            class="text-[10px] text-blue-400 hover:text-blue-300 disabled:opacity-50">Add URL</button>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {#each item.sources as source, si}
                        <div class="flex items-center justify-between p-3 bg-[#0f1115] rounded-xl border border-white/5">
                          <div class="flex items-center gap-2 overflow-hidden">
                            <span class="text-[10px] px-1.5 py-0.5 rounded-full {source.source_type === 'url' ? 'bg-blue-600/20 text-blue-400' : 'bg-green-600/20 text-green-400'} border border-current/20 uppercase">
                              {source.source_type}
                            </span>
                            <span class="text-xs truncate font-medium text-slate-300" title={source.path_or_url}>{source.name}</span>
                          </div>
                          <button onclick={() => removeSource(i, si)} class="text-slate-600 hover:text-red-400 transition-colors p-1">x</button>
                        </div>
                      {/each}
                    </div>
                    {#if item.sources.length === 0}
                      <p class="text-[10px] text-slate-600 italic text-center py-4">No sources added yet.</p>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
          {#if knowledgeList.length > 0}
            <button onclick={saveKnowledge} class="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg">
              Update Knowledge Base
            </button>
          {/if}
        </section>
      {:else if activeTab.startsWith("feature-")}
        {@const fid = activeTab.replace("feature-", "")}
        <section class="max-w-2xl space-y-6 animate-in fade-in">
          <h2 class="text-xl font-semibold">
            {features.find(f => f.id === fid)?.displayName ?? fid} Settings
          </h2>
          <div class="space-y-4 bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl">
            {#if fid === "chat"}
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-400">System Prompt</label>
                <textarea rows="4" value={((featureSettings[fid] as any)?.systemPrompt as string) ?? ""}
                  oninput={(e) => {
                    const val = e.currentTarget.value;
                    featureSettings = { ...featureSettings, [fid]: { ...featureSettings[fid], systemPrompt: val } };
                  }}
                  class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
              </div>
            {:else if fid === "vision"}
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-400">Screenshot Directory</label>
                <input type="text" value={((featureSettings[fid] as any)?.screenshotDir as string) ?? ""}
                  oninput={(e) => {
                    const val = e.currentTarget.value;
                    featureSettings = { ...featureSettings, [fid]: { ...featureSettings[fid], screenshotDir: val } };
                  }}
                  class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none transition-all" />
                <p class="text-xs text-slate-500 mt-1">Folder to monitor for screenshots.</p>
              </div>
            {:else if fid === "voice"}
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-400">Voice Directory</label>
                <input type="text" value={((featureSettings[fid] as any)?.voiceDir as string) ?? ""}
                  oninput={(e) => {
                    const val = e.currentTarget.value;
                    featureSettings = { ...featureSettings, [fid]: { ...featureSettings[fid], voiceDir: val } };
                  }}
                  class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none transition-all" />
                <p class="text-xs text-slate-500 mt-1">Folder to monitor for voice recordings.</p>
              </div>
            {:else}
              <p class="text-xs text-slate-600 text-center py-4">No settings available for this feature.</p>
            {/if}
          </div>
          <button onclick={() => saveFeatureSettings(fid)} class="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg active:scale-95">
            Save Settings
          </button>
        </section>
      {/if}
    </main>
  </div>
</div>

<style>
  main::-webkit-scrollbar { width: 6px; }
  main::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
  main::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>
