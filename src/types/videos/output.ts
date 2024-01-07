import {WithId} from "mongodb";

export type VideoType ={
    id:number
    title:	string
    author:	string
    canBeDownloaded:	boolean
    minAgeRestriction:	number |null
    createdAt: 	string //($date-time)
    publicationDate:	string //($date-time)
    availableResolutions: typeof AvailableResolutions

}


export const AvailableResolutions: string[] = [ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ];
