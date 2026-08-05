function js_show_ad() {
    if (window.Adsgram) {
        const AdController = window.Adsgram.init({ blockId: "41335" });
        AdController.show().then((result) => {
            // Гравець додивився відео! Відправляємо сигнал 1 в GameMaker
            gml_Script_gmcallback_ad_reward(1);
        }).catch((result) => {
            // Гравець закрив завчасно або сталася помилка. Відправляємо сигнал 0
            gml_Script_gmcallback_ad_reward(0);
        });
    } else {
        console.log("Adsgram script not loaded!");
        gml_Script_gmcallback_ad_reward(0);
    }
}