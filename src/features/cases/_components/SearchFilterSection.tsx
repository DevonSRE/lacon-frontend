import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/hooks/redux";
import { states } from "@/lib/types";
import { Search } from "lucide-react";
import { ROLES } from "@/types/auth"; // assuming this enum is available

type Props = {
    clientNameSearch: string;
    setClientNameSearch: (value: string) => void;
    caseIdSearch: string;
    setCaseIdSearch: (value: string) => void;
    stateFilter: string;
    setStateFilter: (value: string) => void;
    caseTypeFilter: string;
    setCaseTypeFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
};

const SearchFilterSection: React.FC<Props> = ({
    clientNameSearch,
    setClientNameSearch,
    caseIdSearch,
    setCaseIdSearch,
    stateFilter,
    setStateFilter,
    caseTypeFilter,
    setCaseTypeFilter,
    statusFilter,
    setStatusFilter,
}) => {
    const { data: user } = useAppSelector((state) => state.profile);
    const role = user?.role;

    return (
        <div className="bg-white mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by Client Name"
                        className="pl-10 h-11"
                        value={clientNameSearch}
                        onChange={(e) => setClientNameSearch(e.target.value)}
                    />
                </div>
                {(role === ROLES.PLATFORM_ADMIN || role === ROLES.DIRECTOR_GENERAL || role === ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD || role === ROLES.DIO) && (
                    <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Case Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Criminal">Criminal</SelectItem>
                            <SelectItem value="Civil">Civil</SelectItem>
                            <SelectItem value="Decongestion">Decongestion</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                {(role === ROLES.PLATFORM_ADMIN || role === ROLES.DIRECTOR_GENERAL) && (
                    <>
                        {/* <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by Case ID"
                                className="pl-10 h-11"
                                value={caseIdSearch}
                                onChange={(e) => setCaseIdSearch(e.target.value)}
                            />
                        </div> */}

                        <Select value={stateFilter} onValueChange={setStateFilter}>
                            <SelectTrigger className="w-full h-11">
                                <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent className="h-60 overflow-y-auto">
                                {states.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>

                )}

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Case Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Unassiged">Unassiged</SelectItem>
                        <SelectItem value="Assigned">Assigned</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default SearchFilterSection;
