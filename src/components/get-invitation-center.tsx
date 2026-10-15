"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvitationCenters } from "@/features/usersRole/invitation-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function GetInvitationCenter({ stateId, value, onValueChange }: {
  stateId: string; value: string; onValueChange: (value: string) => void;
}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["invitation-centers", stateId],
    enabled: !!stateId,
    queryFn: async () => {
      const result = await getInvitationCenters(stateId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });
  return <div>
    <Select name="center_id" value={value} onValueChange={onValueChange} required>
      <SelectTrigger disabled={!stateId || isLoading || isError || !data?.length}>
        <SelectValue placeholder={!stateId ? "Choose a state first" : isLoading ? "Loading centres..." : !data?.length ? "No centres available" : "Select designated centre"} />
      </SelectTrigger>
      <SelectContent>{data?.map(center => <SelectItem key={center.id} value={center.id}>{center.title}</SelectItem>)}</SelectContent>
    </Select>
    {isError && <p role="alert" className="mt-1 text-sm text-red-600">Could not load centres. <button type="button" className="underline" onClick={() => refetch()}>Try again</button></p>}
  </div>;
}
