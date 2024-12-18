(async function () {
    window.State_Testing = false;

    if(!window.State_Testing){
        // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
        window.addEventListener('message', (ev) => {
            const { type, data } = ev.data;
            
            // Reserved type for messages sent via `context.ui.webView.postMessage`
            if (type === 'devvit-message') {
                const { message } = data;

                // Load initial data
                if (message.type == 'initialData') {
                    const {username, id, playState, playerList} = message.data;

                    const state = JSON.parse(playState);
                    const players = JSON.parse(playerList);

                    console.log(`=========== players ===========\n`)
                    Object.keys(players).forEach(key => {
                        if(key != "undefind"){
                            const playersObj = JSON.parse(players[key]);
                            console.log(`playersObj:\n${JSON.stringify(playersObj, undefined, 2)}`);

                            window.Enemies = {
                                ...window.Enemies, 
                                [key]: playersObj
                            }
                            console.log(JSON.stringify(Enemies, undefined, 1));

                            const snoo = playersObj.snoo[key];
                            window.Snoo = {
                                ...window.Snoo, 
                                [key]: {
                                    name: snoo.playerName,
                                    snooImage: snoo.snooImage,
                                    id: snoo.id,
                                    hp: snoo.hp,
                                    maxHp: snoo.maxHp,
                                    level: snoo.level,
                                    actions: playersObj.heldActions,
                                    status: {},
                                }
                            }
                            console.log(JSON.stringify(Snoo));

                        }
                    });
                    console.log(`=========== players ===========\n`)


                    console.log(`=========== ENEMY ===========\n${JSON.stringify(window.Enemies, undefined, 2)}\n=========== ENEMY ===========\n`)

                    console.log(state);
                    window.playerState = new PlayerState({id, username, state});
                    window.playerId = id;

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
                        name: 'nooAsk',
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
                playerName: "nooAsk",
                lineup: ["00000"],
                items: [],
                heldActions: ['damage1'],
                storyFlags: {
                  'TestValue': true,
                }

            }
        }


        // Delete once in Production
        const overWorld = new OverWorld({
            element: document.querySelector(".game-container"),
        });
        

        window.playerState = new PlayerState({
            id: "00000",
            username: "nooAsk",
            state: state
        });

        window.Snoo = {
            ["00000"]: {
                name: "4sk",
                snooImage: "./assets/Characters/SnooError.png",
                id: "00000",
                hp: "10",
                maxHp: "45",
                level: "5",
                actions: ["damage1"],
                status: {},
            }
        }
        console.log(JSON.stringify(Snoo));
        
        overWorld.init();

    }
})();