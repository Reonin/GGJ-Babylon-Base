import { HOSTPATH } from "./Constants.js";

export class ExternalDataManager {
    constructor() {
        this.challengeData;
        this.roundNumber;
        this.shouldDataBeLoaded = true;
    }

    changeRound(number) {
        this.roundNumber = number;
        if (this.shouldDataBeLoaded) {
            this.#loadchallengeData();
            this.shouldDataBeLoaded = false;
        } else {
            //Skip fetching and use data that's present
            this.#executeRoundSwap();
        }

    }
        
    async #loadchallengeData() {
        let hostPath;

        if(location.hostname === "localhost"){
            hostPath = '../';
        }
        else {
            hostPath = HOSTPATH;
        }

        try {
            const response = await fetch(hostPath + 'json/data.json');
            this.challengeData = await response.json();
            this.#executeRoundSwap();
        } catch (error) {
            return console.log(error);
        }
    }


    #executeRoundSwap() {
        console.log(this.challengeData);
        const keys = Object.keys(this.challengeData);
        const randomIndex = keys[Math.floor(Math.random() * keys.length)];
        const item = this.challengeData[randomIndex];

        console.log("%c"+ item.challenge , "color: blue; font-size: 20px; font-weight: bold;");
        
        delete this.challengeData[randomIndex];
    }

    #checkForCorrectAnswer() {
       
    }


    #lockOutInputTemporarily() {
        const time = 3000;
    }
}