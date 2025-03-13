interface Cast {
  character?: string
  name?: string
  profilePath?: string
}

interface Crew {
  job?: string
  name?: string
  profilePath?: string
}

export interface Movie {
  _id?: string
  posterUrl?: string
  title?: string
  mobile?: string
  isActive?: boolean
  image?: string
  backdropUrl?: string
  genres?: string[]
  rating?: number
  cast?: Cast[]
  crew?: Crew[]
  languages?: string[]
  createdAt?: string
  overview?: string
  duration?: number
  categories?: string[]
  releaseDate?: string
}
