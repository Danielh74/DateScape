import { Box } from "@mui/material"
import Skeleton from "@mui/material/Skeleton"
import { useTranslation } from 'react-i18next';

const Loader = () => {
    const { t } = useTranslation();
    return (
        <div
            className="position-absolute bg-light bg-opacity-75 w-100 h-100 z-1 align-content-center text-center fs-3 fw-bold rounded">
            {t('loading')}...
        </div>
    )
}

type Prop = {
    amount: number
}
const CardsLoader = ({ amount }: Prop) => {
    return (
        <div className="row my-3">
            {Array.from(new Array(amount)).map((_, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Skeleton variant="rectangular" height={118} />
                    <Box sx={{ pt: 0.5 }}>
                        <Skeleton />
                        <Skeleton width="60%" />
                    </Box>
                </div>
            ))}
        </div>
    )
}

const CardLoader = () => {
    return (
        <div className="vh-100">
            <Box>
                <Skeleton variant="rectangular" height={300} />
                <Box sx={{ pt: 0.5 }}>
                    <Skeleton height={50} sx={{ my: 2 }} />
                    <Skeleton width="60%" sx={{ my: 2 }} />
                    <Skeleton width="60%" sx={{ my: 2 }} />
                    <Skeleton width="60%" sx={{ my: 2 }} />
                </Box>
            </Box>
        </div>
    )
}

export { Loader, CardsLoader, CardLoader }