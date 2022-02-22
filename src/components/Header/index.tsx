export function Header() {
  const currentDate = new Date().toDateString()

  return (
    <header className='bg-white h-24 flex items-center py-8 px-16 border-b border-solid border-gray-100'>
      <img src='/logo.svg' alt='Podcastr' />
      <p className='ml-8 py-1 pl-8 border-l border-solid border-gray-100'>O melhor para você ouvir, sempre</p>
      <span className='ml-auto capitalize'>{currentDate}</span>
    </header>
  )
}
