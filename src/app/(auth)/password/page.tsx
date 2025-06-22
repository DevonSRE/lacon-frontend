// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// export default function Page() {
//     const router = useRouter();
//     useEffect(() => {
//         router.replace("/password/forgot");
//     }, [router]);
//     return (
//         <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
//             <Image src="/loading.gif" alt={""} width={100} height={20} className="h-10" />
//             <p className="text-black text-lg font-medium">Loading, Please wait ...</p>
//         </div>
//     );
// }

// app/password/redirect/page.tsx
import { redirect } from "next/navigation";


export default function RedirectPage() {
    redirect("/password/forgot");
}
