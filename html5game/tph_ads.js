// Створюємо змінну для контролера ТІЛЬКИ ОДИН РАЗ
let myAdController = null;

function js_show_ad() {
    // Бронебійна функція для розблокування гри (знімає з паузи)
    function callGML(val) {
        try {
            if (typeof window.gmcallback_ad_reward === "function") {
                window.gmcallback_ad_reward(val);
            } else if (typeof window.gml_Script_gmcallback_ad_reward === "function") {
                window.gml_Script_gmcallback_ad_reward(null, null, val);
            } else {
                alert("GameMaker: Функцію gmcallback_ad_reward не знайдено!");
            }
        } catch (e) {
            alert("Помилка зв'язку з грою: " + e.message);
        }
    }

    if (window.Adsgram) {
        try {
            // Ініціалізуємо контролер лише якщо його ще немає!
            if (!myAdController) {
                myAdController = window.Adsgram.init({ blockId: "41335" });
            }

            // Запускаємо показ відео
            myAdController.show().then((result) => {
                // Успіх! Юзер подивився відео
                callGML(1);
            }).catch((err) => {
                // ПОМИЛКА АБО "НЕМАЄ РЕКЛАМИ"
                // Виводимо системне вікно, щоб побачити, що саме каже Adsgram!
                alert("Adsgram Info: " + JSON.stringify(err));
                
                // Передаємо 0, щоб ГРА ЗНЯЛАСЯ З ПАУЗИ і видала втішний приз
                callGML(0);
            });
            
        } catch (err) {
            alert("Помилка запуску Adsgram: " + err.message);
            callGML(0);
        }
    } else {
        alert("Помилка: Скрипт Adsgram не підключено у HTML!");
        callGML(0);
    }
}