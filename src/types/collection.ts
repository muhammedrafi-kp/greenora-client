export interface ICollection {
    _id: string;
    collectionId: string;
    collectorId: string;
    districtId: string;
    serviceAreaId: string;
    type: string;
    status: 'completed' | 'scheduled' | 'cancelled' | 'pending';
    payment: {
        paymentId?: string;
        advanceAmount?: number;
        advancePaymentStatus?: "success" | "pending" | "failed" | "refunded";
        advancePaymentMethod?: "online" | "wallet";
        amount?: number;
        method?: "online" | "wallet" | "cash";
        status?: "pending" | "success" | "failed" | "requested";
        orderId?: string;
        isPaymentRequested?: boolean;
        paidAt?: Date;
    }
    items: {
        categoryId: string;
        name: string;
        rate: number;
        qty: number;
    }[];
    estimatedCost: number;
    address: {
        name: string;
        mobile: string;
        pinCode: string;
        locality: string;
        addressLine: string;
    };
    instructions?: string;
    createdAt: string;
    preferredDate: string;
}

export interface ICategory {
    _id: string;
    name: string;
    type: "waste" | "scrap";
    description: string;
    rate: number;
}

export interface IItem {
    categoryId: string;
    name: string;
    rate: number;
    qty: number;
}

