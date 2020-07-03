import State from "./state";

import { google } from "googleapis";

const customSearch = google.customsearch('v1');

class Image {
  
  async go() {
    this.content = State.load();
    
    await this.fetchImagesOfAllSentences();

    State.save(this.content);
  }

  async fetchImagesOfAllSentences(){
    for(const sentence of this.content.sentences){
        const query = `${this.content.searchTerm} ${sentence.keywords[0]}`;

        sentence.images = await this.fetchGoogleAndReturnImages(query);
    }  
  }

  async fetchGoogleAndReturnImages(query){
      const response = await customSearch.cse.list({
          auth: process.env.CUSTOM_SEARCH_API_KEY,
          cx: process.env.CUSTOM_SEARCH_ENGINE_ID,
          q: query,
          searchType: 'image',
          imgSize: 'huge',
          num: 2
      });

      return response.data.items.map(({link}) => link);
  }
}

export default new Image();
