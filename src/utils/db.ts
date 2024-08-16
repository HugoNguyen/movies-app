import fs from "fs";

export type Movie = {
    id: string;
    thumbnail: string;
    clips: string[];
}

let movies: Movie[] = [];

export function connect() {
    if (movies && movies.length > 0) return movies;

    movies = JSON.parse(fs.readFileSync('public/resources/data.json', 'utf8'));

    return movies;
}