import { Modal, Notice } from "obsidian";
import { LinkProcessorSettings, SecretSettings } from "src/types";
import { LinkProcessor } from "./LinkProcessor";
import { Artist, SpotifyApi } from "@spotify/web-api-ts-sdk";
import dayjs from "dayjs";

interface NewSpotifyArtistData {
    name: string
}

export class SpotifyArtistLinkProcessor extends LinkProcessor<NewSpotifyArtistData> {

    uid: string;
    secretSettings: SecretSettings;

    constructor(
        thisModal: Modal,
        settings: LinkProcessorSettings,
        link: string,
        ansContainerEl: HTMLDivElement,
        uid: string,
        secretSettings: SecretSettings
    ) {
        super(thisModal, "Spotify Artist", settings, link, ansContainerEl);
        this.uid = uid;
        this.secretSettings = secretSettings;
    }

    async getDataFromLink(): Promise<{ filename: string, data: NewSpotifyArtistData } | undefined> {

        const {clientId, secretId} = this.secretSettings.spotify;

        if (!clientId || !secretId) {
            new Notice("Secret Spotify Credentials NOT FOUND!");
            return;
        }

        const sdk: SpotifyApi = SpotifyApi.withClientCredentials(clientId, secretId);

        const ans: Artist = await sdk.artists.get(this.uid);
        // console.info(ans);

        const newData: NewSpotifyArtistData = {
            name: ans.name
        };
        // console.info(newData);

        return {
            filename: newData.name,
            data: newData
        };
    }

    formatData(data: NewSpotifyArtistData): string[] {
        return [
            "Name: " + data.name
        ];

    }

    processTemplate(templateContent: string, data: NewSpotifyArtistData): string {
        return templateContent
            .replace("<% tp.date.now(\"YYYY-MM-DD\") %>", dayjs().format("YYYY-MM-DD"))
            .replace("{name}", data.name)
            .replace("https://open.spotify.com/artist/", `https://open.spotify.com/artist/${this.uid}`);
    }

}