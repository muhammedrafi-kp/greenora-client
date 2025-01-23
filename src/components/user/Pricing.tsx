"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"

interface PricingPlan {
    duration: string
    price: string
    pricePerUnit: string
    features: Array<{ name: string; included: boolean }>
    highlighted?: boolean
}

const plans: PricingPlan[] = [
    {
        duration: "1 Month",
        price: "400",
        pricePerUnit: "₹80/Pickup",
        features: [
            { name: "5 pickups in a Month", included: true },
            { name: "Full Recycling & Scrap Management", included: true },
            { name: "24/7 Customer Support", included: true },
            { name: "Exclusive Eco-Impact Updates", included: false },
            { name: "Priority Scheduling", included: false },
        ],
    },
    {
        duration: "3 Months",
        price: "1125",
        pricePerUnit: "₹375/Month",
        features: [
            { name: "5 pickups in a Month", included: true },
            { name: "Full Recycling & Scrap Management", included: true },
            { name: "24/7 Customer Support", included: true },
            { name: "Exclusive Eco-Impact Updates", included: true },
            { name: "Priority Scheduling", included: false },
        ],
        highlighted: true,
    },
    {
        duration: "6 Months",
        price: "2100",
        pricePerUnit: "₹350/Month",
        features: [
            { name: "5 pickups in a Month", included: true },
            { name: "Full Recycling & Scrap Management", included: true },
            { name: "24/7 Customer Support", included: true },
            { name: "Exclusive Eco-Impact Updates", included: true },
            { name: "Priority Scheduling", included: true },
        ],
    },
]

export default function EnhancedPricingPlans() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    return (
        <div className="bg-gray-100 mx-auto min-h-screen py-16">
            <div className="container mx-auto px-4 mt-10">
                <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Select the perfect plan for your recycling needs. Our flexible options cater to various requirements and
                    budgets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-xl border shadow-lg transition-all duration-300 ${plan.highlighted
                                    ? "bg-[#0B4619] text-white transform scale-105 z-10"
                                    : "bg-white hover:shadow-xl hover:scale-102"
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-[#4ADE80] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="p-6 space-y-6">
                                <div className="text-center">
                                    <span
                                        className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${plan.highlighted ? "bg-white text-[#0B4619]" : "bg-[#E6F7ED] text-[#0B4619]"
                                            }`}
                                    >
                                        {plan.duration}
                                    </span>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-2xl">₹</span>
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                    </div>
                                    <p className={`text-sm mt-2 ${plan.highlighted ? "text-gray-300" : "text-gray-500"}`}>
                                        {plan.pricePerUnit}
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <Check className={`h-5 w-5 ${plan.highlighted ? "text-[#4ADE80]" : "text-[#0B4619]"}`} />
                                            ) : (
                                                <X className="h-5 w-5 text-gray-400" />
                                            )}
                                            <span className={`text-sm ${feature.included ? "font-medium" : "text-gray-500"}`}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => setSelectedPlan(plan.duration)}
                                    className={`w-full py-2 px-2 rounded-lg transition-colors text-lg font-semibold ${plan.highlighted
                                            ? "bg-white text-[#0B4619] hover:bg-gray-100"
                                            : "bg-[#4ADE80] text-white hover:bg-[#3EBE6F]"
                                        } ${selectedPlan === plan.duration ? "ring-4 ring-[#4ADE80] ring-opacity-50" : ""}`}
                                >
                                    {selectedPlan === plan.duration ? "Selected" : "Choose Plan"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-gray-600 mt-12 max-w-2xl mx-auto">
                    All plans include our eco-friendly waste management solutions. For custom enterprise solutions, please contact
                    our sales team.
                </p>
            </div>
        </div>
    )
}

