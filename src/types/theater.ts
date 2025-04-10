export interface Theater {
  _id?: string
  name?: string
  location?: string
  city?: {
    name?: string
    state?: string
  }
  image?: string
  isActive?: boolean
  isDeleting?: boolean
  no_of_screens?: number
  ownerId?: {
    _id?: string
  }
}
