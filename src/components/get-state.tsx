
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { GetStates } from "@/server/actions/GetDetails";


export const GetState = ({
    placeholder,
    value,
    disabled,
    error,
    className,
    onValueChange, // 🔥 added
    onLoadingChange
}: {
    value: string;
    placeholder: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    onValueChange?: (value: string) => void; // 🔥 added
    onLoadingChange?: (loading: boolean) => void;
}) => {
    const { data, isLoading: loading } = useQuery({
        queryKey: ["states"],
        queryFn: async () => {
            const filters = {
                page: 1,
                size: 40,
            };
            return await GetStates(filters);
        },
        placeholderData: keepPreviousData,
        staleTime: 50000,
    });
    // ✅ Only call onLoadingChange when loading value changes
    const prevLoadingRef = useRef<boolean | null>(null);
    useEffect(() => {
        if (prevLoadingRef.current !== loading) {
            prevLoadingRef.current = loading;
            onLoadingChange?.(loading);
        }
    }, [loading, onLoadingChange]);


    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
    const handleDivisionChange = (newValue: string) => {
        if (newValue === "all") {
            setSelectedTitle("all");
            onValueChange?.("all"); // 🔥 Call parent if provided
            return;
        }
        setSelectedTitle(newValue);
        onValueChange?.(newValue); // 🔥 Call parent if provided
    };
    return (
        <div className="w-full space-y-4">
            <Select
                onValueChange={handleDivisionChange}
                value={selectedTitle ?? value} // 🔥 Fall back to parent value if local not picked
                name="state_id"
            >
                <SelectTrigger
                    className={cn("h-11", className, "flex justify-between items-center")}
                    disabled={loading || disabled}
                    loading={loading}
                    variant={error ? "error" : "underlined"}>
                    <SelectValue
                        className="text-neutral-700 text-xs mx-4"
                        placeholder={loading ? "Loading State..." : placeholder}
                    />
                </SelectTrigger>
                <SelectContent className="bg-white text-zinc-900">
                    {data?.data?.data?.length > 0 ? (
                        [...(data?.data?.data ?? [])] // clone to avoid mutating original
                            .sort((a, b) => a.title.localeCompare(b.title)) // 🔥 sort by title
                            .map((location: any) => (
                                <SelectItem key={location.id} value={location.id} className="py-2">
                                    {location.title}
                                </SelectItem>
                            ))
                    ) : (
                        <div className="py-2 px-4 text-sm text-gray-500">No State available</div>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};
