'use client'
import { useParams } from "next/navigation";
import UserRoles from "./userRole";
import LawyersRequest from "./LawyersRequest";
import Lawyers from "../dashboard/Lawyer/_components/lawyersManagement";
import ProbunoRequest from "./ProbunoRequest";
import DesinationLetter from "./DesinationLetter";

export default function USERROLS() {
  const params = useParams();
  const tab = params.tab;
  const renderTabContent = () => {
    switch (tab) {
      case 'all':
        return <UserRoles />;
      case 'request':
        return <LawyersRequest />;
      case 'probuno-request':
        return <ProbunoRequest />;
      case 'lawyers':
        return <Lawyers />;
      case 'desination-letter':
        return <DesinationLetter />;
      default:
        return <>404 page </>;
    }
  };

  return (
    <div className="space-y-8 mb-20 pb-10 ">
      {renderTabContent()}
    </div>
  );
}