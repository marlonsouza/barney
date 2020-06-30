import algorithmia from 'algorithmia';

import algorithmiaConfig from '../config/algorithmia';
import sbd from 'sbd';

class Text{
    constructor(content){
        this.content = content;
    }

    async go(){
       await this.fetchContentFromWikipedia();
       this.sanitizeContent();
       this.breakContentIntoSentences(); 
    }

    async fetchContentFromWikipedia(){
        const algorithmiaAuthenticated = algorithmia(algorithmiaConfig.API_KEY);
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo(algorithmiaConfig.ALGO);
        
        const response = await wikipediaAlgorithm.pipe(this.content.searchTerm);

        this.content.sourceContentOriginal = response.get().content;
    }

    sanitizeContent(){
        const withoutBlankLinesAndMarkDown = this.removeBlankLinesAndMarkDown(this.content.sourceContentOriginal);
        const withoutDatesInParentheses = this.removeDatesInParentheses(withoutBlankLinesAndMarkDown);

        this.content.sourceContentSanitized = withoutDatesInParentheses;

    }

    breakContentIntoSentences(){
        this.content.sentences = [];
        
        const sentences = sbd.sentences(this.content.sourceContentSanitized);

        sentences.forEach(s => this.content.sentences.push({
            text: s,
            keywords: [],
            images:[]
        }));

        console.log(this.content);
    }

    removeBlankLinesAndMarkDown(text){
        const allLines = text.split('\n');
        
        const blankLines = l => l.trim().length !== 0;
        const markDown = l => !l.trim().startsWith('=');

        return allLines.filter(blankLines).filter(markDown).join(' ');
    }

    removeDatesInParentheses(text){
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
    }
}

export default Text;