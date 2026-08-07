// 1. Змінна для контролера
let myAdController = null;
let isAdProcessing = false;

// 3. ФУНКЦІЯ ВИКЛИКУ
function js_show_ad() {
    // Функція розблокування гри
    function callGML(val) {
        isAdProcessing = false; 
        try {
            if (typeof window.gmcallback_ad_reward === "function") {
                window.gmcallback_ad_reward(val);
            } else if (typeof window.gml_Script_gmcallback_ad_reward === "function") {
                window.gml_Script_gmcallback_ad_reward(null, null, val);
            }
        } catch (e) {
            console.error("GameMaker link error:", e);
        }
    }

    // Блокуємо подвійні кліки (через які була помилка "Attempt to call show")
    if (isAdProcessing) return; 
    isAdProcessing = true;

    if (window.Adsgram) {
        try {
            // Ініціалізуємо тільки якщо ще не ініціалізували
            if (!myAdController) {
                myAdController = window.Adsgram.init({ blockId: "41615" });
            }
            
            myAdController.show().then((result) => {
                // УСПІХ
                callGML(1);
            }).catch((err) => {
                // ПОМИЛКА! Виводимо її через красиве вікно Telegram
                try {
                    window.Telegram.WebApp.showAlert("Adsgram Test Error:\n" + JSON.stringify(err));
                } catch(e) {
                    alert("Adsgram Test Error:\n" + JSON.stringify(err));
                }
                callGML(0);
            });
        } catch (initErr) {
            try {
                window.Telegram.WebApp.showAlert("Init Error:\n" + initErr.message);
            } catch(e) {}
            callGML(0);
        }
    } else {
        try {
            window.Telegram.WebApp.showAlert("Критична помилка: Скрипт Adsgram не завантажився в HTML!");
        } catch(e) {}
        callGML(0);
    }
}