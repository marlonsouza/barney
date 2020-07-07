import State from "./state";

import { google } from "googleapis";
import imageDownloader from "image-downloader";
import gm from "gm";
import path from "path";

const customSearch = google.customsearch("v1");

class Image {
  async go() {
    this.content = State.load();

    //await this.fetchImagesOfAllSentences();
    //await this.downloadAllImages();
    await this.convertAllImages();

    State.save(this.content);
  }

  async convertAllImages() {
    for (const [iSentence] of this.content.sentences.entries()) {
      await this.convertImage(iSentence);
    }
  }

  async convertImage(iSentence) {
    return new Promise((resolve, reject) => {
      const originalFile = path.resolve(
        __dirname,
        "..",
        "data",
        "images",
        `${iSentence}-original.png[0]`
      );
      const convertedFile = path.resolve(
        __dirname,
        "..",
        "data",
        "images",
        `${iSentence}-converted.png`
      );
      const width = 800;
      const height = 600;

      console.log(originalFile);

      gm(originalFile)
        .resize(width, height)
        .blur(7, 3)
        .autoOrient()
        .write(convertedFile, (error) => {
          if (error) {
            return reject(error);
          }

          console.log(`=> Image converted: ${convertedFile}`);
          resolve();
        });
    });
  }

  async downloadAllImages() {
    this.content.downloadedImages = [];

    for (const [iSentece, sentence] of this.content.sentences.entries()) {
      for (const [iImage, image] of sentence.images.entries()) {
        try {
          if (this.content.downloadedImages.includes(image)) {
            throw new Error(`Image já baixada`);
          }

          await this.downloadImge(image, `${iSentece}-original.png`);
          this.content.downloadedImages.push(image);
          console.log(
            `[${iSentece}][${iImage}] Baixou imagem com sucesso ${image}`
          );
          break;
        } catch (error) {
          console.log(
            `[${iSentece}][${iImage}] Erro ao baixar imagem ${Image}: ${error}`
          );
        }
      }
    }
  }

  async downloadImge(url, fileName) {
    return imageDownloader.image({
      url,
      dest: `./data/images/${fileName}`,
    });
  }

  async fetchImagesOfAllSentences() {
    for (const sentence of this.content.sentences) {
      const query = `${this.content.searchTerm} ${sentence.keywords[0]}`;

      sentence.images = await this.fetchGoogleAndReturnImages(query);
    }
  }

  async fetchGoogleAndReturnImages(query) {
    const response = await customSearch.cse.list({
      auth: process.env.CUSTOM_SEARCH_API_KEY,
      cx: process.env.CUSTOM_SEARCH_ENGINE_ID,
      q: query,
      searchType: "image",
      imgSize: "huge",
      num: 2,
    });

    return response.data.items.map(({ link }) => link);
  }
}

export default new Image();
