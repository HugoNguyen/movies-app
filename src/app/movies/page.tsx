"use client"
import React, { useEffect, useState } from "react";
import { Movie } from '@/utils/db';
import MovieItemCard from "./components/movie-item-card";
import { usePathname, useRouter } from "next/navigation";

type PagingResponse = {
    total: number;
    data: Movie[];
    pageIndex: number;
    term: string;
    sort?: string; // fieldname-asc|desc
}

const PAGE_SIZE = 12;

const getMovies = (): Promise<Movie[]> => {
    return fetch("/api/movies")
        .then(res => res.json())
        .then((res: Movie[]) => res.sort((a, b) => a.id.localeCompare(b.id)));
}

export default function MoviesPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
        sort?: string; // fieldname:asc|desc
    };
}) {
    const pathname = usePathname();
    const { replace } = useRouter();

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sort = searchParams?.sort || '';

    const [sourceMovie, setSourceMovie] = useState<Movie[]>([]);
    const [movies, setMovies] = useState<PagingResponse>({
        total: 0,
        data: [],
        pageIndex: currentPage,
        term: query,
    });
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        getMovies().then(rs => setSourceMovie(rs));
    }, []);

    useEffect(() => {
        const tg = sourceMovie
            .flatMap(q => q.tags);

        const atr = sourceMovie
            .map(q => {
                const idx = q.id.indexOf('-');
                if (idx > -1) {
                    return q.id.substring(0, idx);
                }
                return q.id;
            });

        setTags(
            [...tg, ...atr]
                .filter(q => !!q)
                .filter((value, index, array) => array.indexOf(value) === index)
        );
    }, [sourceMovie]);

    useEffect(() => {
        setMovies(pre => {
            const skip = (pre.pageIndex - 1) * PAGE_SIZE;
            let filterdItems = pre.term ? (sourceMovie.filter(e => e.id.includes(pre.term) || e.tags.includes(pre.term))) : sourceMovie;

            if (pre.sort) {
                let sortBy = '';
                let direction = 'asc';
                if (pre.sort.indexOf(':')) {
                    [sortBy, direction] = pre.sort.split(':');
                } else {
                    sortBy = pre.sort;
                }

                filterdItems = filterdItems
                    .sort(
                        (a, b) => direction === 'asc'
                        ? (a as any)[sortBy].localeCompare((b as any)[sortBy])
                        : (b as any)[sortBy].localeCompare((a as any)[sortBy])
                    );
            }

            return {
                ...pre,
                total: filterdItems.length,
                data: filterdItems.slice(skip).slice(0, PAGE_SIZE),
            }
        })
    }, [sourceMovie, movies.term, movies.pageIndex, movies.sort]);

    function handleSearch(term: string, pageIndex: number, sort: string) {
        if (pageIndex < 1) return;
        if (movies.total <= (pageIndex - 1) * PAGE_SIZE) return;

        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        if (pageIndex) {
            params.set('page', pageIndex.toString());
        } else {
            params.delete('page');
        }

        if (sort) {
            params.set('sort', sort);
        } else {
            params.delete('sort');
        }

        replace(`${pathname}?${params.toString()}`);

        setMovies(pre => ({
            ...pre,
            pageIndex: pageIndex,
            term: term,
            sort: sort,
        }))
    }

    return <>
        <div className="container mx-auto p-6">
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={() => handleSearch(query, currentPage, 'createdAt')}>
                Asc
            </button>
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={() => handleSearch(query, currentPage, 'createdAt:desc')}>
                Desc
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-10 md:px-20">
            {
                movies.data.map(movie => <MovieItemCard key={movie.id} data={movie}></MovieItemCard>)
            }
        </div>
        <div className="flex justify-center p-6">
            {
                movies.pageIndex > 1
                &&
                <div
                    className="cursor-pointer flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => handleSearch(query, currentPage - 1, sort)}>
                    <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                    Previous
                </div>
            }
            {
                (movies.total > (movies.pageIndex) * PAGE_SIZE)
                &&
                <div
                    className="cursor-pointer flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => handleSearch(query, currentPage + 1, sort)}>
                    Next
                    <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </div>
            }
        </div>
        <div className="container mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Tag</h2>
                <div className="flex flex-wrap gap-2">
                    {
                        tags
                        && tags.map(
                            q => <div key={q} onClick={() => handleSearch(q, 1, sort)} className="cursor-pointer bg-blue-200 hover:bg-blue-300 py-1 px-2 rounded-lg text-sm">{q}</div>
                        )
                    }
                </div>
            </div>
        </div>
    </>
}