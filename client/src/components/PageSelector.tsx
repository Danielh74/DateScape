import { useEffect, useState } from 'react'


type Props = {
    pagesAmount: number,
    onChange: (activePage: number) => void
}

const PageSelector = ({ pagesAmount, onChange }: Props) => {
    const [activePage, setActivePage] = useState(1);

    useEffect(() => {
        const currentPage = sessionStorage.getItem('activePage');
        if (currentPage) {
            const currentPageNum = parseInt(currentPage);
            setActivePage(currentPageNum);
        }
    }, [])

    const handleChangePage = (action: string, index = 0) => {
        let newActivePage = activePage;
        if (action === 'increment' && activePage < pagesAmount) {
            newActivePage += 1;
        } else if (action === 'decrement' && activePage > 1) {
            newActivePage -= 1;
        } else if (action === 'random') {
            newActivePage = index + 1;
        }

        if (newActivePage !== activePage) {
            setActivePage(newActivePage);
            sessionStorage.setItem('activePage', newActivePage.toString());
            onChange(newActivePage);
        }
    };

    return (
        <p className="text-center">
            <button className="btn border-0" disabled={activePage === 1} onClick={() => handleChangePage('decrement')}>prev</button>
            {Array.from({ length: pagesAmount }, (_, index) =>
                <button
                    key={index}
                    className={`btn col mx-3 p-0 ${activePage === index + 1 && 'fw-bold'}`}
                    onClick={() => { handleChangePage('random', index) }}>
                    {index + 1}
                </button>
            )}
            <button className="btn border-0" disabled={activePage === pagesAmount} onClick={() => handleChangePage('increment')}>next</button>
        </p>
    )
}

export default PageSelector