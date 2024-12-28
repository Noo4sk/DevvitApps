class Battle {
    constructor(
        { enemy, onComplete }
    ){
        this.onComplete = onComplete;
        this.combatants = {};

        this.enemyID;
        this.enemyName;
        this.enemySnooImage;
        this.enemy = enemy;

        this.activeCombatants = {
            player: null,
            enemy: null,
        };

        // Dynamically Adding the player Team
        window.playerState.lineup.forEach( id => {
            this.addCombatant(
             id,
             "player",
             window.playerState.snoo[id],
            );
        });

        const enemyPlayerState = this.enemy;

        Logging.logObject({
            name: 'enemyPlayerState',
            object: enemyPlayerState,
        })

        Logging.logObject({
            name: 'enemyPlayerState.snoo',
            object: enemyPlayerState.snoo,
        })

        Object.keys(enemyPlayerState.snoo).forEach( key => {
            Logging.logObject({
                name: `${enemyPlayerState.snoo[key]}`,
                object: enemyPlayerState.snoo[key],
            })

            this.enemyID = enemyPlayerState.snoo[key].id;
            this.enemyName = enemyPlayerState.snoo[key].name;
            this.enemySnooImage = enemyPlayerState.snoo[key].snooImage;

            this.addCombatant(
                key,
                "enemy",
                enemyPlayerState.snoo[key],
               );

        });

        this.items = [];
        window.playerState.items.forEach( item => {
            this.items.push({
                ...item,
                team: "player",
            });
        });

        this.usedInstanceIds = {

        };
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
            <div class="battle_Player">
                <img src="${`./assets/Characters/Cat/s5-2-cat-Sheet-walk.png`}" alt="PlayerCharacter" />
            </div>
            <div class="battle_Enemy">
               <!-- <img src="${this.enemySnooImage}" alt=${this.enemyName} /> -->
            </div>
        `);
    }

    addCombatant(id, team, config){
        this.combatants[id] = new Combatant({
            ...Snoo[config.id],
            ...config,
            team,
            isPlayerControlled: team === "player",
        }, this);
        this.activeCombatants[team] = this.activeCombatants[team] || id;
    }

    async init(container){
        //await utils.wait(1000);
        this.createElement();
        container.appendChild(this.element);

        Object.keys(this.combatants).forEach( key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);
        });

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                });
            },
            onWinner: winner => {
                const sceneTransitionOverWorld = new SceneTransition();
                
                if(winner === "player"){
                    console.log(`Battle Over winner [Player]`);

                    Object.keys(playerState.snoo).forEach( id => {
                        console.log(`ID: ${id}`);

                        const combatant = this.combatants[id];

                        const _playerState = window.playerState.snoo[id];
                        
                        if (combatant){
                            _playerState.hp = _playerState.maxHp;
                            _playerState.xp = combatant.xp;
                            _playerState.max_Xp = Math.pow( (combatant.level/0.1), 2);

                            _playerState.level = combatant.level;
                        }

                    });

                    // remove player used items;
                    playerState.items = playerState.items.filter(item => {
                        return !this.usedInstanceIds[item.instanceId];
                    });

                    EventUtils.emitEvent("PlayerStateUpdated");

                }

                sceneTransitionOverWorld.init(document.querySelector(".game-container"), async () => {
                    sceneTransitionOverWorld.fadeOut();

                    window.AudioBgm.src = "./assets/Audio/8_Bit_Menu_David_Renda.mp3";
                    window.AudioBgm.play();

                    window.isInBattle = false;
                    playerState.battleWon += 1;

                    this.element.remove();
                    this.onComplete(winner === "player");
                    
                    console.groupEnd();
                });
            }
        });
        this.turnCycle.init();
    }
}

