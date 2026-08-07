var myAdController = null;
var isAdProcessing = false;

// РАДАР (ТЕСТОВИЙ БЛОК 41615)
var initRadar = setInterval(function() {
    if (window.Adsgram && myAdController === null) {
        try {
            myAdController = window.Adsgram.init({ blockId: "41615" });
            clearInterval(initRadar);
        } catch (e) {}
    }
}, 500);

function js_show_ad() {
    function callGML(val) {
        isAdProcessing = false;
        try {
            if (typeof window.gmcallback_ad_reward === "function") {
                window.gmcallback_ad_reward(val);
            } else if (typeof window.gml_Script_gmcallback_ad_reward === "function") {
                window.gml_Script_gmcallback_ad_reward(null, null, val);
            }
        } catch (e) {}
    }

    if (isAdProcessing) return;
    isAdProcessing = true;

    if (myAdController !== null) {
        var playPromise = myAdController.show();
        
        if (playPromise && playPromise.then) {
            playPromise.then(function(result) {
                // ВІДЕО ПОКАЗАНО!
                callGML(1);
            }).catch(function(err) {
                var msg = (err && err.description) ? err.description : "";
                
                // Якщо відео ще фізично не докачалося через інтернет
                if (msg.indexOf("loading") !== -1) {
                    alert("Відео ще завантажується у фоні (повільний інтернет). Зачекайте ще кілька секунд!");
                    callGML(2); 
                } 
                // Якщо включений AdBlock або інша помилка
                else {
                    alert("Помилка або увімкнено AdBlock. Реклама недоступна. Вимкніть блокувальник та перезапустіть гру.");
                    callGML(0); 
                }
            });
        } else {
            alert("Помилка плеєра Adsgram.");
            callGML(0);
        }
    } else {
        alert("Adsgram ще підключається. Зачекайте пару секунд!");
        callGML(2);
    }
}