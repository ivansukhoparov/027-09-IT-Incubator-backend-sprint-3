import {WithId} from "mongodb";
import {VideoType} from "./output";

export const videosMapper = (video:WithId<VideoType>):VideoType=>{
    return {
        id:video.id,
        title:	video.title,
        author:	video.author,
        canBeDownloaded:	video.canBeDownloaded,
        minAgeRestriction:	video.minAgeRestriction,
        createdAt: 	video.createdAt,
        publicationDate:	video.publicationDate,
        availableResolutions: video.availableResolutions
    }
}
