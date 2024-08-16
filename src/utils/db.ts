import fs from "fs";

export type Movie = {
    id: string;
    thumbnail: string;
    clips: string[];
}

export function connect() {
    const movies = JSON.parse(fs.readFileSync('public/resources/data.json', 'utf8'));
    return movies;
}