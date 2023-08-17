import React from "react";
import { motion } from "framer-motion";

const Animation = (props) => {
	return (
		<motion.div
  initial={{ backgroundColor: "blue" }}
  animate={{ backgroundColor: "green" }}
  exit={{ backgroundColor: "red" }}
  transition={{ duration: 0.5 }}
>
  {props.children}
</motion.div>
	);
};

export default Animation;
