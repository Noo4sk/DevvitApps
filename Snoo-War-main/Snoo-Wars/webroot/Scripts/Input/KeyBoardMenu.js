class KeyBoardMenu {
    constructor(config={}){
        this.options = [];
        this.up = null;
        this.down = null;
        this.prevFocus = null;

        this.descriptionContainer = config.descriptionContainer || null;
    }

    setOptions(options){
        const menu_buttons = new Audio("./assets/Audio/menu-selection-102220.mp3")
        menu_buttons.volume = 0.05;


        this.options = options;

        this.element.innerHTML = this.options.map( (option, index) => {
            const disabledAttr = option.disabled ? "disabled" : "";

            return (`
                <div class="option">
                    <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
                        ${option.label}
                    </button>
                    <span class="right">${option.right ? option.right() : ""}</span>
                </div>
            `)
        }).join("");

        this.element.querySelectorAll("button").forEach( button => {
            button.addEventListener('click', () => {
                const chosenOption = this.options[ Number(button.dataset.button) ];
                chosenOption.handler();
            });
            button.addEventListener('mouseenter', async () => {
                button.focus();
            });
            button.addEventListener('focus', () => {
                menu_buttons.play();
                this.prevFocus = button;
                this.descriptionElementText.innerText = button.dataset.description;
            });
        });

        setTimeout(() => {
            this.element.querySelector("button[data-button]:not([disabled])").focus();
        }, 10);
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("KeyBoardMenu");

        this.descriptionElement = document.createElement("div");
        this.descriptionElement.classList.add("DescriptionBox");
        this.descriptionElement.innerHTML = (`<p>Place Holder Text!</p>`);
        this.descriptionElementText = this.descriptionElement.querySelector("p");

    }

    dispose(){
        this.element.remove();
        this.descriptionElement.remove();

        this.up.unbind();
        this.down.unbind();
    }

    init(container){
        this.createElement();
        (this.descriptionContainer || container).appendChild(this.descriptionElement);
        container.appendChild(this.element);

        this.up = new KeyPressListener('ArrowUp', () => {
            const currentBtn = Number(this.prevFocus.getAttribute("data-button"));
            const prevsBtn = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find( elem => {
                return elem.dataset.button < currentBtn && !elem.disabled;
            });

            prevsBtn?.focus();
        });

        this.down = new KeyPressListener('ArrowDown', () => {
            const currentBtn = Number(this.prevFocus.getAttribute("data-button"));
            const nextBtn = Array.from(this.element.querySelectorAll("button[data-button]")).find( elem => {
                return elem.dataset.button > currentBtn && !elem.disabled;
            });

            nextBtn?.focus();
        });
    }
}