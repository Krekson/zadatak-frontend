export interface Invoice {
    id: number,
    customId: string,
    partnerId: number,
    partnerName: string,
    date: Date,
    country: string,
    city: string,
    total: number
}