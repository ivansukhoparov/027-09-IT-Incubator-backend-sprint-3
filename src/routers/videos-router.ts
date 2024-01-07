import {Router, Request, Response} from "express";
import {ErrorType, Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {AvailableResolutions, VideoType} from "../types/videos/output";
import {CreateVideoDto, UpdateVideoDto} from "../types/videos/input";
import {VideosRepository} from "../repositories/videos-repository";
import {HTTP_STATUSES} from "../utils/comon";


export const videosRouter = Router()

videosRouter.get("/", async (req: Request, res: Response): Promise<void> => {
    const videos = await VideosRepository.getAllVideos()
    res.send(videos);
})

videosRouter.get("/:id", async (req: RequestWithParams<Params>, res: Response): Promise<void> => {
    const id: number = +req.params.id;
    const video: VideoType | null = await VideosRepository.getVideoById(id);
    if (!video) {
        res.sendStatus(404)
    } else {
        res.status(200).send(video)
    }
})

videosRouter.post("/", async (req: RequestWithBody<CreateVideoDto>, res: Response): Promise<void> => {
    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} = req.body;

    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"});
    }

    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        errors.errorsMessages.push({message: "Invalid author", field: "author"});
    }

    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: "Invalid availableResolutions",
                field: "availableResolutions"
            });
        })
    } else {
        availableResolutions = []
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const newVideoId = await VideosRepository.createVideo({title, author, availableResolutions})
    const newVideo = await VideosRepository.getVideoById(newVideoId!)
    res.status(201).send(newVideo);
})

videosRouter.put("/:id", async (req: RequestWithBodyAndParams<Params, UpdateVideoDto>, res: Response): Promise<void> => {
    const id: number = +req.params.id;
    const video = await VideosRepository.getVideoById(id);

    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body;


    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: "Invalid title", field: "title"});
    }

    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        errors.errorsMessages.push({message: "Invalid author", field: "author"});
    }

    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            if (!AvailableResolutions.includes(r)) {
                errors.errorsMessages.push({message: "Invalid availableResolutions", field: "availableResolutions"})
            }
        })
    } else if (!Array.isArray(availableResolutions)) {
        errors.errorsMessages.push({message: "Invalid availableResolutions", field: "availableResolutions"})
    }

    if (typeof canBeDownloaded !== "boolean") {
        errors.errorsMessages.push({message: "Invalid canBeDownloaded", field: "canBeDownloaded"})
    }

    if (typeof minAgeRestriction === "number") {
        if (minAgeRestriction < 1 || minAgeRestriction > 18) {
            errors.errorsMessages.push({
                message: "Invalid minAgeRestriction",
                field: "minAgeRestriction"
            });
        }
    } else if (minAgeRestriction !== null && typeof minAgeRestriction !== "number") {
        errors.errorsMessages.push({
            message: "Invalid minAgeRestriction",
            field: "minAgeRestriction"
        });
    }


    const dateTest = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z")
    if (!dateTest.test(publicationDate) && video) {
        publicationDate = video.publicationDate;
    }

    if (errors.errorsMessages.length > 0) {
        res.status(400).send(errors);
        return
    }

    if (!video) {
        res.sendStatus(404)
    } else {

        const updateItem: VideoType = {
            id: video.id,
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded,
            minAgeRestriction: minAgeRestriction,
            createdAt: video.createdAt,
            publicationDate: publicationDate,
            availableResolutions: availableResolutions
        };

        await VideosRepository.updateVideo(id, updateItem);
        res.sendStatus(204);
    }
})

videosRouter.delete("/:id", async (req: RequestWithParams<Params>, res: Response): Promise<void> => {
    const id: number = +req.params.id;
    const isDeleted = await VideosRepository.deleteVideo(id);
    if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

