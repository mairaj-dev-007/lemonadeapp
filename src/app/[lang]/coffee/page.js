import React from "react";
import { getDictionary } from "../../../../getDictionary";
import CoffeeClient from "./CoffeeClient";

export default async function Coffee({ params }) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  return <CoffeeClient dict={dict} lang={lang} />;
}
