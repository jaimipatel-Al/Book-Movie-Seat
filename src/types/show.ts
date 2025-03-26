export interface Show {
  _id?: string
  status?: string
  isDeleting?: boolean
  ticketPrice?: number
  theaterId: {
    _id: string
    name ?: string
    location ?: string
  }
}
