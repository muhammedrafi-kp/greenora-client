export interface IWallet {
    userId: string;
    balance: number;
    transactions: ITransaction[];
    status: "active" | "suspended" | "closed";
}

export interface ITransaction {
    _id: string;
    type: "debit" | "credit" | "refund";
    amount: number;
    timestamp: Date;
    status: "pending" | "completed" | "failed";
    serviceType: string;
}
