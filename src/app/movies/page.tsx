import React from "react";
import { connect } from '@/utils/db';
import Link from "next/link";

const getMovies = async () => {
    const movies = connect();
    return movies;
}

export default async function MoviesPage() {
    const movies = await getMovies();

    return <div>
        {
            movies.map(movie => (
                <a key={movie.id} href="#" className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={`/resources/${movie.thumbnail}`} alt=""></img>
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        {
                            movie.clips.map(c => (
                                <div key={c}><Link href={`/clip/${c}`}>{c}</Link></div>
                            ))
                        }
                    </div>
                </a>
            ))
        }
    </div>
}