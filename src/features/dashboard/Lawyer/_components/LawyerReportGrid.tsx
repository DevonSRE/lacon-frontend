import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";

export default function LawyersReportGrid({caseData} : { caseData: { id: string; title: string; category: string; status: string; assignedDate: string }[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseData.map((item, idx) => (
                <Card key={idx} className="border p-4 relative">
                    <div className="absolute top-2 right-2 text-gray-400 cursor-pointer">
                        <MoreVertical size={16} />
                    </div>
                    <CardContent className="space-y-2">
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                            {item.status}
                        </span>
                        <p className="text-sm text-gray-400">{item.id}</p>
                        <h4 className="font-semibold leading-tight text-base">
                            {item.title}
                        </h4>
                        <p className="text-xs text-blue-500">{item.category}</p>
                        <p className="text-xs text-gray-400">
                            Assigned on {item.assignedDate}
                        </p>
                        <Button className="w-full bg-black text-white hover:bg-gray-900">
                            View
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}   