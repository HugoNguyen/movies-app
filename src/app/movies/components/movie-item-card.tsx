import { Movie } from "@/utils/db";
import Link from "next/link";
import { useRouter } from 'next/navigation';

type Props = {
    data: Movie
}

const MovieItemCard = ({ data }: Props) => {
    const router = useRouter();
    
    const goToMovie = () => {
        router.push(`/movies/${data.id}`);
    }

    return <>
        <div className="flex px-3 py-3 cursor-pointer" onClick={goToMovie}>
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <img className="w-full" src={`/resources/${data.thumbnail}`} alt="" />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{data.id}</div>
                </div>
                <div className="px-6 py-4">
                    {
                        data.tags && data.tags.map(
                            e => <span key={e} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{e}</span>
                        )
                    }
                </div>
            </div>
        </div>
    </>
}

export default MovieItemCard;