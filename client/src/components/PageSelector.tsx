import React, { useEffect, useState } from 'react'
import { DateLocation } from '../models/DateLocation';

type Props = {
    viewAmount: number,
    locations: DateLocation[],
    onChange: () => void
}

const PageSelector = ({ viewAmount, locations, onChange }: Props) => {
    const [pages, setPages] = useState({ active: 1, amount: 0 });
    const [listBounds, setListBounds] = useState({ start: 0, end: viewAmount });

    useEffect(() => {
        const currentPage = sessionStorage.getItem('activePage');
        if (currentPage) {
            const currentPageNum = parseInt(currentPage);
            setPages(prev => ({ ...prev, active: currentPageNum }));
            setListBounds({ start: (currentPageNum - 1) * viewAmount, end: currentPageNum * viewAmount });
        }
    }, [viewAmount])

    const handleChangePage = (action: string, index = 0) => {
        if (action === 'increment' && pages.active < pages.amount) {
            setListBounds(prev => ({ start: prev.start + viewAmount, end: prev.end + viewAmount }));
            setPages({ ...pages, active: pages.active + 1 });
            sessionStorage.setItem('activePage', (pages.active + 1).toString());
        } else if (action === 'decrement' && pages.active > 1) {
            setListBounds(prev => ({ start: prev.start - viewAmount, end: prev.end - viewAmount }));
            setPages({ ...pages, active: pages.active - 1 });
            sessionStorage.setItem('activePage', (pages.active - 1).toString());
        } else if (action === 'random') {
            setListBounds({ start: (index) * viewAmount, end: (index + 1) * viewAmount });
            setPages({ ...pages, active: index + 1 });
            sessionStorage.setItem('activePage', (index + 1).toString())
        }
    };

    const pageValues = () => {
        return { listBounds, activePage: pages.active };
    }

    return (
        <p className="text-center">
            <button className="btn border-0" disabled={pages.active === 1} onClick={() => handleChangePage('decrement')}>prev</button>
            {/* {Array.from({length:pages.amount}, (_,i)=>
            <button
            key={i}
            className={`btn col mx-3 p-0 ${pages.active === i + 1 && 'fw-bold'}`}
            onClick={() => { handleChangePage('random', i) }}>
            {i + 1}
        </button>
            )} */}
            {locations.slice(0, pages.amount).map((_, index) =>
                <button
                    key={index}
                    className={`btn col mx-3 p-0 ${pages.active === index + 1 && 'fw-bold'}`}
                    onClick={() => { handleChangePage('random', index) }}>
                    {index + 1}
                </button>
            )}
            <button className="btn border-0" disabled={pages.active === pages.amount} onClick={() => handleChangePage('increment')}>next</button>
        </p>
    )
}

export default PageSelector