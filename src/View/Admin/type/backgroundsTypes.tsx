export interface BackgroundImage {
    imageId: number;
    mobileUrl: string;
    webUrl: string;
}

export interface BackgroundImageResponse {
    images: BackgroundImage[];
}
