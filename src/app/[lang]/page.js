import React from "react";
import Image from "next/image";
import styles from "../../../page.module.css";
import lemon from "../../../assets/lemon.png";
import orange from "../../../assets/orange.png";
import blueberry from "../../../assets/blueberries.png";
import tea from "../../../assets/tea.png";
import coffee from "../../../assets/coffee-beans.png";
import mangoShake from "../../../assets/mango.png";
import { getDictionary } from "../../../getDictionary";
import HomeClient from "./HomeClient";

export default async function Home({ params }) {
  const lang  = params?.lang;
  const dict = await getDictionary(lang);
  
  return <HomeClient dict={dict} lang={lang} />;
}
