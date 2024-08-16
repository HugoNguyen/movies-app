"use client"

import { Movie } from "@/utils/db";
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
    }, [clip])

    return <>
        <div className="flex justify-center p-6">
            <div className="rounded-lg shadow-lg max-w-sm">
                <a href="#!">
                    <video ref={videoRef} width="320" height="240" muted={true} controls className="w-full rounded-t-lg" playsInline autoPlay>
                        {clip && <source src={`/api/clip/${clip}`} type="video/mp4" />}
                    </video>
                </a>
                <div className="flex flex-col gap-2 p-6">
                    {movie && movie.clips && movie.clips.map(e => <div key={e} onClick={() => setClip(e)} className="cursor-pointer w-full rounded-lg border px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200">{e}</div>)}
                </div>
            </div>
        </div>
    </>
}

export default MoviePage;