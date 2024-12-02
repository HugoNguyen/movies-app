import { NextRequest } from "next/server";
import { connect } from "@/utils/db";
import fs from "fs";

export function GET(request: NextRequest, context: any) {
    const movies = connect();

    console.log(`${request.url} => ${movies.length}`);

    const filterMovies = movies
        .sort((a, b) => a.id.localeCompare(b.id))
        .map(m => {
            const idx = m.id.indexOf('-');
            if (idx > -1) {
                return { ...m, actress: m.id.substring(0, idx)};
            }

            return m;
        })
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