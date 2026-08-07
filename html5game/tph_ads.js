var myAdController = null;
var isAdProcessing = false;

var initRadar = setInterval(function() {
    if (window.Adsgram && myAdController === null) {
        try { myAdController = window.Adsgram.init({ blockId: "41335" }); clearInterval(initRadar); } catch (e) {}
    }
}, 500);

function js_show_ad() {
    function callGML(val) {
        isAdProcessing = false;
        try {
            if (typeof window.gmcallback_ad_reward === "function") window.gmcallback_ad_reward(val);
            else if (typeof window.gml_Script_gmcallback_ad_reward === "function") window.gml_Script_gmcallback_ad_reward(null, null, val);
        } catch (e) {}
    }

    if (isAdProcessing) return;
    isAdProcessing = true;

    if (myAdController !== null) {
        var playPromise = myAdController.show();
        if (playPromise && playPromise.then) {
            playPromise.then(function() { callGML(1); })
            .catch(function(err) {
                var msg = (err && err.description) ? err.description : "";
                if (msg.indexOf("loading") !== -1) { callGML(2); } // Ще вантажиться
                else { callGML(0); } // Помилка або AdBlock
            });
        } else { callGML(0); }
    } else { callGML(2); }
}