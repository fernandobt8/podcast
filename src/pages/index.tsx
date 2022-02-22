import type { GetStaticProps, NextPage } from 'next'
import { format, parseISO } from 'date-fns'
import { api } from '../services/api'
import { convertDuration } from '../utils/convertDuration'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayerContext } from '../components/Player/PlayerContext'
import Head from 'next/head'

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationString: string
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playlist } = usePlayerContext()

  const completeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className='px-16 h-[calc(100vh-6.5rem)] overflow-y-scroll'>
      <Head>
        <title>Home</title>
      </Head>
      <section>
        <h2 className='mt-12 mb-6'>Últimos lançamentos</h2>
        <ul className='grid grid-cols-2 gap-6'>
          {latestEpisodes.map((e, index) => (
            <li key={e.id} className='p-4 bg-white border-1 border-solid border-gray-100 rounded-3xl relative flex items-center'>
              <div className='w-24 h-24 '>
                <Image className='rounded-2xl' src={e.thumbnail} alt={e.title} width={192} height={192} objectFit='cover' />
              </div>
              <div className='flex-1 ml-4'>
                <Link href={`/episodes/${e.id}`}>
                  <a className='block text-gray-800 font-Lexend font-semibold no-underline hover:underline'>{e.title}</a>
                </Link>
                <p className='text-sm mt-2 max-w-[70%] whitespace-nowrap overflow-hidden overflow-ellipsis'>{e.members}</p>
                <span
                  className='inline-block mt-2 text-sm mr-2 pr-2 relative 
                    after:w-[4px] after:h-[4px] after:rounded-[2px] after:bg-[#DDD] 
                    after:absolute after:right-0 after:top-1/2 after:translate-x-1/2 after:-translate-y-1/2'>
                  {e.publishedAt}
                </span>
                <span className='inline-block mt-2 text-sm'>{e.durationString}</span>
              </div>

              <button
                type='button'
                onClick={() => playlist(completeList, index)}
                className='absolute right-8 bottom-8 w-10 h-10 bg-white border border-solid border-gray-100 rounded-xl text-[0]'>
                <img className='w-6 h-6 m-auto' src='/play-green.svg' alt='Tocar episódio' />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className='py-8'>
        <h2>Todos episódios</h2>

        <table cellSpacing={0} className='w-full episodesTable'>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((e, index) => (
              <tr key={e.id}>
                <td className='w-10 h-10 '>
                  <Image className='rounded-lg' width={120} height={120} src={e.thumbnail} alt={e.title} objectFit='cover' />
                </td>
                <td>
                  <Link href={`/episodes/${e.id}`}>
                    <a
                      className='font-Lexend text-gray-800 font-semibold no-underline leading-7 text-base hover:underline'
                      href={`/episodes/${e.id}`}>
                      {e.title}
                    </a>
                  </Link>
                </td>
                <td>{e.members}</td>
                <td className='w-28'>{e.publishedAt}</td>
                <td>{e.durationString}</td>
                <td>
                  <button
                    type='button'
                    onClick={() => playlist(completeList, index + 2)}
                    className='w-8 h-8 bg-white border border-solid border-gray-100 rounded-lg text-[0]'>
                    <img className='w-5 h-5 m-auto' src='/play-green.svg' alt='Tocar episódio' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  })

  const episodes = data.map((e: any) => ({
    id: e.id,
    title: e.title,
    thumbnail: e.thumbnail,
    members: e.members,
    publishedAt: format(parseISO(e.published_at), 'd MMM yy'),
    duration: Number(e.file.duration),
    durationString: convertDuration(Number(e.file.duration)),
    url: e.file.url,
  }))

  return {
    props: {
      latestEpisodes: episodes.slice(0, 2),
      allEpisodes: episodes.slice(2, episodes.length),
    },
    revalidate: 60 * 60 * 8,
  }
}
