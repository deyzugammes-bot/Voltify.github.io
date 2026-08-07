var myAdController = null;
var isAdProcessing = false;

// 1. РАДАР (працює тихо і без збоїв)
var initRadar = setInterval(function() {
    if (window.Adsgram && myAdController === null) {
        try {
            myAdController = window.Adsgram.init({ blockId: "41615" });
            clearInterval(initRadar);
        } catch (e) {
            console.error("Adsgram init error: ", e);
        }
    }
}, 500);

// 2. ФУНКЦІЯ КЛІКУ
function js_show_ad() {
    // Функція зв'язку з GameMaker
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

    try {
        // Якщо кнопка зависла з минулого разу - розблоковуємо її!
        if (isAdProcessing) {
            isAdProcessing = false;
            return;
        }
        
        isAdProcessing = true;

        if (myAdController !== null) {
            var playPromise = myAdController.show();
            
            if (playPromise && playPromise.then) {
                playPromise.then(function(result) {
                    // УСПІХ! Відео показано
                    callGML(1);
                }).catch(function(err) {
                    // ПОМИЛКА АБО НЕМАЄ ВІДЕО
                    var msg = (err && err.description) ? err.description : "Невідома помилка";
                    alert("Adsgram:\n" + msg);
                    callGML(0); // Видаємо втішний приз
                });
            } else {
                alert("Adsgram не зміг запустити відео!");
                callGML(0);
            }
        } else {
            // Якщо радар ще не встиг знайти Adsgram
            alert("Реклама ще підключається... Спробуй через 2 секунди!");
            callGML(0);
        }
    } catch (globalErr) {
        alert("Помилка скрипта:\n" + globalErr.message);
        callGML(0);
    }
}