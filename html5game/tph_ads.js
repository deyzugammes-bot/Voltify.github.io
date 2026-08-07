var myAdController = null;
var isAdProcessing = false;

// РАДАР (ТВІЙ БОЙОВИЙ БЛОК ДЛЯ ЗАРОБІТКУ - 41335)
var initRadar = setInterval(function() {
    if (window.Adsgram && myAdController === null) {
        try {
            myAdController = window.Adsgram.init({ blockId: "41335" });
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
                // ВІДЕО ПОКАЗАНО - ДАЄМО НАГОРОДУ!
                callGML(1);
            }).catch(function(err) {
                var msg = (err && err.description) ? err.description : "";
                
                // Якщо відео ще фізично не докачалося через повільний інтернет
                if (msg.indexOf("loading") !== -1) {
                    var textLoad = "Реклама ще завантажується... Будь ласка, зачекайте кілька секунд і спробуйте знову!";
                    try { window.Telegram.WebApp.showAlert(textLoad); } catch (e) { alert(textLoad); }
                    callGML(2); 
                } 
                // Якщо включений AdBlock або блокування провайдером
                else {
                    var textBlock = "На жаль, сталася помилка. Реклама не може бути показана (можливо, немає доступних відео або у вас увімкнений AdBlock). Будь ласка, переконайтеся, що у вас вимкнений AdBlock і повторіть спробу пізніше.";
                    try { window.Telegram.WebApp.showAlert(textBlock); } catch (e) { alert(textBlock); }
                    callGML(0); 
                }
            });
        } else {
            callGML(0);
        }
    } else {
        var textInit = "Система ще підключається. Зачекайте пару секунд.";
        try { window.Telegram.WebApp.showAlert(textInit); } catch(e) { alert(textInit); }
        callGML(2);
    }
}