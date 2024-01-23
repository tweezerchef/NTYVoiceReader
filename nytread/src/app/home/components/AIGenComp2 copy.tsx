"use client";

import { useEffect, useState } from "react";

const AigenComp2 = () => {
  const [circles, setCircles] = useState<any>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random circle object
      const circle = {
        id: Math.random(),
        size: Math.floor(Math.random() * 135) + 15, // Random size between 15 and 150
        color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
        x: Math.random() * 100, // Random position on the x-axis
        y: Math.random() * 100, // Random position on the y-axis
      };

      // Add the circle to the state array
      setCircles((prevCircles) => [...prevCircles, circle]);

      // Remove the circle after 500ms
      setTimeout(() => {
        setCircles((prevCircles) =>
          prevCircles.filter((c) => c.id !== circle.id)
        );
      }, 500);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
      <div className="flex items-center justify-center w-1/4 h-1/4 bg-red-500 rounded">
        AI GEN COMP
      </div>
      {circles.map((circle) => (
        <div
          key={circle.id}
          style={{
            position: "absolute",
            top: `${circle.y}%`,
            left: `${circle.x}%`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            borderRadius: "50%",
            backgroundColor: circle.color,
          }}
        />
      ))}
    </div>
  );
};

export default AigenComp2;
