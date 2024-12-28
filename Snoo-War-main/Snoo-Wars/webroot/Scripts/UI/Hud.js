class Hud {
    constructor(){
        this.scoreBoards = [];

        this.moneyElement;
    }

    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        window.playerState.lineup.forEach(key => {

            const snoo = window.playerState.snoo[key];

            const scoreBoard = new Combatant({
                id: key,
                ...Snoo[snoo.id],
                ...snoo,
            }, null);

            scoreBoard.createElement();

            this.scoreBoards.push(scoreBoard);

            this.element.appendChild(scoreBoard.hudElement);
        });

        this.moneyElement = document.createElement("div");
        this.moneyElement.classList.add("MoneyAmount");
        this.moneyElement.innerHTML = (`
            <p class="pMoneyElement">$9,999,999,999</p>
            <svg viewBox="0 0 26 2" class="moneyElement-container">
                <rect x=0 y=0 width="25px" height="5px" fill="#2f2f2f" />
            </svg>
        `);

        this.element.appendChild(this.moneyElement);
        this.updateMoney();
        this.update();

    }

    update(){
        this.scoreBoards.forEach( item => {
            item.update(window.playerState.snoo[item.id]);
        });

        this.updateMoney();
    }

    updateMoney(){
        let pMoneyContainer = this.moneyElement.querySelector(".pMoneyElement");
        pMoneyContainer.innerText =`$${window.playerState.money}`;
    }


    init(container){
        this.createElement();
        container.appendChild(this.element);

        document.addEventListener("PlayerStateUpdated", () => {
            this.update();
            this.updateMoney();
        });
    }
}