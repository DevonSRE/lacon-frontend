"use client";
import Link from "next/link";
import { ArrowRight, PlusCircle } from "lucide-react";
import { useAction } from "@/context/ActionContext";
import { useEffect } from "react";

export default function Navbar() {
    const { setSeletedStateId } = useAction();
    useEffect(() => {
       setSeletedStateId("");
    }, [setSeletedStateId]);
    const cardData = [
        {
            title: 'New Registration',
            description: 'To Register With the Council for ProBono Cases Click on the Button Below',
            buttonText: 'Click Me',
            link: '/probuno/registeration',
        },
        {
            title: 'Already Handling Probono Cases',
            description: 'If You are Already Handling Probono cases and wish to register with the council Click on the Button Below',
            buttonText: 'Click Me',
            link: '/probuno/cases',
        },
        {
            title: 'Update Case',
            description: 'If You are Already Registered with the council and wish to update your cases, click on the Button below for the Annual Case review Form.',
            buttonText: 'Click Me',
            link: '/probuno/update',
        },
    ];

    return (
        <div className="flex justify-center overflow-x-hidden overflow-y-auto w-full h-full">
            <div className="min-h-full bg-white px-6 py-12 w-full max-w-7xl">
                <h1 className="text-3xl font-semibold text-center mb-12">Probono Filing Process</h1>
                <div className="grid gap-8 md:grid-cols-3 mt-12 w-full">
                    {cardData.map((card, index) => (
                        <div key={index} className="border-t-8 border-2 space-y-8 
                        bg-gradient-to-b from-black/10 to-white
                        border-b-8 border-black shadow-lg rounded-lg overflow-hidden  flex flex-col justify-between w-full">
                            <div className="p-20 px-6 flex-1">
                                <h2 className="text-lg font-bold mb-4">{card.title}</h2>
                                <p className="text-sm text-gray-600">{card.description}</p>
                            </div>
                            <button className="bg-red-600 border-2 border-red-600 hover:bg-red-700 text-white py-3 px-4 flex items-center justify-center text-sm font-medium w-full">
                                <Link href={card.link} className="flex items-center justify-center w-full">
                                    {card.buttonText}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}