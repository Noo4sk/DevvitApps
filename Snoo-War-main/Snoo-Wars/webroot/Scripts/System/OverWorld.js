class OverWorld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.map = null;
    }


    bloodFlow(delta){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
        const cameraPerson = this.map.gameObjects.player;
        
        Object.values(this.map.gameObjects).forEach( obj => {
            obj.update({
                delta,
                arrow: this.directionInput.direction,
                map: this.map,
            });
        });
        
        this.map.drawLowerImage(this.ctx, cameraPerson);

        Object.values(this.map.gameObjects).sort((a, b) => {
            return a.y - b.y;
        }).forEach( obj => {
            obj.sprite.draw(this.ctx, cameraPerson);

        });
        
        this.map.drawUpperImage(this.ctx, cameraPerson);

        Object.keys(this.map.walls).forEach( obj => {
            let { x, y } = utils.getGridCoord(obj);

            this.map.drawWall(this.ctx, cameraPerson, x, y);
        });
    }
    
    startGameLoop(){
        let previousBeat;
        const beat = 1/60;

        const heart = (timeStamp) => {
            if(this.map.isPaused){
                return;
            }
            if (previousBeat === undefined){
                previousBeat = timeStamp;
            }
            let delta = (timeStamp - previousBeat) / 1000;

            while (delta >= beat){
                this.bloodFlow(delta);
                delta -= beat;
            }
            previousBeat = timeStamp - delta * 1000;

            if(!this.map.isPaused){
                requestAnimationFrame(heart);
            }
        }
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
        this.audioElementButton = document.createElement("div");
        this.audioElementButton.classList.add("AudioElementButtons");
        this.audioElementButton.innerHTML = (`
            <audio id="Audio_Button" autoplay></audio>
        `);

        this.audioElementBGM = document.createElement("div");
        this.audioElementBGM.classList.add("AudioElementBMG");
        this.audioElementBGM.innerHTML = (`
            <audio id="Audio_BGM"></audio>
        `);
        container.appendChild(this.audioElementBGM);
        container.appendChild(this.audioElementButton);

    }
    async init(){
        const container = document.querySelector(".game-container");
        this.startAudio(container);


        this.titleScreen = new TitleScreen({

        });
        //await this.titleScreen.init(container)
        window.snoo_war_Audio_bgm = document.getElementById("Audio_BGM");

        window.snoo_war_Audio_bgm.autoplay = true;
        window.snoo_war_Audio_bgm.src = "./assets/Audio/8_Bit_Menu_David_Renda.mp3"
        window.snoo_war_Audio_bgm.loop = true;
        window.snoo_war_Audio_bgm.volume = 0.02;
        window.snoo_war_Audio_bgm.currentTime = 0;


        this.hud = new Hud();
        this.hud.init(container);

        this.startMap(window.OverWorldMaps.Street);

        
        this.bindActionInput();
        this.bindPlayerPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        
        this.startGameLoop();

    }
}