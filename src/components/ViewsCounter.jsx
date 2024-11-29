import { memo } from "react";
import SiteViews from "react-siteviews";
import Loading from "../assets/loading.gif";

const ViewsCounter = () => {
  return (
    <SiteViews
      projectName="JScompiler"
      refresh="10"
      placeHolder={<img src={Loading} className="size-[22px]" />}
      className="flex justify-center"
    />
  );
};

export default memo(ViewsCounter);
