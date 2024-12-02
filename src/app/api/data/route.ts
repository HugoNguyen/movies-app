import { NextRequest } from "next/server";
import { connect } from "@/utils/db";
import fs from "fs";

export function GET(request: NextRequest, context: any) {
    const movies = connect();

    const filterMovies = movies
        .sort((a, b) => a.id.localeCompare(b.id))
        .map(m => {
            if (m.createdAt) return m;

            const path = `public/resources/${m.thumbnail}`;
            try {
                const stat = fs.statSync(path);
                return { ...m, createdAt: stat.ctime };
            }
            catch (error) {
                console.error(`Faild at path ${path}`);
            }
        });


    return Response.json(filterMovies);
}