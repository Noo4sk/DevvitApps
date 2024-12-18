class OverWorld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.canvas.setAttribute('tabindex', '0');

        this.ctx = this.canvas.getContext("2d");

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

        this.cameraPerson = null
    }

    AudioFadeOut(duration){

        const startTime = window.AudioCtx.currentTime;
        const endTime = startTime + duration;

        console.log(`Fading out Audio.. in ${endTime}`)
        window.AudioGainNode.gain.setValueAtTime(window.AudioGainNode.gain.value, startTime);
        window.AudioGainNode.gain.linearRampToValueAtTime(0, endTime);

        // Optionally, pause the audio after the fade-out
        setTimeout(() => {
            window.AudioBgm.pause();
        }, duration * 1000);
    }


    bloodFlow(delta){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
        this.cameraPerson = this.map.gameObjects.player;
        
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

    
    bindMouseClick(container){
        // container.addEventListener(`mousedown`, (event) => {
        //     const rect = this.canvas.getBoundingClientRect(); // canvas position relative to viewport

        //     const canvasX = event.clientX - rect.left;
        //     const canvasY = event.clientY - rect.top;

        //     let x = Math.floor(canvasX - 8 + utils.withGrid(10.5) - this.cameraPerson.x);
        //     let y = Math.floor(canvasY - 12 + utils.withGrid(10.5) - this.cameraPerson.y);
        
        //     window.MouseClick = {
        //         x: x,
        //         y: y,
        //     };
            
        //     console.log(`Mouse Click [${(MouseClick.x / 16)},${(MouseClick.y / 16)}]`);
        // });
    }

    devStats(container){
        this.developerStats = document.createElement("div");
        this.developerStats.classList.add("developerStats");
        this.developerStats.innerHTML = (`
            <svg class="background">
                <rect width="60" height="60" ></rect>
            </svg>
            <span class="Items">
                <p class="fps">FPS | 9999999999</p>
                <p class="delta">Delta | 9999999999</p>
                <p class="beat">Beat | 9999999999</p>
                <p class="lastRender">LastRender | 9999999999</p>
            </span>
        `);

        container.appendChild(this.developerStats);
    }




    startGameLoop() {
        this.bindMouseClick(this.canvas);

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

                delta -= beat;
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
                    { type: "pause"}
                ]);
            }
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
        this.map = new OverWorldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();

        if(InitialState){
            this.map.gameObjects.player.x = InitialState.x;
            this.map.gameObjects.player.y = InitialState.y;
            this.map.gameObjects.player.direction = InitialState.direction;
        }
    }

    startAudio(container){


        // this.audioElementButton = document.createElement("div");
        // this.audioElementButton.classList.add("AudioElementButtons");
        // this.audioElementButton.innerHTML = (`
        //     <audio id="Audio_Button"></audio>
        // `);

        // this.audioElementBGM = document.createElement("div");
        // this.audioElementBGM.classList.add("AudioElementBMG");
        // this.audioElementBGM.innerHTML = (`
        //     <audio id="Audio_BGM"></audio>
        // `);
        // container.appendChild(this.audioElementBGM);
        // container.appendChild(this.audioElementButton);

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

        // EventUtils.emitEvent("PersonStandComplete", {
        //     whoId: this.id,
        // });

        this.canvas.focus();
        this.canvas.addEventListener("focus", () => {
            window.AudioBgm.play();
            window.AudioGainNode.gain.linearRampToValueAtTime(1, window.AudioCtx.currentTime + 2);
        });

        this.titleScreen = new TitleScreen({

        });
        await this.titleScreen.init(container)


        this.pFps = document.querySelector(".fps");
        this.pDelta = document.querySelector(".delta");
        this.pBeat = document.querySelector(".beat");
        this.pLastRender = document.querySelector(".lastRender");



        this.canvas.focus();


        this.hud = new Hud();
        this.hud.init(container);

        this.startMap(window.OverWorldMaps.Street);

        
        this.bindActionInput(container);
        this.bindPlayerPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        


        this.startGameLoop();
    }
}