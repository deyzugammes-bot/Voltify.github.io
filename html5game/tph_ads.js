// 1. Змінна для контролера
let myAdController = null;
let isAdProcessing = false;

// 2. ІНІЦІАЛІЗУЄМО ADSGRAM У ФОНІ, коли гра тільки запускається!
window.addEventListener('load', function() {
    if (window.Adsgram) {
        myAdController = window.Adsgram.init({ blockId: "41335" });
    }
});

// 3. ФУНКЦІЯ ВИКЛИКУ (коли гравець тисне кнопку)
function js_show_ad() {
    function callGML(val) {
        isAdProcessing = false; // Знімаємо блок кліків
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

    // Захист від того, щоб гравець не спамив кнопку 10 разів за секунду
    if (isAdProcessing) return; 

    if (myAdController) {
        isAdProcessing = true;
        myAdController.show().then((result) => {
            // УСПІХ! Відео подивились.
            callGML(1);
        }).catch((err) => {
            // ПОМИЛКА АБО "НЕМАЄ ВІДЕО"
            // (Віконце alert прибрано. Гравець просто отримає втішний бонус)
            console.log("Adsgram Info:", err);
            callGML(0);
        });
    } else {
        // Якщо Adsgram взагалі не зміг запуститися (наприклад, AdBlock)
        console.log("Adsgram SDK не знайдено");
        callGML(0);
    }
}