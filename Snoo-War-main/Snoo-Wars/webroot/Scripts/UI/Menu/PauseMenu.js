class PauseMenu {
    constructor({onComplete, progress}){
        this.progress = progress;
        this.onComplete = onComplete;
    }

    createElement(){
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("PauseMenu");
        this.hudElement.innerHTML = (`
            <h2>Pause Menu</h2>
        `);
        this.soundMenu;
    }

    createElement(container){
        this.pauseMenu_Container = document.createElement('div');
        this.pauseMenu_Container.classList.add('pauseMenu-Container');
        this.pauseMenu_Container.innerHTML = (`
            <div class="SoundMenu">
                <div id='switch-container'>
                    <p id='Sound_on_off'> Music </p>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
                <button id="soundMenu_Exit"></button>
            </div>    
        `)

        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("PauseMenu");
        this.hudElement.innerHTML = (`
            <h2>Pause Menu</h2>
        `);

        this.pauseMenu_Container.appendChild(this.hudElement);
        container.appendChild(this.pauseMenu_Container);

    }

    getOptions(pageKey){
        const back = {
            label: "Back",
            description: "Return to main menu",
            handler: () => {
                // Back
                this.keyBoardMenu.setButton(this.getOptions("root"));
            }
        }
        const close = {
            label: "Close",
            description: "Exit Menu",
            handler: () => {
                // Back
                this.close();
            }
        }
        
        switch (pageKey) {
            case "root":
                // Case One Show Top Level Menu
                return [
                    {
                        label: "Save",
                        description: "Save The Game",
                        handler: () => {
                            this.progress.save();
                            this.close();
                        }
                    },
                    {
                        label: "Sound",
                        description: "Option to turn off sound",
                        handler: () => {
                            this.soundMenu.style.display  = 'block';

                        }
                    },
                    close,
                ]
            default:
                return [
                    back
                ];
        }
    }

    close(){
        this.esc?.unbind();
        this.keyBoardMenu.dispose();
        this.hudElement.remove();
        this.pauseMenu_Container.remove();

        this.onComplete();
    }

    async init(container){
        this.createElement(container);

        this.soundMenu = document.querySelector('.SoundMenu')

        this.btnSoundMenuExit = document.getElementById("soundMenu_Exit");
        this.btnSoundMenuExit.addEventListener('click', () => {
            console.log('btnSoundMenuExit click');
            this.soundMenu.style.display  = 'none';
        })

        this.keyBoardMenu = new KeyBoardMenu({
            descriptionContainer: container,
        });

        this.keyBoardMenu.init(this.hudElement);
        this.keyBoardMenu.setButton(this.getOptions("root"));
    

        await utils.wait(200);
        this.esc = new KeyPressListener("Escape", () => {
            this.close();
        });
    }
}