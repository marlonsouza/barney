import State from "./state";

import { google } from "googleapis";
import imageDownloader from 'image-downloader';

const customSearch = google.customsearch('v1');

class Image {
  
  async go() {
    this.content = State.load();
    
    await this.fetchImagesOfAllSentences();
    await this.downloadAllImages();

    State.save(this.content);
  }

  async downloadAllImages(){
    this.content.downloadedImages = [];

    for(const [iSentece, sentence] of this.content.sentences.entries()){
        for(const [iImage, image] of sentence.images.entries()){
            try{
                if(this.content.downloadedImages.includes(image)){
                    throw new Error(`Image já baixada`);
                }

                await this.downloadImge(image, `${iSentece}${iImage}-original.png`);
                this.content.downloadedImages.push(image);
                console.log(`[${iSentece}][${iImage}] Baixou imagem com sucesso ${image}`);
                break;
            }catch(error){
                console.log(`[${iSentece}][${iImage}] Erro ao baixar imagem ${Image}: ${error}`);
            }
        }
    }
  }

  async downloadImge(url, fileName){
    return imageDownloader.image({
        url,
        dest: `./data/${fileName}`
    });
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
