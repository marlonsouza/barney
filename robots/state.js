import fs from 'fs';

const contentFilePath = './data/content.json';

class State{

    save(content){
        const contentString = JSON.stringify(content);

        return fs.writeFileSync(contentFilePath, contentString);
    }

    load(){
        const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
        const contentJson = JSON.parse(fileBuffer);
        return contentJson;
    }
}

export default new State();