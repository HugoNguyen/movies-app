import fs from "fs";

export type Movie = {
    id: string;
    thumbnail: string;
    clips: string[];
    tags: string[];
    createdAt?: Date;
    actress: string;
}

export function connect() : Movie[] {
    const movies = JSON.parse(fs.readFileSync('public/resources/data.json', 'utf8')) as Movie[];
    return movies.map(m => ({ ...m, createdAt: m.createdAt ? new Date(m.createdAt) : undefined }));
}