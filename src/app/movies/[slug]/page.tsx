"use client"

import { Movie } from "@/utils/db";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const getMovie = (id: string): Promise<Movie> => {
    return fetch(`/api/movies/${id}`).then(res => res.json());
}

const MoviePage = ({ params }: {
    params: {
        slug: string
    }
}) => {
    const [movie, setMovie] = useState<Movie>();
    const [clip, setClip] = useState<string | null>();

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        getMovie(params.slug).then(rs => setMovie(rs));
    }, [params.slug]);

    useEffect(() => {
        if (movie) {
            setClip(movie?.clips[0]);
        } else {
            setClip(null);
        }
    }, [movie]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [clip]);

    return <>
        <div className="flex justify-center p-6">
            <div className="rounded-lg shadow-lg max-w-sm">
                <video ref={videoRef} width="320" height="240" muted={true} controls className="w-full rounded-t-lg" playsInline>
                    {/* {clip && <source src={`/api/clip/${clip}`} type="video/mp4" />} */}
                    {clip && <source src={ !movie?.path ? `/resources/${clip}` : `/resources/${movie?.path}/${clip}` } type="video/mp4" />}
                </video>
                <div className="flex flex-col gap-2 p-6">
                    {movie && movie.clips && movie.clips.map(e => <div key={e} onClick={() => setClip(e)} className="cursor-pointer w-full rounded-lg border px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200">{e}</div>)}
                </div>
                <div className="flex flex-col gap-2 p-6">
                    {
                        movie && movie.tags && movie.tags.map(
                            q => <Link key={q} className="cursor-pointer bg-blue-200 hover:bg-blue-300 py-1 px-2 rounded-lg text-sm" href={'/movies?' + `query=${q}`}>{q}</Link>
                        )
                    }
                </div>
            </div>
        </div>
    </>
}

export default MoviePage;