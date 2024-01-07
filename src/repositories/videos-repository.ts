import {videosCollection} from "../db/db-collections";
import {videosMapper} from "../types/videos/mapper";
import {CreateVideoDto, UpdateVideoDto} from "../types/videos/input";
import {VideoType} from "../types/videos/output";


export class VideosRepository {
    static async getAllVideos() {
        const videos = await videosCollection.find({}).toArray();
        return videos.map(videosMapper);
    }

    static async getVideoById(id: number): Promise<VideoType | null> {
        const video = await videosCollection.findOne({id: id});
        if (!video) {
            return null
        }
        return videosMapper(video);
    }

    static async createVideo(data: CreateVideoDto) {

        const createdAt = new Date();
        const publicationDate = new Date();

        publicationDate.setDate(createdAt.getDate() + 1);

        const newVideo: VideoType = {
            id: +(new Date()),
            title: data.title,
            author: data.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions: data.availableResolutions
        }

        const result = await videosCollection.insertOne(newVideo);
        if (result.insertedId) {
            return newVideo.id;
        } else {
            return null;
        }
    }

    static async updateVideo(id: number, data: UpdateVideoDto) {
        const result = await videosCollection.updateOne({id: id}, {
            $set: {
                title: data.title,
                author: data.author,
                availableResolutions: data.availableResolutions,
                canBeDownloaded: data.canBeDownloaded,
                minAgeRestriction: data.minAgeRestriction,
                publicationDate: data.publicationDate
            }
        })

        return result.matchedCount === 1;
    }

    static async deleteVideo(id: number) {
        const result = await videosCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    }
}
