import algorithmia from 'algorithmia';

import algorithmiaConfig from '../config/algorithmia';
import sbd from 'sbd';

import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

class Text{
    constructor(content){
        this.content = content;

        this.nlu = new NaturalLanguageUnderstandingV1({
            version: process.env.NATURAL_LANGUAGE_VERSION,
            authenticator: new IamAuthenticator({
                apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY
            }),
            url: process.env.NATURAL_LANGUAGE_URL
        });
    }

    async go(){
       await this.fetchContentFromWikipedia();
       this.sanitizeContent();
       this.breakContentIntoSentences(); 
       this.limitMaximumSenteces();
       await this.fetchKeywordsAllSentences();
    }

    async fetchKeywordsAllSentences(){
        for(const sentence of this.content.sentences){
            sentence.keywords = await this.fetchWatsonAndExtractTasks(sentence.text);
        }
    }

    limitMaximumSenteces(){
        const {sentences, maximumSentences} = this.content;
        
        this.content.sentences = sentences.slice(0, maximumSentences);
    }

    async fetchWatsonAndExtractTasks(sentence){
        return new Promise((resolve, reject) => {
            this.nlu.analyze({
                text: sentence,
                features:{
                    keywords:{}
                }},
                (error, {result}) =>{
                    if(error){
                        reject(error);
                    }
    
                    const keywords = result.keywords.map(k => {
                        console.log(k);
                        return k.text;
                    });

                    resolve(keywords);
                }
            );
        });
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