"use client";

import { useEffect, useState } from "react";

interface Circle {
  id: number;
  size: number;
  color: string;
  x: number;
  y: number;
}

const AigenComp2 = () => {
  const [circles, setCircles] = useState<Circle[]>([]);

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      addCircle();
    }

    const interval = setInterval(() => {
      setCircles((prevCircles) => {
        let newCircles = [...prevCircles];
        if (newCircles.length >= 10) {
          const randomIndex = Math.floor(Math.random() * newCircles.length);
          newCircles = newCircles.filter((_, index) => index !== randomIndex);
        }
        const newCircle = createNewCircle();
        newCircles = [...newCircles, newCircle];

        return newCircles.slice(-11);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const createNewCircle = (): Circle => ({
    id: Math.random(),
    size: Math.floor(Math.random() * 135) + 15,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    x: Math.random() * 100,
    y: Math.random() * 100,
  });

  const addCircle = () => {
    setCircles((prevCircles) => [...prevCircles, createNewCircle()]);
  };

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
            zIndex: -1,
          }}
        />
      ))}
    </div>
  );
};

export default AigenComp2;
