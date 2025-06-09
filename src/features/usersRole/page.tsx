'use client'
import { useParams } from "next/navigation";
import UserRoles from "./userRole";
import LawyersRequest from "./LawyersRequest";

export default function USERROLS() {
  const params = useParams();
  const tab = params.tab;
  const renderTabContent = () => {
    switch (tab) {
      case 'all':
        return <UserRoles />;
      case 'request':
        return <LawyersRequest />;
      default:
        return <>404 page </>;
    }
  };

  return (
    <div className=" mx-auto space-y-8 mb-20 pb-10 ">
      {renderTabContent()}
    </div>
  );
}