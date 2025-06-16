import React from 'react'
import BillResume from '../components/Bill/BillResume'
import Header from '../components/Header/Header'
import { ProductProvider } from '../context/ProductContext'
import { SaleProvider } from '../context/SaleContext'
import Footer from '../components/Footer/Footer'

const BillPage = () => {
    return (
        <>
            <Header />
            <ProductProvider>
                <SaleProvider>
                    <BillResume />
                </SaleProvider>
            </ProductProvider>
            <Footer />
        </>
    )
}

export default BillPage