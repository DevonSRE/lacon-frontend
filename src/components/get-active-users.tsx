import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { GetActiveUsers } from "@/server/actions/GetDetails";

export const GetActiveUser = ({
  placeholder,
  value,
  disabled,
  error,
  className,
  onValueChange,
  onLoadingChange,
}: {
  value: string;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  onValueChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["activeUsers"],
    queryFn: async () => {
      const filters = { page: 1, size: 40 };
      try {
        const result = await GetActiveUsers(filters);
        console.log("Fetched users:", result); // ✅ Debug
        return result;
      } catch (err) {
        console.error("Failed to fetch users", err); // ✅ Debug
        throw err;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 50000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  const prevLoadingRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevLoadingRef.current !== isLoading) {
      prevLoadingRef.current = isLoading;
      onLoadingChange?.(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const handleDivisionChange = (newValue: string) => {
    setSelectedTitle(newValue);
    onValueChange?.(newValue);
  };
  console.log(data?.data);
  // ✅ Extract user list safely
  const users = data?.data ?? []; // Adjust this if structure differs!
  console.log(users);
  return (
    <Select
      onValueChange={handleDivisionChange}
      value={selectedTitle ?? value}
      name="user_type"
    >
      <SelectTrigger
        className={cn("h-11", className, "flex justify-between items-center")}
        disabled={isLoading || disabled}
        variant={error ? "error" : "underlined"}
      >
        <SelectValue
          className="text-neutral-700 text-xs mx-4"
          placeholder={isLoading ? "Loading User Types..." : placeholder}
        />
      </SelectTrigger>

      <SelectContent className="bg-white text-zinc-900">
        {isError ? (
          <div className="py-2 px-4 text-sm text-red-500">
            Failed to load users
          </div>
        ) : users.length === 0 ? (
          <div className="py-2 px-4 text-sm text-gray-500">
            No user types available
          </div>
        ) : (
          users
            .filter((title: any) => typeof title === "string")
            .sort((a: string, b: string) => a.localeCompare(b))
            .map((title: string) => (
              <SelectItem key={title} value={title} className="py-2">
                {title}
              </SelectItem>
            ))
        )}
      </SelectContent>
    </Select>
  );
};
