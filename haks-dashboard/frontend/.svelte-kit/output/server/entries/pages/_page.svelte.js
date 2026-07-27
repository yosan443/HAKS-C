import { a4 as attr_class, a5 as ensure_array_like, e as escape_html } from "../../chunks/index.js";
import "@tauri-apps/api/core";
import "@tauri-apps/api/event";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "features";
    let features = [];
    let featureState = {};
    function isRunning(featureId) {
      return featureId in featureState;
    }
    $$renderer2.push(`<div class="min-h-screen bg-[#0f1115] text-white flex flex-col font-sans"><header class="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1c23]"><h1 class="text-2xl font-bold tracking-tight">HAKS Dashboard</h1> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></header> <div class="flex-1 flex overflow-hidden"><nav class="w-64 border-r border-white/10 p-4 space-y-2 bg-[#14161d] overflow-y-auto"><button${attr_class(`w-full text-left p-3 rounded-lg transition-all ${"bg-blue-600 shadow-lg"}`)}><span class="font-medium">Features</span></button> <button${attr_class(`w-full text-left p-3 rounded-lg transition-all ${"hover:bg-white/5 text-slate-400"}`)}><span class="font-medium">General Settings</span></button> <button${attr_class(`w-full text-left p-3 rounded-lg transition-all ${"hover:bg-white/5 text-slate-400"}`)}><span class="font-medium">Knowledge Base</span></button> <!--[-->`);
    const each_array = ensure_array_like(features);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let feat = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`w-full text-left p-3 rounded-lg transition-all flex items-center gap-2 ${activeTab === `feature-${feat.id}` ? "bg-blue-600 shadow-lg" : "hover:bg-white/5 text-slate-400"}`)}><span${attr_class(`w-2 h-2 rounded-full ${isRunning(feat.id) ? "bg-green-400" : "bg-slate-600"}`)}></span> <span class="font-medium text-sm">${escape_html(feat.displayName)}</span></button>`);
    }
    $$renderer2.push(`<!--]--></nav> <main class="flex-1 overflow-auto p-8 svelte-1uha8ag">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="h-full flex items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>`);
    }
    $$renderer2.push(`<!--]--></main></div></div>`);
  });
}
export {
  _page as default
};
