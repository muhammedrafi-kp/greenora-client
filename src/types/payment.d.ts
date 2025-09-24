export interface IWallet {
    userId: string;
    balance: number;
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

export interface IWalletTransaction {
    _id: string;
    type: "debit" | "credit" | "refund";
    amount: number;
    timestamp: Date;
    status: "pending" | "completed" | "failed";
    serviceType: string;
}
