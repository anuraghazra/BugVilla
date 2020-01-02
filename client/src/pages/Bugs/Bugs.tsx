import React, { useState, useEffect } from 'react';
import http from 'httpInstance';

const Bugs: React.FC = () => {
  const [bugs, setBugs] = useState<any>([]);

  useEffect(() => {
    const getBugs = async () => {
      let res = await http({
        method: 'GET',
        url: '/api/bugs',
      })
      setBugs(res.data.data)
    }

    getBugs();
  }, [])
  return (
    <div>
      <h2>Bugs Page</h2>
      {bugs.map((bug: any) => {
        return <h2>{bug.title}</h2>
      })}
    </div>
  )
}

export default Bugs;