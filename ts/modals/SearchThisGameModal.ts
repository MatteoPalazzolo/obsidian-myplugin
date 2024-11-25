import { App, Modal, Notice } from 'obsidian';
import { fetchSteamBanner } from '../utils/FetchBanner';

export class SearchThisGameModal extends Modal {
	constructor(app: App) {
		super(app);
	}
    
	async onOpen() {
		const {contentEl} = this;
        
        contentEl.createEl('h3', { text: 'This Game Image' });

        const val = this.app.workspace.getActiveFile()?.basename;
        if (val === undefined) {
            new Notice(`Target file not detected.`);
        }

        const bannerImgUrlList = await fetchSteamBanner(val as string);
        bannerImgUrlList.slice(0,6).forEach(url => {
            const img = contentEl.createEl('img', { attr: { src: url }, cls :"banner-image-selection click" });
            // onclick: copy to clipboard
            img.addEventListener("click", function(evt: MouseEvent) {
                const imgSrc = this.src;
                navigator.clipboard.writeText(imgSrc).then(() => {
                    new Notice('Link copiato nella clipboard!');
                    console.log('Link copiato nella clipboard!');
                  }).catch(err => {
                    new Notice('Errore nel copiare il testo:', err);
                    console.log('Errore nel copiare il testo:', err);
                  });
            })
        });

    }
    
	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}