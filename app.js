import 'dotenv/config';

import Input from './robots/input';
import TextBot from './robots/text';

class App{
    constructor(){
        this.start();
    }

    async start(){
        this.InputBot = new Input();
        this.TextBot = new TextBot();

        this.InputBot.go();
        await this.TextBot.go();
        
        console.log(content);

    }

    
}

export default new App();