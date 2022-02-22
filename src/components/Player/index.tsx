import Image from 'next/image'
import { usePlayerContext } from './PlayerContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useRef, useState } from 'react'
import { convertDuration } from '../../utils/convertDuration'

export function Player() {
  const {
    episodes,
    currentEpIndex,
    isShuffle,
    isLooping,
    isPlaing,
    toggleShuffle,
    toggleLoop,
    togglePlay,
    playPrev,
    playNext,
    hasPrev,
    hasNext,
  } = usePlayerContext()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progresso, setProgresso] = useState<number>(0)

  function setupProgressListener() {
    audioRef.current!.currentTime = 0

    audioRef.current!.addEventListener('timeupdate', () => setProgresso(Math.floor(audioRef.current!.currentTime)))
  }

  function handleSeek(amount: number) {
    audioRef.current!.currentTime = amount
    setProgresso(amount)
  }

  useEffect(() => {
    if (isPlaing) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaing])

  const e = episodes[currentEpIndex]

  return (
    <div className='w-[26.5rem] py-12 px-16 min-h-screen bg-purple-500 text-white flex flex-col items- justify-between'>
      <header className='flex items-center justify-center gap-4'>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong className='font-Lexend font-semibold'>Tocando agora</strong>
      </header>

      {e ? (
        <div className='text-center'>
          <Image className='rounded-3xl' width={592} height={592} src={e.thumbnail} objectFit='cover' />
          <strong className='block mt-8 font-semibold font-Lexend leading-7 text-2xl'>{e.title}</strong>
          <span className='block mt-4 opacity-60 leading-6'>{e.members}</span>
        </div>
      ) : (
        <div className='w-full h-80 rounded-3xl border-2 border-dashed border-purple-300 bg-purple-300 p-16 text-center flex items-center justify-center'>
          <strong className='font-Lexend font-semibold'>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={`self-stretch ${e ? '' : 'opacity-50'}`}>
        <div className='flex items-center gap-2 text-sm'>
          <span className='inline-block w-16 text-center'>{convertDuration(progresso)}</span>
          <div className='flex-1'>
            {e ? (
              <Slider
                max={e.duration}
                value={progresso}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className='w-full h-[4px] bg-purple-300' />
            )}
          </div>
          <span className='inline-block w-16 text-center'>{convertDuration(e?.duration ?? 0)}</span>
        </div>

        {e && (
          <audio
            ref={audioRef}
            src={e.url}
            autoPlay
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
            onPlay={() => togglePlay(true)}
            onPause={() => togglePlay(false)}
            onEnded={() => playNext()}
          />
        )}

        <div className='flex items-center justify-center mt-10 gap-6'>
          {/* buttons */}
          <Button
            src='/shuffle.svg'
            alt='Embaralhar'
            className={isShuffle ? 'invert-[0.65] sepia-[1] saturate-[3] hue-rotate-[100deg]' : ''}
            onClick={toggleShuffle}
            disabled={!e || episodes.length == 1}
          />
          <Button src='/play-previous.svg' alt='Tocar anterior' onClick={playPrev} disabled={!e || !hasPrev} />
          <button
            type='button'
            className='bg-transparent border-[0] text-[0] w-16 h-16 rounded-2xl bg-purple-400 hover:disabled:brightness-100 hover:brightness-95 transition-all'
            disabled={!e}
            onClick={() => togglePlay()}>
            {isPlaing ? (
              <img className='m-auto' src='/pause.svg' alt='Pause' />
            ) : (
              <img className='m-auto' src='/play.svg' alt='Tocar' />
            )}
          </button>
          <Button src='/play-next.svg' alt='Tocar próxima' onClick={playNext} disabled={!e || !hasNext} />
          <Button
            src='/repeat.svg'
            alt='Repetir'
            className={isLooping ? 'invert-[0.65] sepia-[1] saturate-[3] hue-rotate-[100deg]' : ''}
            onClick={toggleLoop}
            disabled={!e}
          />
        </div>
      </footer>
    </div>
  )
}

function Button({ src, alt, className, ...props }: React.HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type='button'
      className={`${className} bg-transparent border-[0] text-[0] hover:disabled:brightness-100 hover:brightness-75 transition-all disabled:opacity-50`}>
      <img src={src} alt={alt} />
    </button>
  )
}
