'use client'
import { useParams } from "next/navigation";
import UserRoles from "./userRole";
import LawyersRequest from "./LawyersRequest";
import Lawyers from "../dashboard/Lawyer/_components/lawyersManagement";
import ProbunoRequest from "./ProbunoRequest";
import ProbonoReviews from "./ProbonoReviews";
import MyRequests from "./MyRequests";
import DesignationLetter from "./DesignationLetter";

export default function USERROLS() {
  const params = useParams();
  const tab = params.tab;
  const renderTabContent = () => {
    switch (tab) {
      case 'all':
        return <UserRoles />;
      case 'request':
        return <LawyersRequest />;
      case 'my-requests':
        return <MyRequests />;
      case 'probuno-request':
        return <ProbunoRequest />;
      // The periodic case reviews pro bono lawyers send in. A submitted review
      // used to go nowhere anyone could see (QA 2026-11-01 run 4, 13 Nov,
      // row 32).
      case 'probono-reviews':
        return <ProbonoReviews />;
      case 'lawyers':
        return <Lawyers />;
      // case 'designation-letter':
      //   return <DesignationLetter />;
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