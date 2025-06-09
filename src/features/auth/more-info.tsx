'use client'
import Link from "next/link"
import { Button } from "../../components/ui/button";

const MoreInfoComponent = () => {
    return (
        <>
            <div className="heading w-[400px]">
                <p className="font-bold text-3xl text-app-primary text-center">More Information Needed</p>
                <p className="text-center text-xs space-x-2 mt-3">
                    <span className=" text-center text-sm text-bold text-gray-400">To help recover your account, we&apos;ll need more <br /> information..</span>
                </p>
            </div>

            <div className="w-full space-y-6">
                <Button className="w-full bg-app-primary hover:bg-app-secondary/90 text-white h-12 rounded mt-2">
                    <Link href="/forgot">
                        Try Again
                    </Link>
                </Button>

            </div>
        </>
    )
}

export { MoreInfoComponent }
