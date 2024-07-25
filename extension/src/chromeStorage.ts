class ExtensionStorage {
  public language: string;
  public clientId: string;
  public token: string;

  constructor() {
    this.init();
  }

  private async init() {
    const storage = await chrome.storage.sync.get();

    this.clientId = storage.clientId;
    this.token = storage.token;

    const languages = await chrome.i18n.getAcceptLanguages();
    this.language = languages[0];
  }

  public async setAuthOnInstall(clientId: string, token: string) {
    await chrome.storage.sync.set({ clientId, token });

    this.clientId = clientId;
    this.token = token;
  }
}
export const storage = new ExtensionStorage();
