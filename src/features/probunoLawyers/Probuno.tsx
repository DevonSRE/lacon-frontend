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
    // Each card says who it is for and what happens after you use it, and each
    // button names the action rather than reading "Click Me"
    // (QA 2026-11-19, row 77).
    const cardData = [
        {
            title: 'New Registration',
            description: 'For lawyers not yet registered with the Council. Fill in the registration form and your application is reviewed by the Decongestion Unit, which emails you the decision.',
            buttonText: 'Register',
            link: '/probono/registration',
        },
        {
            title: 'Already Handling Probono Cases',
            description: 'For lawyers already handling pro bono cases who want to register them with the Council. List the cases you are holding and the Decongestion Unit reviews them with your application.',
            buttonText: 'Submit your cases',
            link: '/probono/cases',
        },
        {
            title: 'Update Case',
            description: 'For lawyers already registered with the Council. We email you a confirmation code, then the Annual Case Review form records how the cases you are handling have moved on.',
            buttonText: 'Start annual review',
            link: '/probono/update',
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