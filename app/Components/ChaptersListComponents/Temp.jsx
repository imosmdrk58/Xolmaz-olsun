import React from 'react'
import Image from "next/image";
import Flag from "react-world-flags";

const Temp = ({ manga }) => {
    const getRatingColor = (rating) => {
        switch (rating) {
            case "safe":
                return "bg-green-600";
            case "suggestive":
                return "bg-yellow-600";
            case "erotica":
                return "bg-red-600";
            default:
                return "bg-gray-600";
        }
    };
    const langToCountryMap = {
        ja: "JP", // Japanese
        ms: "MY", // Malay
        ko: "KR", // Korean
        en: "US", // English
        zh: "CN", // Chinese
    };

    const countryCode = langToCountryMap[manga.originalLanguage] || "UN"; // UN for unknown flag
    console.log(manga)
    return (

        <div className="md-content flex-grow">
            <div className="layout-container flex flex-col justify-center items-start manga has-gradient px-4">
                <div className="absolute left-0 top-0 w-full block">
                    <div
                        className="banner-image bg-cover w-full h-[350px]"
                        style={{
                            backgroundImage:
                                `url('${manga.coverImageUrl}')`,
                        }}
                    ></div>
                    <div className="bg-black backdrop-blur-sm absolute left-0 top-0 h-[350px] bg-opacity-40 w-full z-10"></div>
                </div>


                <div className="flex relative z-20 gap-6 flex-row">
                    <div className="">
                        <a
                            href={manga.coverImageUrl}
                            target="_self"
                            className="group w-52 h-60 flex items-start relative mb-auto select-none"
                        >
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="icon xLarge text-white"
                                >
                                    <path
                                        fill="currentColor"
                                        d="m9.5 13.09 1.41 1.41-4.5 4.5H10v2H3v-7h2v3.59zm1.41-3.59L9.5 10.91 5 6.41V10H3V3h7v2H6.41zm3.59 3.59 4.5 4.5V14h2v7h-7v-2h3.59l-4.5-4.5zM13.09 9.5l4.5-4.5H14V3h7v7h-2V6.41l-4.5 4.5z"
                                    ></path>
                                </svg>
                            </div>
                            <img
                                className="rounded shadow-md w-full h-auto"
                                src={`${manga.coverImageUrl}`}
                                alt="Cover image"
                            />
                            <Flag
                                code={countryCode}
                                className="w-10 absolute bottom-2 right-2  shadow-[0_0_4px_rgba(0,0,0,1)] shadow-black "
                                alt="flag"
                            />
                        </a>
                    </div>
                    <div className="title flex flex-col  justify-start items-start">
                        <p className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 leading-tight text-shadow-md text-primary w-full sm:w-auto break-words">
                            {manga.title}
                        </p>

                        <div className="font-normal ml-1 text-base sm:text-xl inline-block leading-tight line-clamp-2" >
                            {manga.altTitle}
                        </div>

                        <div className="flex absolute bottom-2 flex-row gap-2">
                            <div className="font-normal text-xs sm:text-base sm:truncate flex-shrink-0 ">
                                Hokazono Masaya
                            </div>
                        </div>


                    </div>

                </div>



                <div className=" relative ml-[17%] mt-4 flex flex-col  gap-2">
                <div className="grid grid-cols-7 w-full items-center">
  <button 
    className="flex flex-grow bg-[#cc5233] col-span-2 whitespace-nowrap px-2 sm:px-3 rounded custom-opacity relative items-center overflow-hidden primary glow" 
    style={{ minHeight: '3rem'}}>
    <span className="flex relative items-center justify-center font-medium select-none w-full pointer-events-none">
      Watch Now
    </span>
  </button>

  <div className="flex flex-row col-span-5 items-center gap-12 ml-4">
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <img src="/star.svg" alt="Rating" className="w-5 h-5" />
      <span>{manga?.rating?.rating?.average || "N/A"}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <img src="/comment.svg" alt="Comments" className="w-5 h-5" />
      <span>{manga?.rating?.comments?.repliesCount || 0}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <img src="/heart.svg" alt="Likes" className="w-5 h-5" />
      <span>{manga?.rating?.follows || 0}</span>
    </div>
  </div>
</div>


                    <div className="sm:mx-2 flex flex-col" style={{ gridArea: "info" }}>
                        <div className="flex gap-1 flex-wrap items-center">
                        <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-1">
                            <span
                                className={`px-2  py-1 text-[10px] shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 font-semibold rounded-lg text-white ${getRatingColor(
                                    manga.contentRating
                                )}`}
                            >
                                {manga.contentRating.toUpperCase()}
                            </span>

                            {manga.flatTags.slice(0, 4).map((tag,index) => (
                                <span
                                    key={index}
                                    className="bg-gray-900 text-nowrap shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400 p-1 rounded-lg border border-gray-800 text-xs transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                    </div>
                            <span className="tag dot no-wrapper flex flex-row sm:font-bold uppercase">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 6.35 6.35"
                                    className="icon"
                                    style={{ color: "rgb(var(--md-status-blue))" }}
                                >
                                    <path
                                        fill="currentColor"
                                        d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"
                                    ></path>
                                </svg>
                                <span>Publication: 2014, Completed</span>
                            </span>
                        </div>
                        <div className="py-2 text-sm">
                            <div className="align-top items-start justify-start flex flex-row">
                            <p className=' text-xl'>Description:-</p><p className='mt-1.5'>{manga.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>


                    {/* <div className="min-w-0">
                        <div className="break-words">
                            <div className="overflow-hidden transition-[max-height,height] max-h-[78px] h-[78px] mask-image[linear-gradient(black_0%,black_60%,transparent_100%)]">
                                <div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-2 " locale="en">
                                        <div className="mb-2">
                                            <div className="font-bold mb-2">Author</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a href="/author/c3f17d43-f1ed-4300-b52d-22cb5fd1de3c/hokazono-masaya" className="tag">
                                                    <span>Hokazono Masaya</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-bold mb-2">Artist</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a href="/author/c3f17d43-f1ed-4300-b52d-22cb5fd1de3c/hokazono-masaya" className="tag">
                                                    <span>Hokazono Masaya</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-bold mb-2">Genres</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a href="/tag/391b0423-d847-456f-aff0-8b0cfc03066b/action" className="tag">
                                                    <span>Action</span>
                                                </a>
                                                <a href="/tag/b9af3a63-f058-46de-a9a0-e0c13906197a/drama" className="tag">
                                                    <span>Drama</span>
                                                </a>
                                                <a href="/tag/cdad7e68-1419-41dd-bdce-27753074a640/horror" className="tag">
                                                    <span>Horror</span>
                                                </a>
                                                <a href="/tag/ee968100-4191-4968-93d3-f82d72be7e46/mystery" className="tag">
                                                    <span>Mystery</span>
                                                </a>
                                                <a href="/tag/3b60b75c-a2d7-4860-ab56-05f391bb889c/psychological" className="tag">
                                                    <span>Psychological</span>
                                                </a>
                                                <a href="/tag/f8f62932-27da-4fe4-8ee1-6779a8c5edba/tragedy" className="tag">
                                                    <span>Tragedy</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-bold mb-2">Themes</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a href="/tag/eabc5b4c-6aff-42f3-b657-3e90cbd00b75/supernatural" className="tag">
                                                    <span>Supernatural</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-bold mb-2">Demographic</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a href="/titles?demos=seinen" className="tag">
                                                    <span>Seinen</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="hidden mb-2"></div>
                                        <div className="mb-2">
                                            <div className="font-bold mb-2">Read or Buy</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a className="tag" href="http://mangalifewin.takeshobo.co.jp/rensai/kichikuisland/" target="_blank" rel="noopener noreferrer">
                                                    <span>Official Raw</span>
                                                </a>
                                                <a className="tag" href="https://bookwalker.jp/series/214471/list" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#fff" d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.79.79 0 0 1 0 3.44V.794C0 .354.354 0 .794 0"></path>
                                                        <path fill="#e50012" d="M3.563.826h.406V3.41h-.406z"></path>
                                                        <path fill="#009fe8" d="M.265 3.34.792.81l.397.083-.527 2.53z"></path>
                                                        <path fill="#530000" d="M1.19.826h.406V3.41H1.19z"></path>
                                                        <path fill="#b4b4b5" d="M1.98.826h.407V3.41H1.98z"></path>
                                                        <path fill="#009844" d="M2.772.826h.405V3.41h-.405z"></path>
                                                    </svg>
                                                    <span>Book☆Walker</span>
                                                </a>
                                                <a className="tag" href="https://www.amazon.co.jp/gp/product/B075GSKLRP" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#fff" d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.79.79 0 0 1 0 3.44V.794C0 .354.354 0 .794 0"></path>
                                                        <path
                                                            fill="#ffa700"
                                                            d="M3.537 3.064a.7.7 0 0 0-.382.107c-.034.024-.028.057.01.053.125-.015.403-.049.453.015s-.055.326-.102.443c-.014.035.016.05.048.023.209-.175.262-.54.22-.593-.021-.026-.123-.05-.247-.048M.34 3.09c-.025.004-.037.043-.01.073.456.518 1.057.83 1.725.83.476 0 1.03-.19 1.41-.545.064-.058.01-.147-.054-.112-.428.229-.893.34-1.317.34A2.94 2.94 0 0 1 .37 3.1a.05.05 0 0 0-.03-.01"
                                                        ></path>
                                                        <path
                                                            d="M2.094.257c-.468 0-.99.175-1.1.753-.012.062.033.094.074.103l.476.052c.045-.003.077-.047.086-.091.04-.2.208-.295.395-.295.102 0 .217.037.277.127.069.102.059.24.059.357v.065c-.285.031-.658.053-.925.17a.835.835 0 0 0-.524.804c0 .511.322.767.736.767.35 0 .541-.083.811-.358.09.13.119.192.282.328.037.02.084.018.117-.012v.002c.099-.088.277-.243.378-.327.04-.033.033-.086.001-.131-.09-.124-.185-.225-.185-.456V1.35c0-.325.022-.624-.217-.847-.189-.181-.501-.245-.74-.245zm.268 1.464v.107c0 .192.004.351-.092.522-.079.138-.203.223-.341.223-.189 0-.3-.144-.3-.357 0-.419.377-.495.733-.495"
                                                        ></path>
                                                    </svg>
                                                    <span>Amazon</span>
                                                </a>
                                                <a className="tag" href="https://ebookjapan.yahoo.co.jp/books/553949/" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#fff" d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.79.79 0 0 1 0 3.44V.794C0 .354.354 0 .794 0"></path>
                                                        <path
                                                            fill="#e95e5b"
                                                            d="M3.518 2.116s.218-.129.218-.436-.218-.435-.218-.435L2.008.374l-1.51.87 1.51.872s.218.129.218.436-.218.435-.218.435.218.13.218.436-.218.436-.218.436l1.51-.872s.218-.129.218-.435-.218-.436-.218-.436"
                                                        ></path>
                                                        <path
                                                            fill="#231815"
                                                            d="M3.845 1.68c0-.364-.26-.523-.27-.53h-.002L2.063.28a.11.11 0 0 0-.11 0L.46 1.14c-.026.015-.071.041-.071.104a.11.11 0 0 0 .053.094.41.41 0 0 1 .165.342.4.4 0 0 1-.165.343.11.11 0 0 0-.054.093.11.11 0 0 0 .054.094.41.41 0 0 1 .165.342.4.4 0 0 1-.165.343.11.11 0 0 0-.054.093.11.11 0 0 0 .055.095l1.51.871a.11.11 0 0 0 .11 0l1.51-.871a.62.62 0 0 0 .272-.53.64.64 0 0 0-.162-.436.64.64 0 0 0 .162-.437M.813 1.552l1.14.658c.01.007.164.109.164.342a.42.42 0 0 1-.12.304L.68 2.096a.64.64 0 0 0 .145-.416 1 1 0 0 0-.012-.128m0 .871 1.14.658c.011.008.164.11.164.342a.42.42 0 0 1-.12.305L.68 2.968a.64.64 0 0 0 .145-.416 1 1 0 0 0-.012-.128zm2.649.47-1.139.658a1 1 0 0 0 .012-.128.64.64 0 0 0-.145-.415l1.318-.76a.42.42 0 0 1 .119.304.4.4 0 0 1-.164.342zm0-.87-1.139.657a1 1 0 0 0 .012-.128.62.62 0 0 0-.272-.53L.716 1.245 2.008.498l1.455.839c.012.008.164.11.164.342a.4.4 0 0 1-.164.343z"
                                                        ></path>
                                                    </svg>
                                                    <span>eBookJapan</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="font-bold mb-2">Track</div>
                                            <div className="flex gap-2 flex-wrap">
                                                <a className="tag" href="https://www.mangaupdates.com/series.html?id=107006" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#cbd6e8" stroke="#92a0ad" d="M3 .5h10c1.385 0 2.5 1.115 2.5 2.5v10c0 1.385-1.115 2.5-2.5 2.5H3A2.495 2.495 0 0 1 .5 13V3C.5 1.615 1.615.5 3 .5z"></path>
                                                        <path
                                                            fill="#ff8c15"
                                                            d="M14.22 12.29q0 .333-.048.681-.047.348-.19.633-.142.286-.395.476-.254.19-.666.19-.506 0-.776-.317-.253-.317-.348-.776-.158-.76-.206-1.52l-.063-1.536q-.016-.776-.08-1.536-.063-.76-.253-1.52-.174.602-.364 1.204t-.412 1.188q-.174.428-.348.87-.159.429-.285.872-.111.364-.19.744-.08.38-.174.745-.032.142-.095.364-.064.206-.159.427-.079.222-.174.412t-.206.285q-.253.222-.602.301-.332.095-.65.095-.506 0-.807-.364-.3-.364-.443-.808-.111-.332-.174-.665-.064-.348-.143-.68-.206-.904-.49-1.775-.27-.87-.508-1.774-.316.713-.57 1.425-.237.713-.332 1.473-.08.554-.095 1.124 0 .554-.143 1.11-.11.41-.364.633-.238.237-.681.237-.412 0-.681-.174-.27-.158-.428-.428-.158-.269-.221-.601-.048-.349-.048-.697 0-.744.19-1.584.19-.855.46-1.71.269-.855.554-1.695.3-.84.522-1.568.206-.713.301-1.41.111-.696.27-1.408.063-.301.205-.586.159-.301.365-.523.221-.221.506-.364.286-.142.618-.142.238 0 .49.079.254.063.46.206.206.126.333.332t.127.491q0 .206-.032.412-.032.19-.032.396 0 1.742.238 3.437.237 1.695.728 3.373.65-1.49 1.093-3.041.444-1.552.855-3.12.127-.46.238-.935t.333-.918q.206-.412.506-.665.317-.27.792-.27.285 0 .57.064.301.047.539.19.237.127.38.364.158.222.158.57 0 .254-.031.507-.016.238-.016.49 0 1.189.142 2.377.159 1.172.428 2.344.222.998.364 1.995.159.982.159 1.995z"
                                                        ></path>
                                                    </svg>
                                                    <span>MangaUpdates</span>
                                                </a>
                                                <a className="tag" href="https://www.anime-planet.com/manga/kichikujima" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#1c3867" d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.79.79 0 0 1 0 3.44V.794C0 .354.354 0 .794 0"></path>
                                                        <path
                                                            fill="#f0574b"
                                                            d="M2.117.926a1.19 1.19 0 0 0-1.19 1.19 1 1 0 0 0 .015.19c.253.137.612.27 1.026.368.425.101.819.147 1.114.14a1.2 1.2 0 0 0 .225-.697A1.19 1.19 0 0 0 2.117.926m-1.114 1.61a1.19 1.19 0 0 0 1.114.771 1.2 1.2 0 0 0 .813-.32 6.5 6.5 0 0 1-1.927-.45z"
                                                        ></path>
                                                        <path
                                                            fill="#f69330"
                                                            d="M.935 1.522c-.346.017-.669.093-.709.232-.082.286.66.695 1.67.936s1.941.24 2.024-.045c.04-.139-.203-.344-.49-.511l-.002.08c.133.099.195.212.172.291-.064.222-.787.238-1.632.037S.498 1.997.562 1.775c.024-.081.153-.149.331-.174z"
                                                        ></path>
                                                    </svg>
                                                    <span>Anime-Planet</span>
                                                </a>
                                                <a className="tag" href="https://anilist.co/manga/92494" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#19212d" d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.79.79 0 0 1 0 3.44V.794C0 .354.354 0 .794 0"></path>
                                                        <path fill="#0af" d="M2.247.794c-.104 0-.16.057-.16.16v.155l.815 2.33h.807c.104 0 .162-.056.162-.16v-.354c0-.104-.058-.161-.162-.161h-.947V.954c0-.103-.057-.16-.161-.16z"></path>
                                                        <path fill="#fff" d="M1.293.794.363 3.44h.722l.158-.458h.786l.154.458h.719L1.976.794zm.114 1.602.225-.733.247.733z"></path>
                                                    </svg>
                                                    <span>AniList</span>
                                                </a>
                                                <a className="tag" href="https://kitsu.app/manga/32162" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#493c47" d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.79.79 0 0 1 0 3.44V.794C0 .354.354 0 .794 0"></path>
                                                        <path
                                                            fill="#e75e45"
                                                            d="M1.551.266a.1.1 0 0 0-.079.018q-.01.008-.02.018L1.44.32a.73.73 0 0 0-.121.527 1 1 0 0 0-.12.071c-.007.005-.065.045-.11.087A.74.74 0 0 0 .554.928L.532.933Q.519.938.509.945a.11.11 0 0 0-.03.148v.003l.006.008q.133.18.296.318l.003.003c.07.06.203.146.3.181 0 0 .6.231.63.245.012.004.03.01.037.01a.106.106 0 0 0 .125-.084l.003-.038V1.06a1.2 1.2 0 0 0-.061-.345L1.816.71a1.8 1.8 0 0 0-.19-.39L1.623.31 1.62.308a.1.1 0 0 0-.069-.042M1.533.43q.086.142.143.296a1.3 1.3 0 0 0-.224.06.6.6 0 0 1 .081-.356m1.102.558a1.17 1.17 0 0 0-.588.126q-.016.007-.033.017v.605c0 .008 0 .04-.005.066a.24.24 0 0 1-.246.193.4.4 0 0 1-.095-.021l-.525-.204-.05-.02a5 5 0 0 0-.59.592l-.011.013a.11.11 0 0 0 0 .123.11.11 0 0 0 .083.047.1.1 0 0 0 .065-.018 3 3 0 0 1 .668-.364.11.11 0 0 1 .127.02c.037.038.039.1.007.14l-.036.06a3 3 0 0 0-.304.665l-.005.019v.001a.1.1 0 0 0 .016.084.11.11 0 0 0 .085.046.1.1 0 0 0 .064-.019l.024-.021q.003-.006.006-.01a3 3 0 0 1 .273-.332 3.1 3.1 0 0 1 1.666-.929q.007-.002.015-.001a.067.067 0 0 1 .063.07.065.065 0 0 1-.052.06c-.603.129-1.69.845-1.31 1.885l.02.041a.11.11 0 0 0 .083.047c.018 0 .07-.005.102-.062.061-.116.177-.246.513-.385.935-.387 1.09-.94 1.106-1.291v-.02A1.19 1.19 0 0 0 2.635.988m-1.92.06a.6.6 0 0 1 .268.06 1 1 0 0 0-.138.188 2 2 0 0 1-.224-.24 1 1 0 0 1 .094-.009zm1.367 2.01c.194.314.533.34.533.34-.347.145-.484.288-.557.404a1.02 1.02 0 0 1 .024-.744"
                                                        ></path>
                                                    </svg>
                                                    <span>Kitsu</span>
                                                </a>
                                                <a className="tag" href="https://myanimelist.net/manga/77247" target="_blank" rel="noopener noreferrer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" className="icon small text-icon-contrast text-undefined">
                                                        <path fill="#2e51a2" d="M.794 0H3.44c.44 0 .793.354.793.794V3.44c0 .44-.354.793-.793.793H.794A.79.79 0 0 1 0 3.44V.794C0 .354.354 0 .794 0"></path>
                                                        <path
                                                            fill="#fff"
                                                            d="M1.935 2.997a1.5 1.5 0 0 1-.149-.378 1 1 0 0 1-.032-.317 1 1 0 0 1 .037-.325c.077-.286.267-.479.53-.538.085-.019.155-.023.345-.023h.17l.083.295-.461.004-.042.014a.39.39 0 0 0-.225.195.6.6 0 0 0-.048.126c.128.01.212.006.36.006v-.297h.376v1.059h-.381v-.466h-.212c-.206 0-.212 0-.212.01a1.3 1.3 0 0 0 .152.458c-.007.008-.266.195-.27.197q-.008 0-.02-.02zM.265 1.416H.6l.3.428.303-.428h.336v1.402H1.2l-.002-.85-.302.378-.291-.383-.003.855H.265zm2.9.005h.333v1.095l.47.003-.073.291-.73.003z"
                                                        ></path>
                                                    </svg>
                                                    <span>MyAnimeList</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="font-bold mb-1">Alternative Titles</div>
                                            <div className="mb-1 flex gap-x-2 alt-title">
                                                <div className="select-none" style={{ display: 'inline-block !important', minWidth: '24px', minHeight: '24px' }}>
                                                    <img className="select-none" title="English" src="/img/flags/gb.svg" alt="English flag icon" width="24" height="24" />
                                                </div>
                                                <span>Evil Land</span>
                                            </div>
                                            <div className="mb-1 flex gap-x-2 alt-title">
                                                <div className="select-none" style={{ display: 'inline-block !important', minWidth: '24px', minHeight: '24px' }}>
                                                    <img className="select-none" title="Japanese" src="/img/flags/jp.svg" alt="Japanese flag icon" width="24" height="24" />
                                                    <img title="Japanese" src="/img/scripts/kanji.svg" alt="Japanese script icon" width="12" height="12" style={{ marginTop: '-12px', marginLeft: 'auto', marginRight: '-2px' }} />
                                                </div>
                                                <span>鬼畜島</span>
                                            </div>
                                            <div className="mb-1 flex gap-x-2 alt-title">
                                                <div className="select-none" style={{ display: 'inline-block !important', minWidth: '24px', minHeight: '24px' }}>
                                                    <img className="select-none" title="Japanese (Romanized)" src="/img/flags/jp.svg" alt="Japanese (Romanized) flag icon" width="24" height="24" />
                                                    <img title="Japanese (Romanized)" src="/img/scripts/latin.svg" alt="Japanese (Romanized) script icon" width="12" height="12" style={{ marginTop: '-12px', marginLeft: 'auto', marginRight: '-2px' }} />
                                                </div>
                                                <span>Kichikujima</span>
                                            </div>
                                            <div className="mb-1 flex gap-x-2 alt-title">
                                                <div className="select-none" style={{ display: 'inline-block !important', minWidth: '24px', minHeight: '24px' }}>
                                                    <img className="select-none" title="Ukrainian" src="/img/flags/ua.svg" alt="Ukrainian flag icon" width="24" height="24" />
                                                </div>
                                                <span>Диявольський острів</span>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="font-bold mb-1">Final Chapter</div>
                                            <div className="mb-1">Volume 24, Chapter 143</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* <div className="min-w-0" style={{ gridArea: 'content' }}>
                        <div className="overflow-x-auto w-full mt-2 mb-4">
                            <div className="select__tabs">
                                <div className="track">
                                    <div className="selector" style={{ left: '4px', width: '92.8375px', height: '32px' }}></div>
                                </div>
                                <a className="select__tab active" href="?tab=chapters">
                                    <span>Chapters</span>
                                </a>
                                <a className="select__tab" href="?tab=comments">
                                    <span>Comments (118)</span>
                                </a>
                                <a className="select__tab" href="?tab=art">
                                    <span>Art</span>
                                </a>
                                <a className="select__tab" href="?tab=related">
                                    <span>Related</span>
                                </a>
                            </div>
                        </div>
                         <div className="flex gap-6 items-start" loading="false" statistics="[object Object]">
                            <div className="flex-grow">
                                <div className="flex gap-x-2 mb-4">
                                    <button className="mr-auto rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden accent text-sm">
                                        <span className="flex relative items-center justify-center font-medium select-none w-full pointer-events-none">Descending</span>
                                    </button>
                                    <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden accent text-sm">
                                        <span className="flex relative items-center justify-center font-medium select-none w-full pointer-events-none">Mark all on page as read</span>
                                    </button>
                                    <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden accent text-sm">
                                        <span className="flex relative items-center justify-center font-medium select-none w-full pointer-events-none">Index</span>
                                    </button>
                                </div>
                                <div>
                                    <div className="flex flex-col">
                                        <div className="grid grid-cols-12 mb-2 cursor-pointer">
                                            <div className="col-span-4">No Volume</div>
                                            <div className="text-center col-span-4">Ch. 77 - 129</div>
                                            <div className="text-right col-span-4">
                                                <span>96</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-chevron-down icon text-icon-contrast" viewBox="0 0 24 24" style={{ transition: 'transform 150ms ease-in-out', transform: 'rotate(180deg)' }}>
                                                    <path d="m6 9 6 6 6-6"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="rounded flex flex-col gap-2">
                                            <div className="bg-accent rounded-sm">
                                                <div>
                                                    <div className="flex chapter relative" expanded="true">
                                                        <a href="/chapter/e5f1d051-f47d-4159-82a3-409148c9e57d" className="chapter-grid flex-grow">
                                                            <div className="flex flex-grow items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-eye icon small text-icon-contrast flex-shrink-0 cursor-pointer readMarker" viewBox="0 0 24 24">
                                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"></path>
                                                                    <circle cx="12" cy="12" r="3"></circle>
                                                                </svg>
                                                                <img className="inline-block select-none flex-shrink-0 h-5 w-5 -mx-0.5" title="English" src="/img/flags/gb.svg" alt="English flag icon" width="24" height="24" />
                                                                <span className="chapter-link ml-2 font-bold my-auto flex items-center space-x-1">
                                                                    <span className="line-clamp-1">Ch. 129 - The Apocrypha</span>
                                                                </span>
                                                            </div>
                                                        </a>
                                                        <a href="https://forums.mangadex.org/threads/1457632" target="_blank" rel="noopener nofollow noreferrer" className="justify-self-start comment-container hover">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon small text-icon-contrast">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                            </svg>
                                                            <span>8</span>
                                                        </a>

                                                        <div className="flex items-center" style={{ gridArea: 'groups' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon small text-icon-contrast rounded mr-0.5">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"></path>
                                                            </svg>
                                                            <div className="flex items-center space-x-1">
                                                                <a href="/group/df26827b-7f60-4679-8e16-90772cc5a403/dutch-guys" className="group-tag lift" title="Dutch guys">Dutch guys</a>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center whitespace-nowrap" style={{ gridArea: 'views' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-eye icon small text-icon-contrast mr-1" viewBox="0 0 24 24">
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"></path>
                                                                <circle cx="12" cy="12" r="3"></circle>
                                                            </svg>
                                                            <span className="text-[0.8em]">N/A</span>
                                                        </div>
                                                        <div className="user-tag flex items-center" style={{ gridArea: 'uploader' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon small text-icon-contrast mr-0.5">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8"></path>
                                                            </svg>
                                                            <a href="/user/4c39c6ce-b6ba-482b-a720-a5724e60ada8/obese-piglet" className="line-clamp-1 break-all px-1 rounded duration-100 pill lift" title="Obese_Piglet" style={{ color: 'rgb(52, 152, 219)' }}>Obese_Piglet</a>
                                                        </div>
                                                        <div className="flex items-center timestamp" style={{ gridArea: 'timestamp' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-clock icon small text-icon-contrast mr-1 sm:mr-1.5 md:mr-2" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <path d="M12 6v6l4 2"></path>
                                                            </svg>
                                                            <time dateTime="2023-09-17T15:15:28+00:00" title="9/17/2023, 8:45:28 PM" className="whitespace-nowrap">last year</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center flex-wrap gap-2 mt-6">
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden accent text rounded-full !px-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-arrow-left icon" viewBox="0 0 24 24">
                                                <path d="M19 12H5m7 7-7-7 7-7"></path>
                                            </svg>
                                        </button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">1</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">2</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">3</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">4</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">5</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">6</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">7</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">8</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">9</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden primary">10</button>
                                        <button className="rounded custom-opacity relative md-btn flex items-center px-3 overflow-hidden accent text rounded-full !px-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-arrow-right icon" viewBox="0 0 24 24">
                                                <path d="M5 12h14m-7 7 7-7-7-7"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div> */}
                </div>

            </div>
        </div>

    )
}

export default Temp