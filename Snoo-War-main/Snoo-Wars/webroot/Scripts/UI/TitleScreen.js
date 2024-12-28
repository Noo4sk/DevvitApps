class TitleScreen{
    constructor({progress}){
        this.progress = progress;


        this.titleScreenMusic =  new Audio('../assets/Audio/feed-the-machine-classic-arcade-game-116846.mp3');
        this.titleScreenMusic.volume = 0.09;
        this.titleScreenMusic.loop = true;

        this.toggleTitleMusic = true;

        this.LetsGoClicked = new Audio("./assets/Audio/game-start-6104.mp3");
        this.LetsGoClicked.volume = 0.05;

        this.creditsMenu = null;
    }

    getButton(resolve){
        return [
            {
                label: window.playerState.progress.amount <= 0  ? "New Game" : "Continue",
                description: window.playerState.progress.amount <= 0 ? "New Adventure!" : "Jump Back In!",
                handler: () => {
                    if(window.playerState.progress.amount < 1){
                        window.playerState.progress.amount = 1;
                    }

                    this.LetsGoClicked.play();
                    this.close();
                    resolve();
                }
            },
            {
                label: "Credits",
                description: "Tributes!",
                handler: () => {
                    console.log('Credis Clicked');
                    this.creditsMenu.style.display  = 'block';
                }
            }
        ];
    }

    createElement(){
        const { playerState } = window;
        const snoo = playerState.snoo[window.playerId];

        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (`
            <p class="Title_p">SNOO WARS!</p>
            <img class="TitleScreen_Logo" src="${snoo.snooImage}" alt="Snoo Wars" />

             <button class="Sound_Button"></button>

            <div id='credits_Menu' class='Credits'>
                <button id='credit_Menu_Exit'></button>
                
                <h2>Credits</h2>
                <div id="credits-Container">
                    <dl id='credit_Lists'>
                        <dt id='dt_title'> [Tutorial]</dt>
                            <dd id='author'>Drew Conley</dd>
                            <dd>|  - Pizza Legends</dd>

                        <dt id='dt_title'>[Sound] </dt>
                            <dd id='author'>David Renda</dd>
                            <dd>| - Play Track 8 Bit Menu</dd>

                            <dd id='author'>freesound_community</dd>
                            <dd>| - Menu Selection</dd>

                            <dd id='author'>floraphonic</dd>
                            <dd>| -  Cute Level Up 3</dd>

                            <dd id='author'>Dream-Protocol</dd>
                            <dd>| -  feed the machine classic arcade game</dd>
                    </dl>
                </div>
            </div>
        `);

    }

    #DisposeAudio(){
        console.log('Disposing title Screen Music Audio');
        this.titleScreenMusic.pause();
        this.titleScreenMusic.currentTime = 0;
        this.titleScreenMusic.src = "";
    }

    close(){
        this.#DisposeAudio();

        this.keyboardMenu.dispose();
        this.element.remove();
    }

    init(container){
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);

            this.sound_Button = document.querySelector(".Sound_Button");
            this.sound_Button.addEventListener('click', () => {
            
                if(this.toggleTitleMusic){
                  console.log('Click True');
                  this.titleScreenMusic.pause();
                  this.sound_Button.style.backgroundImage = "url('../../../assets/Audio/Image/Stop_White_Music_Note.png')";
                  this.toggleTitleMusic = false;
        
                } else {
                  console.log('Click False');
                  this.titleScreenMusic.play();
                  this.sound_Button.style.backgroundImage = "url('../../../assets/Audio/Image/White_Music_Note.png')";
                  this.toggleTitleMusic = true;
                }
        
            });

            this.creditsMenu = document.querySelector('.Credits');
            this.credits_Menu_Exit = document.getElementById('credit_Menu_Exit');
            this.credits_Menu_Exit.addEventListener('click', () => {
                console.log('credits_Menu_Exit Clicked');
                this.creditsMenu.style.display  = 'none';
            });
            this.titleScreenMusic.play();

            this.keyboardMenu = new KeyBoardMenu();
            this.keyboardMenu.init(this.element);
            this.keyboardMenu.setButton(this.getButton(resolve));
        })
    }
}