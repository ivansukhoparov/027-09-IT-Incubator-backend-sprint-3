export type PostReqBodyCreateType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type UpdatePostDto = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type QueryPostRequestType = {
    sortBy?: string
    sortDirection?: "asc" | "desc"
    pageNumber?: number
    pageSize?: number
}

export type SortPostRepositoryType = {
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}
