import { createContext, ReactChildren, ReactNode, useContext, useState } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerData = {
  episodes: Episode[]
  currentEpIndex: number
  isLooping: boolean
  isShuffle: boolean
  isPlaing: boolean
  play: (episode: Episode) => void
  playlist: (episodes: Episode[], index: number) => void
  toggleShuffle: () => void
  toggleLoop: () => void
  togglePlay: (state?: boolean) => void
  playNext: () => void
  playPrev: () => void
  hasPrev: boolean
  hasNext: boolean
}

const PlayerContext = createContext({} as PlayerData)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentEpIndex, setCurrEpIndex] = useState<number>(0)
  const [isPlaing, setPlaing] = useState<boolean>(false)
  const [isLooping, setLooping] = useState<boolean>(false)
  const [isShuffle, setShuffle] = useState<boolean>(false)

  function playlist(episodes: Episode[], index: number) {
    setEpisodes(episodes)
    setCurrEpIndex(index)
    setPlaing(true)
  }

  function play(episode: Episode) {
    setEpisodes([episode])
    setCurrEpIndex(0)
    setPlaing(true)
  }

  const hasNext = isShuffle || currentEpIndex + 1 < episodes.length
  const hasPrev = isShuffle || currentEpIndex - 1 >= 0

  function playNext() {
    if (isShuffle) {
      setCurrEpIndex(Math.floor(Math.random() * episodes.length))
    } else if (hasNext) {
      setCurrEpIndex(currentEpIndex + 1)
    }
  }

  function playPrev() {
    if (isShuffle) {
      setCurrEpIndex(Math.floor(Math.random() * episodes.length))
    } else if (hasPrev) {
      setCurrEpIndex(currentEpIndex - 1)
    }
  }

  function togglePlay(state?: boolean) {
    setPlaing(state == null ? !isPlaing : state)
  }

  function toggleLoop() {
    setLooping(!isLooping)
  }
  function toggleShuffle() {
    setShuffle(!isShuffle)
  }

  return (
    <PlayerContext.Provider
      value={{
        episodes,
        currentEpIndex,
        isShuffle,
        isLooping,
        isPlaing,
        play,
        playlist,
        toggleShuffle,
        toggleLoop,
        togglePlay,
        playPrev,
        playNext,
        hasPrev,
        hasNext,
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayerContext = () => useContext(PlayerContext)
