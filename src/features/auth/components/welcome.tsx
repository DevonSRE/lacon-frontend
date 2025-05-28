'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Icons } from '@/icons/icons';
import { useEffect, useState } from 'react';

export default function WelcomePage() {
    const router = useRouter();
    const [count, setCount] = useState(0);
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const flowerWidth = 206; // Match the SVG width
            const flowersNeeded = Math.ceil(screenWidth / flowerWidth) + 1;
            setCount(flowersNeeded);
        };

        handleResize(); // Call initially
        window.addEventListener('resize', handleResize); // Recalculate on resize

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className="min-h-screen bg-[#F3FAFC] flex flex-col items-center justify-start  space-y-6 relative">
            {/* <Icons.flowerTop className='w-full h-auto' /> */}
            {/* <Icons.flowerTop className="w-full " /> */}
            <div className="w-screen overflow-hidden flex">
                {Array.from({ length: count }).map((_, i) => (
                    <Icons.flowerTop key={i} className="w-[206px] h-auto shrink-0" />
                ))}
            </div>

            <div className="text-center mt-12">
                <button
                    onClick={() => router.back()}
                    className=" top-6 left-6 text-white hover:text-black bg-gray-400 p-4 rounded-full mb-4">
                    <ArrowLeft size={28} />
                </button>
                <h1 className="text-xl font-semibold mb-1">Hello, Amaka!</h1>
                <p className="text-gray-700">You are Signed up as PDSS Officer</p>
            </div>

            {/* Role Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-4">
                {/* Learn My Role */}
                <div className="bg-white shadow rounded-2xl p-6 space-y-6 flex flex-col items-center justify-between">
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Icons.LearnMyRole className="w-8 h-8" />
                        </div>
                        <h2 className="font-semibold text-lg mb-1">Learn My Role</h2>
                        <p className="text-center text-gray-600">
                            Oversee System-wide activities and assign cases to departments
                        </p>
                    </div>
                    <button className="mt-6 w-full bg-black text-white py-4 text-xs px-4 rounded-sm hover:bg-gray-800 transition">
                        Learn About My Roles
                    </button>
                </div>

                {/* I Know What to Do */}
                <div className="bg-white shadow rounded-2xl p-6 space-y-6 flex flex-col items-center justify-between">
                    <div className="flex flex-col items-center">
                        <div className="bg-red-100 p-4 rounded-full mb-4">
                            <Icons.RedBulb className="w-8 h-8 " />
                        </div>
                        <h2 className="font-semibold text-lg mb-1">I Know What to Do</h2>
                        <p className="text-center text-gray-600">
                            Oversee System-wide activities and assign cases to departments
                        </p>
                    </div>
                    <button className="mt-6 w-full text-xs bg-[#C5402D] text-white py-4 px-4 rounded-sm hover:bg-[#a93723] transition">
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
}
