import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination';

type Props = {
    pagesAmount: number,
    currentWindowPage: string,
    onChange: () => void
}

const PageSelector = ({ pagesAmount, currentWindowPage, onChange }: Props) => {
    const [activePage, setActivePage] = useState(1);
    const currentPage = sessionStorage.getItem(currentWindowPage);

    useEffect(() => {
        if (currentPage) {
            const currentPageNum = parseInt(currentPage);
            setActivePage(currentPageNum);
        }
    }, [currentPage])

    const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setActivePage(value);
        sessionStorage.setItem(currentWindowPage, value.toString());
        onChange();
    };

    return (
        <footer className="d-flex justify-content-center mb-2" style={{ direction: "ltr" }}>
            <Pagination
                count={pagesAmount}
                page={activePage}
                showFirstButton
                showLastButton
                onChange={handleChangePage} />
        </footer>
    )
}

export default PageSelector