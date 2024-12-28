class OverWorld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.canvas.setAttribute('tabindex', '0');
        this.ctx = this.canvas.getContext("2d");

        window.addEventListener('resize', function(){
            var width = document.body.offsetWidth;
            var height = document.body.offsetHeight;
            
            this.ctx.canvas.width = width;
            this.ctx.canvas.height = height;
            this.ctx.translate(width/2, height/2);

        }, false);

        this.map = null;

        // Background music.
        this.audioCtx = new AudioContext();
        this.AudioBgm = new Audio("./assets/Audio/8_Bit_Menu_David_Renda.mp3");
        this.AudioBgm.loop = true;
        this.AudioBgm.volume = 0.02;

        this.AudioSource = this.audioCtx.createMediaElementSource(this.AudioBgm);
        this.gainNode = this.audioCtx.createGain();

        this.AudioSource.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);

        window.AudioBgm = this.AudioBgm;
        window.AudioCtx = this.audioCtx;
        window.AudioGainNode = this.gainNode;

        this.pFps = null;
        this.pDelta = null;
        this.pBeat = null;
        this.pLastRender = null;
        this.pReadRate = null;

        this.pPlayerPos = null;

        this.cameraPerson = null
    }

    // ====== GAME LOOP Work to be Done ======
    bloodFlow(delta){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        

        if(!this.map.isCutscenePlaying){
            this.map.overworld.cameraPerson = this.map.gameObjects['player'];

        }

        Object.values(this.map.gameObjects).forEach( obj => {
            obj.update({
                delta,
                arrow: this.directionInput.direction,
                map: this.map,
            });
        });
        
        this.map.drawLowerImage(this.ctx, this.cameraPerson);

        Object.values(this.map.gameObjects).sort((a, b) => {
            return a.y - b.y;
        }).forEach( obj => {
            obj.sprite.draw(this.ctx, this.cameraPerson);

        });
        
        this.map.drawUpperImage(this.ctx, this.cameraPerson);

        Object.keys(this.map.walls).forEach( obj => {
            let { x, y } = utils.getGridCoord(obj);

            this.map.drawWall(this.ctx, this.cameraPerson, x, y);
        });

    }

    // ====== Dev Stats HTML ======
    devStats(container){
        this.developerStats = document.createElement("div");
        this.developerStats.classList.add("developerStats");
        this.developerStats.innerHTML = (`
            <svg class="background">
                <rect width="100" height="100" ></rect>
            </svg>
            <span class="Items">
                <p class="fps">FPS | 9999999999</p>
                <p class="delta">Delta | 9999999999</p>
                <p class="beat">Beat | 9999999999</p>
                <p class="lastRender">LastRender | 9999999999</p>
                <p class="readRate">ReadRate | 9999999999</p>
                <p id="playerPos" class="ClientPlayerPos"> X: 0 | Y: 0 </p>
            </span>
        `);

        container.appendChild(this.developerStats);
    }

    // ====== GAME LOOP ======
    startGameLoop() {
        const readRate = 800;
        let readWait = 0;

        let lastRender;
        const beat = 1/60;
        
        let fps = 0;
        const heart = (timeStamp) => {      
            if (lastRender === undefined) {
                lastRender = timeStamp;
            }
                  
            if (this.map.isPaused) {
                return;
            }
            this.pBeat.innerText = `Beat: ${beat.toFixed(4)}`;

            let delta = (timeStamp - lastRender) / 1000;
            

            while (delta > beat) {
                fps = 1 / delta;

                this.pDelta.innerText = `Delta: ${delta.toFixed(4)}`;
                this.pFps.innerText = `Fps: ${fps.toFixed(0)}`;

                this.bloodFlow(delta);

                this.pPlayerPos.innerText = `X: ${window.playerState.progress.x} | Y: ${window.playerState.progress.y} || X: ${(window.playerState.progress.x/16)} | Y: ${(window.playerState.progress.y/16)}`

                delta -= beat;
            }

            // Increment readWait + 1
            readWait++
            this.pReadRate.innerText = `ReadRate: ${readWait} / ${readRate}`;
            if( readWait >= readRate){

                if(window.isInBattle === false){
                    //console.log('Pushing to Devvit');

                    //we are going to request update the window.Enemies and window.Snoo.
                    window.parent?.postMessage(
                        {
                        type: "updateRedis",
                        data: {} // no data need to be sent.
                        },
                        '*'
                    );
                }

                // reset  readWait.
                readWait = 0;
            }
            

            lastRender = timeStamp - delta * 1000;
            this.pLastRender.innerText = `lastRender: ${lastRender.toFixed(0)}`

            // next tick
            requestAnimationFrame(heart);
        };

        // first tick
        requestAnimationFrame(heart);
    }
    
    bindActionInput(){
        new KeyPressListener("Enter", () => {
            // a Person! oh boy...
            this.map.checkForActionCutscene();
        });

        new KeyPressListener('Space', () => {
            // a Person! oh boy...
            this.map.checkForActionCutscene();
        });

        new KeyPressListener('Escape', () => {

            if(!this.map.isCutscenePlaying){
                this.map.startCutscene([
                    { type: "pause" }
                ]);
            }
        });

        new KeyPressListener('E', () => {
            console.log('Open Inventory!');
        });
    }

    bindPlayerPositionCheck(){
        document.addEventListener("PersonWalkingComplete", e => {
            if(e.detail.whoId === "player"){
                this.map.checkForFootStepCutscene();
            }
        })
    }

    startMap(mapConfig, InitialState=null){
        console.dir(InitialState);

        this.map = new OverWorldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();

        if(InitialState){
            this.map.gameObjects.player.x = InitialState.x;
            this.map.gameObjects.player.y = InitialState.y;
            this.map.gameObjects.player.direction = InitialState.direction;
        }

        this.progress.mapId = mapConfig.id;
        this.progress.startingPlayerX = this.map.gameObjects.player.x;
        this.progress.startingPlayerY = this.map.gameObjects.player.y;
        this.progress.startingPlayerDirection = this.map.gameObjects.player.direction;
    }

    FPSCounter(container){
        this.FpsElement = document.createElement("div");
        this.FpsElement.classList.add("Fps-container");
        this.FpsElement.innerHTML = (`
            <p id="Fps_Element"></p>
        `);

        container.appendChild(this.FpsElement);
    }

    async init(){
        const container = document.querySelector(".game-container");

        this.FPSCounter(container);
        this.devStats(container);

        this.canvas.focus();

        this.titleScreen = new TitleScreen({

        });
        await this.titleScreen.init(container)

        this.pFps = document.querySelector(".fps");
        this.pDelta = document.querySelector(".delta");
        this.pBeat = document.querySelector(".beat");
        this.pLastRender = document.querySelector(".lastRender");
        this.pReadRate = document.querySelector(".readRate");
        this.pPlayerPos = document.querySelector(".ClientPlayerPos");

        this.progress = new Progress();  


        this.hud = new Hud();
        this.hud.init(container);


        console.log(`window.playerState.progress.mapId:\n${window.playerState.progress.mapId}`)

        this.startMap(window.OverWorldMaps[window.playerState.progress.mapId], window.playerState.progress);

        this.bindActionInput(container);
        this.bindPlayerPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        
        this.startGameLoop();
        this.cameraPerson = this.map.gameObjects.player;

    }
}