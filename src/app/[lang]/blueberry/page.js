import React from "react";
import { getDictionary } from "../../../../getDictionary";
import BlueberryClient from "./BlueberryClient";

export default async function Blueberry({ params }) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  return <BlueberryClient dict={dict} lang={lang} />;
}
