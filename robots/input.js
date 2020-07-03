import readline from 'readline-sync';

import StateBot from './state';

class Input{

    go(){
        this.content = {
            maximumSentences: 7
        };

        this.content.searchTerm = this.asskAndReturnSearchTerm();
        this.content.prefix = this.askAndReturnPrefix();



        StateBot.save(this.content);
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

export default new Input();