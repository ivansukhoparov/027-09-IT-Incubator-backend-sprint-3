import {AvailableResolutions} from "./output";


export type CreateVideoDto = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
}
export type UpdateVideoDto = {
    title: string
    author: string
    availableResolutions: typeof AvailableResolutions
    canBeDownloaded: boolean
    minAgeRestriction: number|null
    publicationDate: string
}