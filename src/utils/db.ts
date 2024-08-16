import fs from "fs";

export type Movie = {
    id: string;
    thumbnail: string;
    clips: string[];
    tags: string[];
}

export function connect() : Movie[] {
    const movies = JSON.parse(fs.readFileSync('public/resources/data.json', 'utf8'));
    return movies;
}