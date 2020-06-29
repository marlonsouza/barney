import 'dotenv/config';

import readline from 'readline-sync';

class App{
    constructor(){
        this.start();
    }

    start(){
        const content = {};

        content.searchTerm = this.asskAndReturnSearchTerm();
        content.prefix = this.askAndReturnPrefix();

        console.log(content);
        
    }

    asskAndReturnSearchTerm(){
        return readline.question('Whats up Dude? What do you want? ');
    }

    askAndReturnPrefix(){
        const prefixes = ['Who is', 'Whats is', 'The history of'];

        const selectedPrefixes = readline.keyInSelect(prefixes, 'Choose your destiny:');

        return prefixes[selectedPrefixes];
    }
}

export default new App();