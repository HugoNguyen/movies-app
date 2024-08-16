"use client"
import React, { useEffect, useState } from "react";
import { Movie } from '@/utils/db';
import MovieItemCard from "./components/movie-item-card";

const getMovies = (): Promise<Movie[]> => {
    return fetch("/api/movies").then(res => res.json());
}

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        getMovies().then(rs => setMovies(rs));
    }, []);

    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-10 md:px-20">
        {
            movies.map(movie => <MovieItemCard key={movie.id} data={movie}></MovieItemCard>)
        }
    </div>
}