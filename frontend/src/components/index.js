import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
export function AddNew() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 180, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{
        scale: 0.9,
        borderRadius: "100%",
      }}
      className="fixed bottom-8 right-8 hidden rounded-full bg-slate-700 p-4 text-5xl text-white lg:block"
    >
      <NavLink to={"/new"}>
        <FiPlus />
      </NavLink>
    </motion.div>
  );
}

export const MenuLink = ({ icon, title, to, newClass }) => {
  return (
    <>
      <motion.li
        initial={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={newClass}
        whileHover={{ scale: 1.02 }}
        whileTap={{
          scale: 0.98,
          borderRadius: "100%",
        }}
      >
        <NavLink
          to={to}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          {icon}
          <span>{title}</span>
        </NavLink>
      </motion.li>
    </>
  );
};
export const BareLink = ({ icon, title, to, newClass }) => {
  return (
    <>
      <motion.li className={newClass}>
        <span>
          {icon}
          <span>{title}</span>
        </span>
      </motion.li>
    </>
  );
};
export { default as Sidebar } from "./sidebar";
export { default as Header } from "./header";
export { default as Footer } from "./footer";
export { default as ErrorPage } from "./error";
