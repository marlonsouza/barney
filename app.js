import 'dotenv/config';

import Input from './robots/input';
import TextBot from './robots/text';

class App{
    constructor(){
        this.start();
    }

    async start(){
        const content = {
            maximumSentences: 7
        };

        this.InputBot = new Input(content);
        this.TextBot = new TextBot(content);

        this.InputBot.go();
        await this.TextBot.go();
        
        console.log(content);

    }

    
}

export default new App();