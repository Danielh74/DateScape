import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination';

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

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setActivePage(value);
        sessionStorage.setItem('activePage', value.toString());
        onChange(value);
    };

    return (
        <div className="d-flex justify-content-center mb-2">
            <Pagination
                count={pagesAmount}
                page={activePage}
                showFirstButton
                showLastButton
                onChange={handleChangePage} />
        </div>
    )
}

export default PageSelector