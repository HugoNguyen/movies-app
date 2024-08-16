import fs from "fs";

export type Movie = {
    id: string;
    thumbnail: string;
    clips: string[];
}

export function connect() {
    console.log('connect to db');

    const movies = JSON.parse(fs.readFileSync('public/resources/data.json', 'utf8'));

    console.log(`Found ${movies.length} records`);

    return movies;
}