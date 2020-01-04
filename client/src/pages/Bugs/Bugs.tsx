import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import http from "httpInstance";
import auth from "utils/authHelper";

const Bugs: React.FC = () => {
  const history = useHistory<any>();
  const [bugs, setBugs] = useState<any>([]);

  useEffect(() => {
    const getBugs = async () => {
      try {
        let res = await http({
          method: "GET",
          url: "/api/bugs"
        });
        setBugs(res.data.data);
      } catch (err) {
        auth.logout();
        history.push("/");
      }
    };

    getBugs();
  }, []);

  return (
    <div>
      {bugs.map((bug: any) => {
        return <h2>{bug.title}</h2>;
      })}
    </div>
  );
};

export default Bugs;
