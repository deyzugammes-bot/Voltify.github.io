function js_show_ad() {
    function callGML(val) {
        try {
            if (typeof window.gml_Script_gmcallback_ad_reward === "function") window.gml_Script_gmcallback_ad_reward(null, null, val);
            else if (typeof gml_Script_gmcallback_ad_reward === "function") gml_Script_gmcallback_ad_reward(null, null, val);
            else if (typeof gmcallback_ad_reward === "function") gmcallback_ad_reward(val);
        } catch(e) {}
    }
    if (window.Adsgram) {
        const AdController = window.Adsgram.init({ blockId: "41335" });
        AdController.show().then((result) => { callGML(1); }).catch((err) => { callGML(0); });
    } else {
        callGML(0);
    }
}