import backgroundImage from '/assets/background/background-auth.jpg'

export function SlimLayout({ children }) {
  return (
    <>
      <div className="relative flex min-h-full justify-center md:px-12 lg:px-0">
        <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center sssm:justify-center ssm:justify-center md:flex-none  md:px-28">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            {children}
          </main>
        </div>
        <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
          <img
            className="absolute  w-full h-full"
            src={backgroundImage}
            alt=""
            
          />
        </div>
      </div>
    </>
  )
}
