import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export type StockCar = {
    id: string
    brand: string
    model: string
    year: number | null
    mileage: number | null
    color: string | null
    price: number | null
    currency: string | null
    location: string | null
    photos_urls: string[] | null
    video_url: string | null
    created_at: string
}

type StockState =
    | { status: 'loading' }
    | { status: 'ready'; cars: StockCar[] }
    | { status: 'unavailable' }

// Reads cars the team marked "show on website" in the app.
// If the view is not set up yet, the site simply hides the section.
export const useWebsiteStock = (limit = 12): StockState => {
    const [state, setState] = useState<StockState>({ status: 'loading' })

    useEffect(() => {
        let cancelled = false
        supabase
            .from('website_stock')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)
            .then(({ data, error }) => {
                if (cancelled) return
                if (error || !data) {
                    setState({ status: 'unavailable' })
                    return
                }
                setState({ status: 'ready', cars: data as StockCar[] })
            })
        return () => { cancelled = true }
    }, [limit])

    return state
}

export const formatStockPrice = (car: StockCar, language: 'ar' | 'fr'): string | null => {
    if (car.price == null) return null
    const amount = new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ').format(car.price)
    const unit = car.currency === 'DZD' || !car.currency ? (language === 'ar' ? 'دج' : 'DA') : car.currency
    return `${amount} ${unit}`
}
