export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            secretariats: {
                Row: {
                    id: string
                    name: string
                    shortName: string
                    contracted: number
                    consumed: number
                    remaining: number
                    status: string
                }
                Insert: {
                    id: string
                    name: string
                    shortName: string
                    contracted: number
                    consumed?: number
                    remaining: number
                    status: string
                }
                Update: {
                    id?: string
                    name?: string
                    shortName?: string
                    contracted?: number
                    consumed?: number
                    remaining?: number
                    status?: string
                }
            }
            transactions: {
                Row: {
                    date: string
                    driver: string
                    efficiency: number | null
                    fuelType: string
                    id: string
                    plate: string
                    status: string
                    time: string
                    value: number
                    volume: number
                }
                Insert: {
                    date: string
                    driver: string
                    efficiency?: number | null
                    fuelType: string
                    id: string
                    plate: string
                    status: string
                    time: string
                    value: number
                    volume: number
                }
                Update: {
                    date?: string
                    driver?: string
                    efficiency?: number | null
                    fuelType?: string
                    id?: string
                    plate?: string
                    status?: string
                    time?: string
                    value?: number
                    volume?: number
                }
            }
            vehicles: {
                Row: {
                    driver: string
                    model: string
                    plate: string
                    secretariat: string
                    status: string
                }
                Insert: {
                    driver: string
                    model: string
                    plate: string
                    secretariat: string
                    status: string
                }
                Update: {
                    driver?: string
                    model?: string
                    plate?: string
                    secretariat?: string
                    status?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
