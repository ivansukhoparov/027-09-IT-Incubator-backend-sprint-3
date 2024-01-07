export type ViewModelType<R> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: R[]
}
