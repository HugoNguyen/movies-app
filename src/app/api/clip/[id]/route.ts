import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

const CHUNK_SIZE = 10 ** 6; // 1MB

async function getVideoStream(request: NextRequest, name: string) {
    // Ensure there is a range given for the video
    const range = request.headers.get('range');
    if (!range) {
        return new NextResponse("Range header missing", { status: 400 });
    }

    const videoPath = `public/resources/${name}`;
    const videoSize = fs.statSync(videoPath).size;


    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": `${contentLength}`,
        "Content-Type": "video/mp4",
    };

    // create video read stream for this particular chunk
    const videoStream: any = fs.createReadStream(videoPath, { start, end });

    const res = new Response(videoStream, { status: 206, headers: headers })

    return res;
}

export async function GET(request: NextRequest, context: any) {
    const { params } = context;

    const id = params?.id;

    try {
        return await getVideoStream(request, id);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}