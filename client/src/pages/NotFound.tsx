import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div className='text-center mt-3'>
            <h1>{t("notFound.head")} &#x1F494;</h1>
            <p className='fw-medium fs-5'>{t("notFound.message1")}</p>
            <p className='fw-medium fs-5'>{t("notFound.message2")}</p>

            <Link className='btn btn-primary' to='/locations'>Go back home</Link>
        </div>
    )
}

export default NotFound