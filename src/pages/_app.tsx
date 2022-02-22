import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { PlayerProvider } from '../components/Player/PlayerContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <div className='flex '>
        <main className='flex-1'>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  )
}

export default MyApp
