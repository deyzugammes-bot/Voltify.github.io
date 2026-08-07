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
                // ДІСТАЄМО СПРАВЖНЮ ПОМИЛКУ ВІД ADSGRAM
                var msg = (err && err.description) ? err.description : JSON.stringify(err);
                var finalText = "";
                
                if (msg.indexOf("loading") !== -1) {
                    finalText = "Відео ще завантажується... Почекайте пару секунд і натисніть знову.";
                } else {
                    finalText = "Відповідь Adsgram:\n" + msg;
                }

                // ВИКЛИКАЄМО РІДНЕ ВІКНО TELEGRAM (ВОНО 100% ПОКАЖЕТЬСЯ НА ТЕЛЕФОНІ)
                try {
                    window.Telegram.WebApp.showAlert(finalText);
                } catch (e) {
                    alert(finalText); // Запасний варіант для ПК
                }
                
                callGML(0); 
            });
        } else {
            try { window.Telegram.WebApp.showAlert("Помилка плеєра Adsgram."); } catch(e) { alert("Помилка плеєра Adsgram."); }
            callGML(0);
        }
    } else {
        try { window.Telegram.WebApp.showAlert("Adsgram ще підключається..."); } catch(e) { alert("Adsgram ще підключається..."); }
        callGML(2);
    }
}