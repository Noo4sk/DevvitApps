class PauseMenu {
    constructor({onComplete}){
        this.onComplete = onComplete;
    }

    createElement(){
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("PauseMenu");
        this.hudElement.innerHTML = (`
            <h2>Pause Menu</h2>
        `);
    }

    getOptions(pageKey){
        const back = {
            label: "Back",
            description: "Return to main menu",
            handler: () => {
                // Back
                this.keyBoardMenu.setOptions(this.getOptions("root"));
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
                const lineupSnoo = playerState.lineup.map(snoo => {
                    const { id } = playerState.snoo[snoo];
                    const base = Snoo[snoo];

                    return {
                        label: base.name,
                        description: base.description,
                        handler: () => {
                            this.keyBoardMenu.setOptions(this.getOptions(id));
                        }
                    }
                });

                // Case One Show Top Level Menu
                return [ 
                    // Your Snoo
                    ...lineupSnoo,
                    {
                        label: "Sound",
                        description: "Option to turn off sound",
                        handler: () => {
                            this.keyBoardMenu.setOptions(this.getOptions("Sound"));
                        }
                    },
                    close,
                ]
            
            case "Sound":
                return [
                    {
                       "test":"test"
                    },
                    back
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

        this.onComplete();
    }

    async init(container){
        this.createElement();
        this.keyBoardMenu = new KeyBoardMenu({
            descriptionContainer: container,
        });

        this.keyBoardMenu.init(this.hudElement);
        this.keyBoardMenu.setOptions(this.getOptions("root"));
    
        container.appendChild(this.hudElement);

        await utils.wait(200);
        this.esc = new KeyPressListener("Escape", () => {
            this.close();
        });
    }
}