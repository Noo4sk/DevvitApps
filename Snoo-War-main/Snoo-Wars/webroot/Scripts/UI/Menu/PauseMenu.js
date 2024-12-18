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

    close(){
        this.esc?.unbind();
        this.keyBoardMenu.dispose();
        this.hudElement.remove();

        this.onComplete();
    }

    getOptions(pageKey){
        // BUTTONS
        const back = {
            type: "button",
            label: "Back",
            description: "Return to main menu",
            handler: () => {
                // Back
                this.keyBoardMenu.setOptions(this.getOptions("root"));
            }
        }
        const close = {
            type: "button",
            label: "Close",
            description: "Exit Menu",
            handler: () => {
                // Back
                this.close();
            }
        }

        if (pageKey === "root") {
            const snoo = playerState.lineup.map(id => {
                console.log(JSON.stringify(playerState, undefined, 2));

                const {name} = playerState.snoo[id];

                return {
                    label: name,
                    description: "Test",
                    handler: () => {
                        this.keyBoardMenu.setOptions( this.getOptions(id) )
                    }
                }
            })

            return [
              ...snoo,
              close
            ]
          }


        // Nothing Found?
        return [
            back
        ];
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