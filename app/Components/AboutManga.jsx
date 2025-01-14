import Image from 'next/image'
import React from 'react'

const AboutManga = ({ manga }) => {
    console.log(manga)
    return (
        <div>
            <article id="" className="dark:text-foreground">
                <div className="mb-2 text-white">
                    <h1 className="text-4xl font-semibold mb-4">{manga.title}</h1>

                    <div className="inline-flex w-full gap-8 text-gray-400 mb-6">
                        <span className="flex items-center gap-2">
                            <Image src='/star.svg' alt="star" width={24} height={24} />
                            <span>{manga.rating.rating.average}</span>
                            <span>/</span>
                            <span>10</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <Image src='/heart.svg' alt="heart" width={24} height={24} />
                            <span>{manga.rating.follows}</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <Image src='/comment.svg' alt="comment" width={24} height={24} />
                            <span>{manga.rating?.comments?.repliesCount??"N/A"}</span>
                        </span>
                        <span className="text-gray-400 flex items-center gap-2 ml-auto">
                            <Image src='/clock.svg' alt="clock" width={24} height={24} />
                            <span className="hidden lg:inline">Updated: </span>
                            <span>{new Date(manga.updatedAt).toLocaleDateString()}</span>
                        </span>
                    </div>

                    <div className="detail-info mb-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="w-full flex justify-center">
                                <img
                                    className="w-full h-72 object-fill rounded-lg shadow-lg"
                                    src={manga.coverImageUrl}
                                    alt={manga.title}
                                />
                            </div>
                            <div className="space-y-6">
                                <ul className=' flex flex-col justify-center items-start gap-5'>
                                    <li className="flex flex-row gap-3">
                                        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Image width={24} height={24} src='/othername.svg' alt="other name" />
                                            <span>Other Names</span>
                                        </p>
                                        <p className="pl-10 lg:pl-0 text-white">{manga.altTitle}</p>
                                    </li>
                                    <li className="flex flex-row gap-3">
                                        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Image width={24} height={24} src='/author.svg' alt="author" />
                                            <span>Author</span>
                                        </p>
                                        <p className="pl-10  text-white">{manga.authorName}</p>
                                    </li>
                                    <li className="flex flex-row gap-3">
                                        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Image width={24} height={24} src='/status.svg' alt="status" />
                                            <span>Status</span>
                                        </p>
                                        <div className="">
                                            <span className="flex flex-row bg-gray-900 shadow-[0_0_3px_rgba(0,0,0,1)] shadow-slate-400  p-1.5 pl-0 rounded-lg border border-gray-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 6.35 6.35" className="icon">
                                                    <path fill={manga.status === "completed" ? "#00c9f5" : manga.status === "ongoing" ? "#04d000" : "#da7500"} d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"></path>
                                                </svg>
                                                <span>{manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}</span>
                                            </span>
                                        </div>
                                    </li>

                                    <li className="flex flex-row justify-center items-start gap-3">
                                        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Image width={24} height={24} src='/category.svg' alt="category" />
                                            <span>Category</span>
                                        </p>
                                        <div className="pl-10 flex flex-wrap gap-4">
                                            {manga.tags.map(tag => (
                                                <a key={tag} className="bg-gray-900 shadow-[0_0_4px_rgba(0,0,0,1)] shadow-slate-400  p-1.5  rounded-lg border border-gray-800 text-sm  transition-colors">
                                                    {tag}
                                                </a>
                                            ))}
                                        </div>
                                    </li>
                                    <li className="flex flex-row gap-3">
                                        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Image width={24} height={24} src='/views.svg' alt="views" />
                                            <span>Views</span>
                                        </p>
                                        <p className="pl-10 text-white">N/A</p>
                                    </li>
                                    <li className="flex flex-row gap-3">
                                        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Image width={24} height={24} src='/source.svg' alt="source" />
                                            <span>Source</span>
                                        </p>
                                        <p className="pl-10 ">
                                            <a href={`https://mangadex.org/title/${manga.id}`} target="_blank" className="text-blue-500 hover:text-blue-600 transition-colors">
                                                MangaDex
                                            </a>
                                            <span className="text-gray-400"> , </span>
                                            <a href={`https://anilist.co/manga/${manga.id}`} target="_blank" className="text-blue-500 hover:text-blue-600 transition-colors">
                                                Anilist
                                            </a>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 grid sm:grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            <div className="detail-content mb-10">
                                <h2 className="mb-4 text-2xl font-semibold text-slate-400 flex items-center gap-4">
                                    <Image width={28} height={29} src='/content.svg' alt="content" />
                                    <span>Content</span>
                                </h2>
                                <div className="w-full text-white text-base leading-relaxed">
                                    <p>{manga.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-10 justify-center sm:justify-start">
                                <button className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto">
                                    <Image width={24} height={24} src='/views.svg' alt="view" />
                                    Read Now
                                </button>
                                <button className="flex items-center justify-center gap-3 px-6 py-3 border-2 border-blue-600 text-blue-600 text-base font-medium rounded-lg shadow-md hover:bg-blue-100 hover:border-blue-700 transition-all duration-300 w-full sm:w-auto">
                                    Sign in to follow
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </article>
        </div>

    )
}

export default AboutManga