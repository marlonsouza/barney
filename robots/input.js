import readline from 'readline-sync';

class Input{
    constructor(content){
        this.content = content;
    }

    go(){
        this.content.searchTerm = this.asskAndReturnSearchTerm();
        this.content.prefix = this.askAndReturnPrefix();
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

export default Input;