import 'dotenv/config';

import InputBot from './robots/input';
import TextBot from './robots/text';
import ImageBot from './robots/image';
import StateBot from './robots/state';

class App{
    constructor(){
        this.go();
    }

    async go(){

        //InputBot.go();
        //await TextBot.go();
        await ImageBot.go();
    
        const content = StateBot.load();
        console.dir(content, {showHidden: false, depth: null});

    }

    
}

export default new App();