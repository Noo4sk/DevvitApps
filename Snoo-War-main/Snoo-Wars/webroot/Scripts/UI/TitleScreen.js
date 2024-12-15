class TitleScreen{
    constructor({progress}){
        this.progress = progress;
    }

    getOptions(resolve){
        const newGameSelected = new Audio("./assets/Audio/game-start-6104.mp3")
        newGameSelected.volume = 0.05;

        return [
            {
                label: "New Game",
                description: "New Adventure!",
                handler: () => {
                    newGameSelected.play();
                    this.close();
                    resolve();
                }
            }
        ];
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (`
            <img class="TitleScreen_Logo" src="/assets/Logo/TitleScreen_Logo.png" alt="Snoo Wars" />
        `);
    }

    close(){
        this.keyboardMenu.dispose();
        this.element.remove();
    }

    init(container){
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);
            this.keyboardMenu = new KeyBoardMenu();
            this.keyboardMenu.init(this.element);
            this.keyboardMenu.setOptions(this.getOptions(resolve));
        })
    }
}