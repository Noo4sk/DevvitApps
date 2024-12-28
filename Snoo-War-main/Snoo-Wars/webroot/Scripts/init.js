(async function () {
    window.State_Testing = false;

    if(!window.State_Testing){
        // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
        window.addEventListener('message', (ev) => {
            const { type, data } = ev.data;
            
            // Reserved type for messages sent via `context.ui.webView.postMessage`
            if (type === 'devvit-message') {
                const { message } = data;

                // ==================== If the Message from Devvit is 'initialData' =======================
                if (message.type === 'initialData') {
                    console.groupCollapsed(`Database Init`);
                    // Deconstruct message.data
                    const {username, id, playerList} = message.data;

                    let players;
                    let clientPlayerState;
                    
                    // if playerList is not null parse it.
                    if (playerList != 'anon'){
                        players = JSON.parse(playerList);

                    }

                    // for each Player in the playerList Object
                    Object.keys(players).forEach(key => {

                        // if the Key is Not a player Skip.
                        if(key === "ID" || key === "anon" || key === "undefind"){
                            return;
                        }

                        // get the player as an Object.
                        const _playersObj = JSON.parse(players[key]);
                        const userPlayerState = _playersObj.playerState;


                        // Equipment from player
                        const Equipment = userPlayerState.snoo[key].Equipment;

                        // if player snoo image is not anon skip. IF True assing the SnooError Png
                        if(userPlayerState.snoo[key].snooImage === 'anon'){
                            console.log('Noo Snoo Image found Assigning one.')
                            userPlayerState.snoo[key].snooImage =  './assets/Characters/SnooError.png'
                        }

                        let attack = 0;
                        let defence = 0;
                        let speed = 0;
                        
                        // Get Keys from Equipment Object
                        console.groupCollapsed(`============\n${userPlayerState.snoo[key].name}: Equipment`);
                        Object.keys(Equipment).forEach( key => {
                            console.groupCollapsed(key);
                            // get The items within Equipment[key] Object
                            Object.keys(Equipment[key]).forEach( Catagory => {
                                console.log(`${Catagory}: ${Equipment[key][Catagory]}`);

                                if(Catagory === 'defence'){
                                    defence += Equipment[key][Catagory];
                                }
                                if(Catagory === 'attack'){
                                    attack += Equipment[key][Catagory];
                                }
                                if(Catagory === 'speed'){
                                    speed += Equipment[key][Catagory];
                                }
                            });
                            console.groupEnd();
                        });
        
                        Logging.mulitLog([
                            `Attack: ${attack}`,
                            `Defence: ${defence}`,
                            `Speed: ${speed}`
                        ])
                        console.groupEnd();

                        userPlayerState.snoo[key].attack = attack;
                        userPlayerState.snoo[key].speed = speed;
                        userPlayerState.snoo[key].defence = defence;

                        // Add the player to the window.Enemies Object.
                        window.Enemies = {
                            ...window.Enemies, 
                            [key]:  userPlayerState
                        }

                        // Add the player to the window.Snoo Object.
                        window.Snoo = {
                            ...window.Snoo,
                            [key]: userPlayerState.snoo[key],
                        }

                        if(userPlayerState.snoo[key].id === id){
                            console.log(`Id Match | setting client playerState.`);
                 

                            //window.Inventory.add(userPlayerState.Inventory);
                            // Add User To there own Player State.
                            window.playerState = new PlayerState({id, userPlayerState});
                            window.playerState.Inventory = new Inventory();

                            if(userPlayerState.Inventory.length > 0){
                                userPlayerState.forEach(index => {
                                    console.log(index);
                                });
                            }
                            
                            window.playerId = id;
                            window.isInBattle = false;
                            
                            localStorage.setItem('playerId', id);
                            localStorage.setItem('username', username);
                        }

                    });

                    console.groupCollapsed('Global Lists');
                    Logging.logObject({
                        name: `===== Enemies =====`,
                        object: window.Enemies,
                    })

                    Logging.logObject({
                        name: `===== Snoo =====`,
                        object: window.Snoo,
                    })
                    
                    // Quickly add any updates to redis.                    
                    Logging.logObject({
                        name: `===== Player State =====`,
                        object: window.playerState,
                        extraItems: [
                            `id: ${id} `,
                        ]
                    });

                    Logging.logObject({
                        name: `===== Inventory =====`,
                        object: window.Inventory,
                    })

                    console.groupEnd();

                    // Start the Game.
                    const overWorld = new OverWorld({
                        element: document.querySelector(".game-container"),
                    });
                    overWorld.init();
                    console.groupEnd();
                }

// =============================== If the Message from Devvit is 'updateRedis' ===================================================
                if (message.type === 'updateRedis') {
                    //console.group('Redis Update')
                    //console.log('Message Received From Reddit');
                    const { playerList } = message.data;                    

                    let players;

                    if (players != 'anon'){
                        players = JSON.parse(playerList);
                    }
                    
                    Object.keys(players).forEach(key => {

                        // if the Key is Not a player Skip.
                        if(key === "ID" || key === "anon" || key === "undefind"){
                            return;
                        }

                        const _playersObj = JSON.parse(players[key]);
                        const snoo = _playersObj.playerState.snoo[key];

                        // Check if Player Has a snoo Image. if not assign the Error.png.
                        if(snoo.snooImage === 'anon'){
                            snoo.snooImage =  './assets/Characters/SnooError.png'
                        }

                        window.Enemies[key] =_playersObj;

                        window.Snoo[key] = snoo;
                    });
                }
            }
        });
    }
})();