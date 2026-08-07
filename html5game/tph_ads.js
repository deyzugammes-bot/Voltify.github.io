let myAdController = null;
let isAdProcessing = false;

// 1. Ініціалізуємо рекламу тихо у фоні при старті гри
window.addEventListener('load', function() {
    if (window.Adsgram) {
        myAdController = window.Adsgram.init({ blockId: "41615" });
    }
});

function js_show_ad() {
    // Функція, яка 100% знімає блок і повертає гру до життя
    function callGML(val) {
        isAdProcessing = false; // РОЗБЛОКОВУЄМО КНОПКУ
        try {
            if (typeof window.gmcallback_ad_reward === "function") {
                window.gmcallback_ad_reward(val);
            } else if (typeof window.gml_Script_gmcallback_ad_reward === "function") {
                window.gml_Script_gmcallback_ad_reward(null, null, val);
            }
        } catch (e) {
            console.error("Помилка зв'язку GML:", e);
        }
    }

    // Захист від подвійного кліку
    if (isAdProcessing) return; 
    isAdProcessing = true;

    if (myAdController) {
        myAdController.show().then((result) => {
            // УСПІХ! Гравець подивився рекламу
            callGML(1);
        }).catch((err) => {
            // БЕЗПЕЧНИЙ ВИВІД ПОМИЛКИ (Без крашів)
            let errorText = "Невідома помилка";
            if (err && err.description) {
                errorText = err.description;
            }
            
            // Виводимо просте вікно, щоб ти побачив причину
            alert("Adsgram Info:\n" + errorText);
            
            // Гарантовано видаємо втішний приз і знімаємо паузу
            callGML(0);
        });
    } else {
        alert("Помилка: Adsgram не підключено!");
        callGML(0);
    }
}