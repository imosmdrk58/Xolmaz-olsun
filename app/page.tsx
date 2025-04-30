import {AppProps} from 'next/app';

function App({Component, pageProps}: AppProps) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ?  <div className="fixed -z-10 inset-0 flex flex-col justify-center items-center bg-black/40 backdrop-blur-sm">
            <div className="w-12 h-12 mt-10 rounded-full animate-spin
                    border-8 border-solid border-purple-500 border-t-transparent shadow-md"></div>
            <span className="mt-6 text-white text-lg font-medium tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Loading...
            </span>
        </div> : <Component {...pageProps} />}
    </div>
  );
}
export default App;