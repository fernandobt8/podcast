import { format, parseISO } from 'date-fns'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayerContext } from '../../components/Player/PlayerContext'
import { api } from '../../services/api'
import { convertDuration } from '../../utils/convertDuration'

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationString: string
  description: string
  url: string
}

export default function Episode({ episode }: { episode: Episode }) {
  const { play } = usePlayerContext()
  return (
    <div className='max-w-3xl py-12 px-8 mx-auto'>
      <Head>
        <title>{episode.title}</title>
      </Head>
      <div className='relative'>
        <Link href='/'>
          <button
            type='button'
            className='w-12 h-12 rounded-xl border-0 absolute z-10 text-[0] 
          transition-all hover:brightness-90 left-0 top-1/2 bg-purple-500
          -translate-x-1/2 -translate-y-1/2'>
            <img className='rounded-2xl m-auto' src='/arrow-left.svg' alt='Voltar' />
          </button>
        </Link>
        <Image className='rounded-3xl' width={700} height={160} src={episode.thumbnail} objectFit='cover' alt='' />
        <button
          type='button'
          onClick={() => play(episode)}
          className='w-12 h-12 rounded-xl border-0 absolute z-10 text-[0]
           transition-all hover:brightness-90 right-0 top-1/2 bg-green-500
           translate-x-1/2 -translate-y-1/2'>
          <img className='rounded-2xl m-auto' src='/play.svg' alt='Tocar' />
        </button>
      </div>

      <header className='pb-4 border-b border-solid border-gray-200'>
        <h1 className='mt-8 mb-6'>{episode.title}</h1>
        <span className='inline-block text-sm'>{episode.members}</span>
        <span
          className='inline-block text-sm ml-4 pl-4 relative
            before:w-[4px] before:h-[4px] before:rounded-[2px] before:bg-[#DDD] 
            before:absolute before:left-0 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2'>
          {episode.publishedAt}
        </span>
        <span
          className='inline-block text-sm ml-4 pl-4 relative
            before:w-[4px] before:h-[4px] before:rounded-[2px] before:bg-[#DDD] 
            before:absolute before:left-0 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2'>
          {episode.durationString}
        </span>
      </header>

      <div className='mt-8 leading-7 text-gray-800 pChild' dangerouslySetInnerHTML={{ __html: episode.description }} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  })

  return {
    paths: data.map((e: any) => ({ params: { id: e.id } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const { data: e } = await api.get(`/episodes/${context.params!.id}`)

  const episode = {
    id: e.id,
    title: e.title,
    thumbnail: e.thumbnail,
    members: e.members,
    publishedAt: format(parseISO(e.published_at), 'd MMM yy'),
    duration: Number(e.file.duration),
    durationString: convertDuration(Number(e.file.duration)),
    description: e.description,
    url: e.file.url,
  }

  return {
    props: { episode },
    revalidate: 60 * 60 * 24,
  }
}
