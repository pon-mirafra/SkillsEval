import { useEffect, useState } from "react";

const BrowserActivityTracker = () => {
  const [activityCount, setActivityCount] = useState(0);
  useEffect(() => {
    const handleActivity = () => {
      if (activityCount < 3) {
        setActivityCount((prevCount) => prevCount + 1);
      }
    };
    window.addEventListener("beforeunload", handleActivity);
    window.addEventListener("blur", handleActivity);
    window.addEventListener("resize", handleActivity);

    return () => {
      window.removeEventListener("beforeunload", handleActivity);
      window.removeEventListener("blur", handleActivity);
      window.removeEventListener("resize", handleActivity);
    };
  }, [activityCount]);
  return { activityCount, setActivityCount }
};

export default BrowserActivityTracker;
