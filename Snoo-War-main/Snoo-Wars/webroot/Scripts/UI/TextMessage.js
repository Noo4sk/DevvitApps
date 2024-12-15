class TextMessage {
    constructor({ text, onComplete}){
        this.text = text;
        this.onComplete = onComplete;

        this.element = null;
    }

    createElement(){
        const menu_buttons = new Audio("./assets/Audio/menu-selection-102220.mp3")
        menu_buttons.volume = 0.05;

        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (`
            <p class="TextMessage_p"></p>
            <button class="TextMessage_button">Next</button>
        `);

        this.revealingText = new RevealingText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text
        });

        // bindings
        this.element.querySelector("button").addEventListener("click", () => {
            menu_buttons.play();
            
            this.done();
        });

        this.actionListenerEnter = new KeyPressListener("Enter", () => {
            menu_buttons.play();

            this.done();
        });

        this.actionListenerSpace = new KeyPressListener("Space", () => {
            menu_buttons.play();

            this.done();
        });

    }

    done(){
        if (this.revealingText.isDone){
            this.element.remove();
            this.actionListenerEnter.unbind();
            this.actionListenerSpace.unbind();

            this.onComplete();

        } else {
            this.revealingText.warpToDone();
        }
    }

    init(container){
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();
    }
}