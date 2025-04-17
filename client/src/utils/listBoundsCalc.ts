export const listBoundsCalc = (viewAmount: number) => {
    const currentPage = sessionStorage.getItem('activePage');
    if (currentPage) {
        const currentPageNum = parseInt(currentPage);
        return ({ start: (currentPageNum - 1) * viewAmount, end: currentPageNum * viewAmount });
    } else {
        return ({ start: 0, end: viewAmount });
    }
}