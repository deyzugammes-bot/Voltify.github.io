function js_show_ad() {
    // Спеціальна функція-обгортка для надійної передачі сигналу в GameMaker HTML5
    function callGML(val) {
        if (typeof gml_Script_gmcallback_ad_reward === "function") {
            try {
                // Сучасний GameMaker
                gml_Script_gmcallback_ad_reward(null, null, val);
            } catch (e) {
                // Старіші версії GameMaker
                gml_Script_gmcallback_ad_reward(val);
            }
        }
    }

    if (window.Adsgram) {
        const AdController = window.Adsgram.init({ blockId: "41335" });
        AdController.show().then((result) => {
            // Юзер подивився відео!
            callGML(1);
        }).catch((result) => {
            // Юзер закрив завчасно або реклама не підгрузилась (AdBlock/ПК)
            console.log("Adsgram Error/Closed:", result);
            callGML(0);
        });
    } else {
        console.log("Adsgram script not loaded!");
        callGML(0);
    }
}