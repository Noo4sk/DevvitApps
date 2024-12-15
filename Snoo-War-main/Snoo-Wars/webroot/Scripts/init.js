(async function () {
    window.State_Testing = true;

    if(!window.State_Testing){
        // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
        window.addEventListener('message', (ev) => {
            const { type, data } = ev.data;
            
            // Reserved type for messages sent via `context.ui.webView.postMessage`
            if (type === 'devvit-message') {
                const { message } = data;

                // Load initial data
                if (message.type == 'initialData') {
                    const {username, id, playState} = message.data;
                    const state = JSON.parse(playState);

                    console.log(state);
                    window.playerState = new PlayerState({id, username, state});

                    const overWorld = new OverWorld({
                        element: document.querySelector(".game-container"),
                    });
                
                    overWorld.init();
                }
            }
        });

    } else {

        const state = {
            playerState: {
                "snoo": {
                    "00000": {
                        snooImage: "./assets/Characters/SnooError.png",
                        id: "00000",
                        hp: 30,
                        maxHp: 30,
                        xp: 0,
                        max_Xp: 100,
                        level: 1,
                        status: {},
                    }
                },
                lineup: [],
                items: [],
                heldActions: ['damage1']
            }
        }


        // Delete once in Production
        const overWorld = new OverWorld({
            element: document.querySelector(".game-container"),
        });
        

        
        window.playerState = new PlayerState({
            id:"00000",
            username:"nooAsk",
            state:state
        });
        
        overWorld.init();

    }
})();