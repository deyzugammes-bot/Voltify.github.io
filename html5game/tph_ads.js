let myAdController = null;
let isAdProcessing = false;

// 1. ВМИКАЄМО "РАДАР" (перевіряє наявність Adsgram кожні півсекунди)
let initRadar = setInterval(function() {
    if (window.Adsgram && !myAdController) {
        // Підключаємо твій тестовий блок!
        myAdController = window.Adsgram.init({ blockId: "41615" }); 
        
        // Вимикаємо радар, бо ми успішно підключилися
        clearInterval(initRadar); 
        console.log("Adsgram успішно ініціалізовано у фоні!");
    }
}, 500);

// 2. ФУНКЦІЯ КЛІКУ ПО КНОПЦІ
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
            // БЕЗПЕЧНИЙ ВИВІД ПОМИЛКИ
            let errorText = "Невідома помилка";
            if (err && err.description) {
                errorText = err.description;
            }
            alert("Adsgram Info:\n" + errorText);
            
            // Гарантовано видаємо втішний приз і знімаємо паузу
            callGML(0);
        });
    } else {
        // Якщо інтернет повільний і радар ще не встиг підключитися
        alert("Реклама ще завантажується... Спробуй через 2 секунди.");
        callGML(0);
    }
}