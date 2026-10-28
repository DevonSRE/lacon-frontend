import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { GetInActiveUsers, GetRoleSeats, type RoleSeat } from "@/server/actions/GetDetails";
import { uniqueRoleOptions } from "@/lib/user-invitation-options";

export const GetInActiveUser = ({
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
    queryKey: ["InActiveUsers"],
    queryFn: async () => {
      const filters = { page: 1, size: 40 };
      try {
        const result = await GetInActiveUsers(filters);
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

  // A filled single seat stays in the list, greyed out with its holder, so it does not look missing.
  // Only the DG and admins may read the holders; for anyone else this list is simply empty.
  const { data: seatData } = useQuery({
    queryKey: ["RoleSeats"],
    queryFn: GetRoleSeats,
    staleTime: 50000,
  });

  const prevLoadingRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevLoadingRef.current !== isLoading) {
      prevLoadingRef.current = isLoading;
      onLoadingChange?.(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const handleDivisionChange = (newValue: string) => {
    onValueChange?.(newValue);
  };
  const users = uniqueRoleOptions(data?.data);
  const filledSeats: RoleSeat[] = seatData?.success
    ? (seatData.data as RoleSeat[]).filter(seat => seat.holder && !users.includes(seat.role))
    : [];
  return (
    <Select
      onValueChange={handleDivisionChange}
      value={value}
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
        ) : users.length === 0 && filledSeats.length === 0 ? (
          <div className="py-2 px-4 text-sm text-gray-500">
            No user types available
          </div>
        ) : (
          <>
            {users.map((title: string) => (
              <SelectItem key={title} value={title} className="py-2">
                {title}
              </SelectItem>
            ))}
            {filledSeats.map(seat => (
              <SelectItem key={seat.role} value={seat.role} disabled className="py-2">
                {seat.role} – assigned to {seat.holder?.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};
